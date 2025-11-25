require('dotenv').config();
const Groq = require('groq-sdk');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// FREE Tech News from Dev.to (no API key needed)
async function fetchFreeNews() {
    try {
        console.log('Fetching news from Dev.to...');
        let response = await fetch('https://dev.to/api/articles?top=7');

        if (!response.ok) {
            throw new Error(`Dev.to API responded with status: ${response.status}`);
        }

        let articles = await response.json();

        if (!Array.isArray(articles) || articles.length === 0) {
            console.log('No articles found with top=7, trying latest...');
            response = await fetch('https://dev.to/api/articles');
            articles = await response.json();
        }

        if (!Array.isArray(articles)) {
            console.error('Dev.to response is not an array:', articles);
            return getFallbackNews();
        }

        const mappedArticles = articles.slice(0, 5).map((a, idx) => ({
            id: idx + 1,
            title: a.title,
            summary: a.description || a.title,
            date: new Date(a.published_at).toISOString().split('T')[0],
            date: new Date(a.published_at).toISOString().split('T')[0],
            url: a.url,
            verified: true
        }));

        console.log(`Fetched ${mappedArticles.length} articles.`);
        return mappedArticles.length > 0 ? mappedArticles : getFallbackNews();

    } catch (error) {
        console.error('Failed to fetch Dev.to news:', error);
        return getFallbackNews();
    }
}

function getFallbackNews() {
    return [
        { id: 1, title: "AI Takes Over Web Development", summary: "How AI tools are changing the landscape of frontend coding.", date: new Date().toISOString().split('T')[0], url: "https://dev.to" },
        { id: 2, title: "React 19 Features Announced", summary: "Everything you need to know about the upcoming React release.", date: new Date().toISOString().split('T')[0], url: "https://react.dev" },
        { id: 3, title: "The Future of JavaScript", summary: "New proposals for ECMAScript 2026.", date: new Date().toISOString().split('T')[0], url: "https://github.com/tc39" }
    ];
}

