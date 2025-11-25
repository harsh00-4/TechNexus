const axios = require('axios');
const fs = require('fs');
const path = require('path');
const errorMonitor = require('./errorMonitor');
const selfHealing = require('./selfHealing');
const alertSystem = require('./alertSystem');

let newsArticles = [];
let hackathons = [];
let lastUpdate = null;
let updateInProgress = false;

const updateLog = path.join(__dirname, '../logs/updates.log');

function logUpdate(message) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}\n`;

    try {
        fs.appendFileSync(updateLog, logEntry);
    } catch (error) {
        console.error('Failed to write update log:', error);
    }

    console.log(`\x1b[36m[AUTO-UPDATE]\x1b[0m ${message}`);
}

async function fetchNewsWithRetry() {
    const operation = async () => {
        const response = await axios.get('https://dev.to/api/articles?per_page=5&top=7', {
            timeout: 10000
        });
        return response.data;
    };

    const result = await selfHealing.retryOperation(operation, 3, 2000);

    if (result.success) {
        return result.result;
    } else {
        throw result.error;
    }
}

async function fetchHackathonsWithRetry() {
    const operation = async () => {
        const response = await axios.get(
            'https://unstop.com/api/public/opportunity/search-result?opportunity=hackathons&per_page=10',
            {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                },
                timeout: 15000
            }
        );
        return response.data;
    };

    const result = await selfHealing.retryOperation(operation, 3, 3000);

    if (result.success) {
        return result.result;
    } else {
        throw result.error;
    }
}

async function updateNews() {
    try {
        logUpdate('Starting news update...');

        const articles = await fetchNewsWithRetry();

        newsArticles = articles.map((article, index) => ({
            id: index + 1,
            title: article.title,
            summary: article.description || article.title,
            date: new Date(article.published_at).toISOString().split('T')[0],
            url: article.url
        }));

        logUpdate(`✅ News updated: ${newsArticles.length} articles`);
        await alertSystem.sendUpdateNotification('News', true, { count: newsArticles.length });

        return newsArticles;
    } catch (error) {
        logUpdate(`❌ News update failed: ${error.message}`);
        await errorMonitor.logError(error, { type: 'news-update-failed' });
        await alertSystem.sendUpdateNotification('News', false, { error: error.message });

        // Return cached data if available
        if (newsArticles.length > 0) {
            logUpdate('Using cached news data');
            return newsArticles;
        }

        throw error;
    }
}

async function updateHackathons() {
    try {
        logUpdate('Starting hackathon update...');

        const data = await fetchHackathonsWithRetry();

        if (data.data && data.data.data) {
            hackathons = data.data.data.map(h => ({
                id: h.id,
                name: h.title,
                prize: h.regnRequirement?.eligibilities?.[0] || 'Prizes Available',
                location: h.location || 'Pan India',
                organizer: h.organisation?.name || 'Organizer',
                status: h.status || 'Upcoming',
                url: `https://unstop.com/hackathons/${h.public_url}`
            }));

            logUpdate(`✅ Hackathons updated: ${hackathons.length} events`);
            await alertSystem.sendUpdateNotification('Hackathons', true, { count: hackathons.length });

            return hackathons;
        } else {
            throw new Error('Invalid hackathon data structure');
        }
    } catch (error) {
        logUpdate(`❌ Hackathon update failed: ${error.message}`);
        await errorMonitor.logError(error, { type: 'hackathon-update-failed' });
        await alertSystem.sendUpdateNotification('Hackathons', false, { error: error.message });

        // Return cached data if available
        if (hackathons.length > 0) {
            logUpdate('Using cached hackathon data');
            return hackathons;
        }

        throw error;
    }
}

async function refreshData() {
    if (updateInProgress) {
        logUpdate('Update already in progress, skipping...');
        return;
    }

    updateInProgress = true;
    const startTime = Date.now();

    try {
        logUpdate('=== Starting data refresh ===');

        // Update both in parallel
        const [newsResult, hackathonsResult] = await Promise.allSettled([
            updateNews(),
            updateHackathons()
        ]);

        lastUpdate = new Date().toISOString();
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);

        logUpdate(`=== Data refresh completed in ${duration}s ===`);
        logUpdate(`News: ${newsResult.status}, Hackathons: ${hackathonsResult.status}`);

    } catch (error) {
        logUpdate(`❌ Data refresh error: ${error.message}`);
        await errorMonitor.logError(error, { type: 'data-refresh-failed' });
    } finally {
        updateInProgress = false;
    }
}

function startAutoUpdates() {
    const newsInterval = parseInt(process.env.UPDATE_NEWS_INTERVAL) || 10800000; // 3 hours
    const hackathonInterval = parseInt(process.env.UPDATE_HACKATHONS_INTERVAL) || 21600000; // 6 hours

    logUpdate(`Auto-updates initialized:`);
    logUpdate(`- News: Every ${newsInterval / 1000 / 60} minutes`);
    logUpdate(`- Hackathons: Every ${hackathonInterval / 1000 / 60} minutes`);

    // Initial update
    refreshData();

    // Schedule periodic updates
    setInterval(updateNews, newsInterval);
    setInterval(updateHackathons, hackathonInterval);
}

function getNews() {
    return newsArticles;
}

function getHackathons() {
    return hackathons;
}

function getUpdateStatus() {
    return {
        lastUpdate,
        newsCount: newsArticles.length,
        hackathonCount: hackathons.length,
        updateInProgress
    };
}

module.exports = {
    startAutoUpdates,
    refreshData,
    getNews,
    getHackathons,
    getUpdateStatus
};
