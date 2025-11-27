const cron = require('node-cron');
const Message = require('../models/Message');
const Group = require('../models/Group');
const Comment = require('../models/Comment');
const Problem = require('../models/Problem');
const News = require('../models/News');
const Hackathon = require('../models/Hackathon');

class DataCleanupService {
    constructor() {
        this.RETENTION_DAYS = 30;
        this.isRunning = false;
    }

    // Calculate the cutoff date (30 days ago)
    getCutoffDate() {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.setDate() - this.RETENTION_DAYS);
        return cutoffDate;
    }

    // Clean up old messages
    async cleanupMessages() {
        try {
            const cutoffDate = this.getCutoffDate();
            const result = await Message.deleteMany({
                timestamp: { $lt: cutoffDate }
            });
            console.log(`[CLEANUP] Deleted ${result.deletedCount} messages older than ${this.RETENTION_DAYS} days`);
            return result.deletedCount;
        } catch (error) {
            console.error('[CLEANUP] Error cleaning up messages:', error);
            return 0;
        }
    }

    // Clean up old groups (inactive for 30 days)
    async cleanupGroups() {
        try {
            const cutoffDate = this.getCutoffDate();
            const result = await Group.deleteMany({
                updatedAt: { $lt: cutoffDate }
            });
            console.log(`[CLEANUP] Deleted ${result.deletedCount} groups inactive for ${this.RETENTION_DAYS} days`);
            return result.deletedCount;
        } catch (error) {
            console.error('[CLEANUP] Error cleaning up groups:', error);
            return 0;
        }
    }

    // Clean up old comments
    async cleanupComments() {
        try {
            const cutoffDate = this.getCutoffDate();
            const result = await Comment.deleteMany({
                createdAt: { $lt: cutoffDate }
            });
            console.log(`[CLEANUP] Deleted ${result.deletedCount} comments older than ${this.RETENTION_DAYS} days`);
            return result.deletedCount;
        } catch (error) {
            console.error('[CLEANUP] Error cleaning up comments:', error);
            return 0;
        }
    }

    // Clean up old problems
    async cleanupProblems() {
        try {
            const cutoffDate = this.getCutoffDate();
            const result = await Problem.deleteMany({
                createdAt: { $lt: cutoffDate }
            });
            console.log(`[CLEANUP] Deleted ${result.deletedCount} problems older than ${this.RETENTION_DAYS} days`);
            return result.deletedCount;
        } catch (error) {
            console.error('[CLEANUP] Error cleaning up problems:', error);
            return 0;
        }
    }

    // Clean up old user-submitted news
    async cleanupUserNews() {
        try {
            const cutoffDate = this.getCutoffDate();
            const result = await News.deleteMany({
                userSubmitted: true,
                createdAt: { $lt: cutoffDate }
            });
            console.log(`[CLEANUP] Deleted ${result.deletedCount} user-submitted news older than ${this.RETENTION_DAYS} days`);
            return result.deletedCount;
        } catch (error) {
            console.error('[CLEANUP] Error cleaning up user news:', error);
            return 0;
        }
    }

    // Clean up old user-submitted hackathons
    async cleanupUserHackathons() {
        try {
            const cutoffDate = this.getCutoffDate();
            const result = await Hackathon.deleteMany({
                userSubmitted: true,
                createdAt: { $lt: cutoffDate }
            });
            console.log(`[CLEANUP] Deleted ${result.deletedCount} user-submitted hackathons older than ${this.RETENTION_DAYS} days`);
            return result.deletedCount;
        } catch (error) {
            console.error('[CLEANUP] Error cleaning up user hackathons:', error);
            return 0;
        }
    }

    // Run all cleanup tasks
    async runCleanup() {
        if (this.isRunning) {
            console.log('[CLEANUP] Cleanup already in progress, skipping...');
            return;
        }

        this.isRunning = true;
        console.log(`\n[CLEANUP] Starting automatic data cleanup (${this.RETENTION_DAYS} days retention)...`);

        const startTime = Date.now();
        let totalDeleted = 0;

        try {
            totalDeleted += await this.cleanupMessages();
            totalDeleted += await this.cleanupGroups();
            totalDeleted += await this.cleanupComments();
            totalDeleted += await this.cleanupProblems();
            totalDeleted += await this.cleanupUserNews();
            totalDeleted += await this.cleanupUserHackathons();

            const duration = ((Date.now() - startTime) / 1000).toFixed(2);
            console.log(`[CLEANUP] Completed! Total items deleted: ${totalDeleted} (took ${duration}s)\n`);
        } catch (error) {
            console.error('[CLEANUP] Error during cleanup:', error);
        } finally {
            this.isRunning = false;
        }
    }

    // Start the cleanup scheduler (runs daily at 2 AM)
    startScheduler() {
        console.log(`[CLEANUP] Data cleanup scheduler started (${this.RETENTION_DAYS} days retention)`);
        console.log('[CLEANUP] Scheduled to run daily at 2:00 AM');

        // Run cleanup daily at 2 AM
        cron.schedule('0 2 * * *', () => {
            console.log('[CLEANUP] Running scheduled cleanup...');
            this.runCleanup();
        });

        // Also run cleanup on startup (after 1 minute)
        setTimeout(() => {
            console.log('[CLEANUP] Running initial cleanup...');
            this.runCleanup();
        }, 60000);
    }

    // Manual cleanup trigger
    async manualCleanup() {
        console.log('[CLEANUP] Manual cleanup triggered');
        await this.runCleanup();
    }
}

// Create singleton instance
const dataCleanupService = new DataCleanupService();

module.exports = dataCleanupService;