// Comprehensive city to state mapping for ALL Indian states
const CITY_STATE_MAP = {
    // Andhra Pradesh
    'visakhapatnam': 'Andhra Pradesh', 'vijayawada': 'Andhra Pradesh', 'guntur': 'Andhra Pradesh', 'nellore': 'Andhra Pradesh', 'kurnool': 'Andhra Pradesh', 'tirupati': 'Andhra Pradesh',
    // Arunachal Pradesh
    'itanagar': 'Arunachal Pradesh', 'naharlagun': 'Arunachal Pradesh',
    // Assam
    'guwahati': 'Assam', 'silchar': 'Assam', 'dibrugarh': 'Assam', 'jorhat': 'Assam',
    // Bihar
    'patna': 'Bihar', 'gaya': 'Bihar', 'bhagalpur': 'Bihar', 'muzaffarpur': 'Bihar',
    // Chhattisgarh
    'raipur': 'Chhattisgarh', 'bhilai': 'Chhattisgarh', 'bilaspur': 'Chhattisgarh',
    // Goa
    'panaji': 'Goa', 'margao': 'Goa', 'vasco': 'Goa',
    // Gujarat
    'ahmedabad': 'Gujarat', 'surat': 'Gujarat', 'vadodara': 'Gujarat', 'rajkot': 'Gujarat', 'gandhinagar': 'Gujarat', 'jamnagar': 'Gujarat', 'bhavnagar': 'Gujarat',
    // Haryana
    'gurugram': 'Haryana', 'gurgaon': 'Haryana', 'faridabad': 'Haryana', 'panipat': 'Haryana', 'ambala': 'Haryana', 'karnal': 'Haryana', 'rohtak': 'Haryana',
    // Himachal Pradesh
    'shimla': 'Himachal Pradesh', 'dharamshala': 'Himachal Pradesh', 'manali': 'Himachal Pradesh',
    // Jharkhand
    'ranchi': 'Jharkhand', 'jamshedpur': 'Jharkhand', 'dhanbad': 'Jharkhand',
    // Karnataka
    'bangalore': 'Karnataka', 'bengaluru': 'Karnataka', 'mysore': 'Karnataka', 'mangalore': 'Karnataka', 'hubli': 'Karnataka', 'belgaum': 'Karnataka', 'manipal': 'Karnataka',
    // Kerala
    'thiruvananthapuram': 'Kerala', 'kochi': 'Kerala', 'kozhikode': 'Kerala', 'thrissur': 'Kerala', 'kollam': 'Kerala', 'kannur': 'Kerala',
    // Madhya Pradesh
    'bhopal': 'Madhya Pradesh', 'indore': 'Madhya Pradesh', 'gwalior': 'Madhya Pradesh', 'jabalpur': 'Madhya Pradesh', 'ujjain': 'Madhya Pradesh',
    // Maharashtra
    'mumbai': 'Maharashtra', 'pune': 'Maharashtra', 'nagpur': 'Maharashtra', 'nashik': 'Maharashtra', 'aurangabad': 'Maharashtra', 'solapur': 'Maharashtra', 'thane': 'Maharashtra', 'navi mumbai': 'Maharashtra',
    // Manipur
    'imphal': 'Manipur',
    // Meghalaya
    'shillong': 'Meghalaya',
    // Mizoram
    'aizawl': 'Mizoram',
    // Nagaland
    'kohima': 'Nagaland', 'dimapur': 'Nagaland',
    // Odisha
    'bhubaneswar': 'Odisha', 'cuttack': 'Odisha', 'rourkela': 'Odisha',
    // Punjab
    'chandigarh': 'Punjab', 'ludhiana': 'Punjab', 'amritsar': 'Punjab', 'jalandhar': 'Punjab', 'patiala': 'Punjab', 'bathinda': 'Punjab',
    // Rajasthan
    'jaipur': 'Rajasthan', 'jodhpur': 'Rajasthan', 'udaipur': 'Rajasthan', 'kota': 'Rajasthan', 'ajmer': 'Rajasthan', 'bikaner': 'Rajasthan',
    // Sikkim
    'gangtok': 'Sikkim',
    // Tamil Nadu
    'chennai': 'Tamil Nadu', 'coimbatore': 'Tamil Nadu', 'madurai': 'Tamil Nadu', 'tiruchirappalli': 'Tamil Nadu', 'salem': 'Tamil Nadu', 'tirunelveli': 'Tamil Nadu', 'vellore': 'Tamil Nadu',
    // Telangana
    'hyderabad': 'Telangana', 'warangal': 'Telangana', 'nizamabad': 'Telangana',
    // Tripura
    'agartala': 'Tripura',
    // Uttar Pradesh
    'lucknow': 'Uttar Pradesh', 'kanpur': 'Uttar Pradesh', 'agra': 'Uttar Pradesh', 'varanasi': 'Uttar Pradesh', 'meerut': 'Uttar Pradesh', 'allahabad': 'Uttar Pradesh', 'prayagraj': 'Uttar Pradesh', 'bareilly': 'Uttar Pradesh', 'aligarh': 'Uttar Pradesh', 'moradabad': 'Uttar Pradesh', 'noida': 'Uttar Pradesh', 'greater noida': 'Uttar Pradesh',
    // Uttarakhand
    'dehradun': 'Uttarakhand', 'haridwar': 'Uttarakhand', 'roorkee': 'Uttarakhand', 'nainital': 'Uttarakhand',
    // West Bengal
    'kolkata': 'West Bengal', 'howrah': 'West Bengal', 'durgapur': 'West Bengal', 'asansol': 'West Bengal', 'siliguri': 'West Bengal',
    // Union Territories
    'delhi': 'Delhi', 'new delhi': 'Delhi', 'puducherry': 'Puducherry', 'pondicherry': 'Puducherry', 'port blair': 'Andaman and Nicobar', 'daman': 'Dadra and Nagar Haveli and Daman and Diu', 'silvassa': 'Dadra and Nagar Haveli and Daman and Diu', 'leh': 'Ladakh', 'kargil': 'Ladakh', 'srinagar': 'Jammu and Kashmir', 'jammu': 'Jammu and Kashmir'
};

