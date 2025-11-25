const mongoose = require('mongoose');
const errorMonitor = require('./errorMonitor');

class SelfHealing {
    constructor() {
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 5000; // Start with 5 seconds
    }

    async reconnectDatabase() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('\x1b[31m[SELF-HEALING]\x1b[0m Max reconnection attempts reached');
            await errorMonitor.logError(
                new Error('Database reconnection failed after max attempts'),
                { type: 'self-healing', attempts: this.reconnectAttempts }
            );
            return false;
        }

        this.reconnectAttempts++;
        const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1); // Exponential backoff

        console.log(`\x1b[33m[SELF-HEALING]\x1b[0m Attempting database reconnection (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms`);

        await new Promise(resolve => setTimeout(resolve, delay));

        try {
            if (mongoose.connection.readyState !== 1) {
                await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/technexus');
                console.log('\x1b[32m[SELF-HEALING]\x1b[0m Database reconnected successfully');
                this.reconnectAttempts = 0; // Reset on success
                return true;
            }
            return true;
        } catch (error) {
            console.error(`\x1b[31m[SELF-HEALING]\x1b[0m Reconnection attempt ${this.reconnectAttempts} failed:`, error.message);
            await errorMonitor.logError(error, {
                type: 'self-healing',
                attempt: this.reconnectAttempts
            });

            // Try again
            return await this.reconnectDatabase();
        }
    }

    clearMemoryCache() {
        try {
            if (global.gc) {
                global.gc();
                console.log('\x1b[32m[SELF-HEALING]\x1b[0m Garbage collection triggered');
                return true;
            } else {
                console.log('\x1b[33m[SELF-HEALING]\x1b[0m Garbage collection not available (run with --expose-gc)');
                return false;
            }
        } catch (error) {
            console.error('\x1b[31m[SELF-HEALING]\x1b[0m Failed to clear memory:', error.message);
            return false;
        }
    }

    async retryOperation(operation, maxRetries = 3, delayMs = 1000) {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const result = await operation();
                if (attempt > 1) {
                    console.log(`\x1b[32m[SELF-HEALING]\x1b[0m Operation succeeded on attempt ${attempt}`);
                }
                return { success: true, result };
            } catch (error) {
                console.error(`\x1b[33m[SELF-HEALING]\x1b[0m Attempt ${attempt}/${maxRetries} failed:`, error.message);

                if (attempt === maxRetries) {
                    await errorMonitor.logError(error, {
                        type: 'retry-failed',
                        attempts: maxRetries
                    });
                    return { success: false, error };
                }

                // Wait before retry with exponential backoff
                await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
            }
        }
    }

    setupDatabaseMonitoring() {
        mongoose.connection.on('disconnected', async () => {
            console.error('\x1b[31m[DATABASE]\x1b[0m MongoDB disconnected');
            await errorMonitor.logError(
                new Error('MongoDB connection lost'),
                { type: 'database-disconnect' }
            );

            // Attempt auto-reconnect
            await this.reconnectDatabase();
        });

        mongoose.connection.on('error', async (error) => {
            console.error('\x1b[31m[DATABASE]\x1b[0m MongoDB error:', error.message);
            await errorMonitor.logError(error, { type: 'database-error' });
        });

        mongoose.connection.on('reconnected', () => {
            console.log('\x1b[32m[DATABASE]\x1b[0m MongoDB reconnected');
            this.reconnectAttempts = 0;
        });
    }

    monitorMemory() {
        setInterval(() => {
            const used = process.memoryUsage();
            const heapUsedMB = Math.round(used.heapUsed / 1024 / 1024);
            const heapTotalMB = Math.round(used.heapTotal / 1024 / 1024);
            const usagePercent = Math.round((used.heapUsed / used.heapTotal) * 100);

            if (usagePercent > 90) {
                console.warn(`\x1b[31m[MEMORY]\x1b[0m Critical memory usage: ${usagePercent}%`);
                this.clearMemoryCache();

                errorMonitor.logError(
                    new Error(`Critical memory usage: ${usagePercent}%`),
                    { type: 'high-memory', heapUsedMB, heapTotalMB }
                );
            } else if (usagePercent > 80) {
                console.warn(`\x1b[33m[MEMORY]\x1b[0m High memory usage: ${usagePercent}%`);
            }
        }, 60000); // Check every minute
    }

    initialize() {
        console.log('\x1b[36m[SELF-HEALING]\x1b[0m Initializing self-healing system');
        this.setupDatabaseMonitoring();
        this.monitorMemory();
    }
}

module.exports = new SelfHealing();
