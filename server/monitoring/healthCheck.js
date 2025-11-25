const mongoose = require('mongoose');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

class HealthCheck {
    constructor() {
        this.healthLog = path.join(__dirname, '../logs/health.log');
        this.lastCheck = null;
        this.healthStatus = {
            database: 'unknown',
            apiEndpoints: 'unknown',
            memory: 'unknown',
            externalAPIs: 'unknown'
        };
    }

    async checkDatabase() {
        try {
            if (mongoose.connection.readyState === 1) {
                // Perform a simple query to verify connection
                await mongoose.connection.db.admin().ping();
                this.healthStatus.database = 'healthy';
                return { status: 'healthy', message: 'Database connected' };
            } else {
                this.healthStatus.database = 'unhealthy';
                return { status: 'unhealthy', message: 'Database disconnected' };
            }
        } catch (error) {
            this.healthStatus.database = 'unhealthy';
            return { status: 'unhealthy', message: error.message };
        }
    }

    async checkAPIEndpoints() {
        try {
            const endpoints = [
                'http://localhost:5000/api/news',
                'http://localhost:5000/api/hackathons',
                'http://localhost:5000/api/problems'
            ];

            const results = await Promise.allSettled(
                endpoints.map(url => axios.get(url, { timeout: 5000 }))
            );

            const failedEndpoints = results.filter(r => r.status === 'rejected').length;

            if (failedEndpoints === 0) {
                this.healthStatus.apiEndpoints = 'healthy';
                return { status: 'healthy', message: 'All endpoints responding' };
            } else if (failedEndpoints < endpoints.length) {
                this.healthStatus.apiEndpoints = 'degraded';
                return { status: 'degraded', message: `${failedEndpoints}/${endpoints.length} endpoints failing` };
            } else {
                this.healthStatus.apiEndpoints = 'unhealthy';
                return { status: 'unhealthy', message: 'All endpoints failing' };
            }
        } catch (error) {
            this.healthStatus.apiEndpoints = 'unhealthy';
            return { status: 'unhealthy', message: error.message };
        }
    }

    checkMemory() {
        const used = process.memoryUsage();
        const heapUsedMB = Math.round(used.heapUsed / 1024 / 1024);
        const heapTotalMB = Math.round(used.heapTotal / 1024 / 1024);
        const usagePercent = Math.round((used.heapUsed / used.heapTotal) * 100);

        let status = 'healthy';
        if (usagePercent > 90) {
            status = 'critical';
        } else if (usagePercent > 80) {
            status = 'warning';
        }

        this.healthStatus.memory = status;

        return {
            status,
            message: `Memory: ${heapUsedMB}MB / ${heapTotalMB}MB (${usagePercent}%)`,
            details: {
                heapUsed: heapUsedMB,
                heapTotal: heapTotalMB,
                usagePercent
            }
        };
    }

    async checkExternalAPIs() {
        try {
            const apis = [
                { name: 'Dev.to', url: 'https://dev.to/api/articles?per_page=1' },
                { name: 'Unstop', url: 'https://unstop.com/api/public/opportunity/search-result?opportunity=hackathons&per_page=1' }
            ];

            const results = await Promise.allSettled(
                apis.map(api => axios.get(api.url, { timeout: 10000 }))
            );

            const failedAPIs = results.filter(r => r.status === 'rejected').length;

            if (failedAPIs === 0) {
                this.healthStatus.externalAPIs = 'healthy';
                return { status: 'healthy', message: 'All external APIs accessible' };
            } else if (failedAPIs < apis.length) {
                this.healthStatus.externalAPIs = 'degraded';
                return { status: 'degraded', message: `${failedAPIs}/${apis.length} external APIs failing` };
            } else {
                this.healthStatus.externalAPIs = 'unhealthy';
                return { status: 'unhealthy', message: 'All external APIs failing' };
            }
        } catch (error) {
            this.healthStatus.externalAPIs = 'unhealthy';
            return { status: 'unhealthy', message: error.message };
        }
    }

    async performHealthCheck() {
        const timestamp = new Date().toISOString();

        const results = {
            timestamp,
            database: await this.checkDatabase(),
            apiEndpoints: await this.checkAPIEndpoints(),
            memory: this.checkMemory(),
            externalAPIs: await this.checkExternalAPIs()
        };

        this.lastCheck = results;

        // Log health check
        const logEntry = `[${timestamp}] Health Check:\n${JSON.stringify(results, null, 2)}\n\n`;
        try {
            fs.appendFileSync(this.healthLog, logEntry);
        } catch (error) {
            console.error('Failed to write health log:', error);
        }

        // Console output
        const overallStatus = this.getOverallStatus(results);
        const color = overallStatus === 'healthy' ? '\x1b[32m' : overallStatus === 'degraded' ? '\x1b[33m' : '\x1b[31m';
        console.log(`${color}[HEALTH CHECK]\x1b[0m Overall: ${overallStatus}`);

        return results;
    }

    getOverallStatus(results) {
        const statuses = [
            results.database.status,
            results.apiEndpoints.status,
            results.memory.status,
            results.externalAPIs.status
        ];

        if (statuses.includes('unhealthy') || statuses.includes('critical')) {
            return 'unhealthy';
        } else if (statuses.includes('degraded') || statuses.includes('warning')) {
            return 'degraded';
        } else {
            return 'healthy';
        }
    }

    getStatus() {
        return {
            lastCheck: this.lastCheck,
            currentStatus: this.healthStatus
        };
    }

    startPeriodicChecks(intervalMs = 300000) { // Default: 5 minutes
        console.log(`\x1b[36m[HEALTH CHECK]\x1b[0m Starting periodic health checks every ${intervalMs / 1000}s`);

        // Initial check
        this.performHealthCheck();

        // Periodic checks
        setInterval(() => {
            this.performHealthCheck();
        }, intervalMs);
    }
}

module.exports = new HealthCheck();