// Real Hackathon fetching from Unstop (India's #1 platform)
async function fetchUnstopHackathons() {
    try {
        console.log('Fetching India hackathons from Unstop...');

        const response = await fetch('https://unstop.com/api/public/opportunity/search-result?opportunity=hackathons&per_page=10');

        if (!response.ok) {
            console.log('Unstop API not accessible, using fallback...');
            return [];
        }

        const data = await response.json();

        if (!data.data || !data.data.data || data.data.data.length === 0) {
            console.log('No hackathons from Unstop...');
            return [];
        }

        const hackathons = data.data.data;

        const mappedHackathons = hackathons.slice(0, 10).map((h, idx) => {
            let venueType = 'Online'; // Default to Online
            let city = '';
            let state = '';

            // Get location from multiple possible fields
            const location = (
                h.displayed_location?.location ||
                h.location ||
                h.venue ||
                h.city ||
                ''
            ).toLowerCase();

            console.log(`Hackathon: ${h.title}, Location data: "${location}"`);

            // Check for hybrid first
            if (location.includes('hybrid')) {
                venueType = 'Hybrid';
            }
            // Check for online keywords
            else if (location.includes('online') || location.includes('virtual') || location === '' || location === 'india') {
                venueType = 'Online';
                state = 'Pan India';
            }
            // Check for offline/city mentions
            else {
                let foundCity = false;
                for (const [cityName, stateName] of Object.entries(CITY_STATE_MAP)) {
                    if (location.includes(cityName)) {
                        venueType = 'Offline';
                        city = cityName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                        state = stateName;
                        foundCity = true;
                        break;
                    }
                }

                // If we found city-like words but no match, it's likely offline
                if (!foundCity && (location.includes('offline') || location.length > 3)) {
                    venueType = 'Offline';
                    // Try to extract state from organization name
                    const orgName = (h.organisation_name || '').toLowerCase();
                    for (const [cityName, stateName] of Object.entries(CITY_STATE_MAP)) {
                        if (orgName.includes(cityName)) {
                            city = cityName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                            state = stateName;
                            break;
                        }
                    }
                }
            }

            // Parse Prize
            let prizeAmount = 'TBD';
            if (h.prizes) {
                // If prize is a string/number
                if (typeof h.prizes === 'string' || typeof h.prizes === 'number') {
                    prizeAmount = `₹${h.prizes}`;
                }
                // If prize is an array (Unstop usually returns an array of prizes)
                else if (Array.isArray(h.prizes)) {
                    // Try to find the total cash prize or the first prize
                    const cashPrize = h.prizes.find(p => p.type === 'cash' || p.amount);
                    if (cashPrize) {
                        prizeAmount = `₹${cashPrize.amount || cashPrize.total || 'TBD'}`;
                    } else {
                        prizeAmount = 'Prizes Available';
                    }
                }
                // If prize is an object
                else if (typeof h.prizes === 'object') {
                    prizeAmount = `₹${h.prizes.total || h.prizes.amount || 'TBD'}`;
                }
            }

            return {
                id: `unstop-${idx + 1}`,
                name: h.title || h.name,
                date: h.organisation_name || 'Unknown Organizer', // Using 'date' field for Organizer Name (legacy compatibility)
                status: h.status === 'open' ? 'Open' : 'Upcoming',
                url: h.regnRequirements?.url || h.registration_url || `https://unstop.com/${h.public_url || h.slug}`,
                prize: prizeAmount,
                deadline: h.end_date || h.deadline,
                venueType: venueType,
                city: city || 'Multiple Cities',
                state: state || 'Pan India',
                state: state || 'Pan India',
                source: 'Unstop',
                verified: true
            };
        });

        console.log(`Fetched ${mappedHackathons.length} hackathons from Unstop.`);
        return mappedHackathons;

    } catch (error) {
        console.error('Failed to fetch Unstop hackathons:', error);
        return [];
    }
}

// Fetch from Devfolio (IIT/College hackathons)
async function fetchDevfolioHackathons() {
    try {
        console.log('Fetching hackathons from Devfolio...');

        // Devfolio public API endpoint
        const response = await fetch('https://api.devfolio.co/api/hackathons?page=1&per_page=10');

        if (!response.ok) {
            console.log('Devfolio API not accessible...');
            return [];
        }

        const data = await response.json();

        if (!data.hackathons || data.hackathons.length === 0) {
            return [];
        }

        const mappedHackathons = data.hackathons.map((h, idx) => ({
            id: `devfolio-${idx + 1}`,
            name: h.name,
            date: h.organizer || 'India',
            status: h.status === 'UPCOMING' ? 'Upcoming' : 'Open',
            url: `https://devfolio.co/hackathons/${h.slug}`,
            prize: h.prize_pool ? `₹${h.prize_pool}` : 'TBD',
            deadline: h.ends_at || 'TBD',
            venueType: h.is_online ? 'Online' : (h.is_hybrid ? 'Hybrid' : 'Offline'),
            city: h.city || 'Multiple Cities',
            state: h.state || 'Pan India',
            source: 'Devfolio',
            verified: true
        }));

        console.log(`Fetched ${mappedHackathons.length} hackathons from Devfolio.`);
        return mappedHackathons;

    } catch (error) {
        console.error('Failed to fetch Devfolio hackathons:', error);
        return [];
    }
}

// Fetch from MLH (Major League Hacking)
async function fetchMLHHackathons() {
    try {
        console.log('Fetching hackathons from MLH...');
        return [];
    } catch (error) {
        console.error('Failed to fetch MLH hackathons:', error);
        return [];
    }
}

// Fetch from HackerEarth
async function fetchHackerEarthHackathons() {
    try {
        console.log('Fetching hackathons from HackerEarth...');
        const response = await fetch('https://www.hackerearth.com/chrome-extension/events/');
        if (!response.ok) return [];
        const data = await response.json();
        if (!data.response) return [];

        return data.response
            .filter(h => h.type === 'hackathon' && h.country === 'India')
            .slice(0, 5)
            .map((h, idx) => ({
                id: `hackerearth-${idx + 1}`,
                name: h.title,
                date: h.organization || 'India',
                status: h.status === 'ONGOING' ? 'Open' : 'Upcoming',
                url: h.url || `https://www.hackerearth.com${h.challenge_url}`,
                prize: h.prize || 'TBD',
                deadline: h.end_date || 'TBD',
                venueType: 'Online',
                city: 'Multiple Cities',
                state: 'Pan India',
                source: 'HackerEarth'
            }));
    } catch (error) {
        console.error('Failed to fetch HackerEarth hackathons:', error);
        return [];
    }
}

// Combine all sources
async function fetchRealHackathons() {
    try {
        console.log('🔄 Fetching hackathons from multiple sources...');

        const [unstopHackathons, devfolioHackathons, mlhHackathons, hackerEarthHackathons] = await Promise.all([
            fetchUnstopHackathons(),
            fetchDevfolioHackathons(),
            fetchMLHHackathons(),
            fetchHackerEarthHackathons()
        ]);

        let allHackathons = [
            ...unstopHackathons,
            ...devfolioHackathons,
            ...mlhHackathons,
            ...hackerEarthHackathons
        ];

        // Remove duplicates
        const uniqueHackathons = [];
        const seenNames = new Set();
        for (const hackathon of allHackathons) {
            const normalizedName = hackathon.name.toLowerCase().trim();
            if (!seenNames.has(normalizedName)) {
                seenNames.add(normalizedName);
                uniqueHackathons.push(hackathon);
            }
        }

        const sortedHackathons = uniqueHackathons
            .sort((a, b) => {
                if (a.status === 'Open' && b.status !== 'Open') return -1;
                if (a.status !== 'Open' && b.status === 'Open') return 1;
                return 0;
            })
            .slice(0, 15);

        console.log(`✅ Total: ${sortedHackathons.length} unique hackathons`);
        return sortedHackathons.length > 0 ? sortedHackathons : getFallbackHackathons();

    } catch (error) {
        console.error('Failed to fetch hackathons from all sources:', error);
        return getFallbackHackathons();
    }
}

function getFallbackHackathons() {
    return [
        { id: 1, name: "Smart India Hackathon 2025", date: "Government of India", status: "Open", url: "https://www.sih.gov.in/sih2024", prize: "₹1,00,000", deadline: "Jan 2026", venueType: "Hybrid", city: "Multiple Cities", state: "Pan India" },
        { id: 2, name: "HackWithInfy 2025", date: "Infosys", status: "Open", url: "https://www.hackerrank.com/hackwithinfy", prize: "₹3,00,000", deadline: "Feb 2026", venueType: "Online", city: "Multiple Cities", state: "Pan India" },
        { id: 3, name: "Google Solution Challenge", date: "Google", status: "Upcoming", url: "https://developers.google.com/community/gdsc-solution-challenge", prize: "$3,000", deadline: "Mar 2026", venueType: "Online", city: "Multiple Cities", state: "Pan India" }
    ];
}

// Auto-refresh data every 24 hours
let cachedNews = [];
let cachedHackathons = [];

async function refreshData() {
    console.log('🔄 Refreshing news and hackathons...');

    const [news, hackathons] = await Promise.all([
        fetchFreeNews(),
        fetchRealHackathons()
    ]);

    if (news.length > 0) cachedNews = news;
    if (hackathons.length > 0) cachedHackathons = hackathons;

    console.log(`✅ Updated: ${cachedNews.length} news, ${cachedHackathons.length} India hackathons from Unstop (Daily Updates)`);
}

// Refresh on startup
refreshData();

// Auto-refresh every 24 hours (daily updates)
setInterval(refreshData, 24 * 60 * 60 * 1000);

module.exports = {
    getNews: () => cachedNews,
    getHackathons: () => cachedHackathons,
    refreshData
};
