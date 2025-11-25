const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

class AlertSystem {
    constructor() {
        this.alertLog = path.join(__dirname, '../logs/alerts.log');
        this.alertThrottle = new Map(); // Track alert frequency
        this.throttleWindow = 3600000; // 1 hour
        this.enabled = process.env.ALERT_ENABLED === 'true';
        this.adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
    }

    shouldSendAlert(alertType) {
        if (!this.enabled) return false;

        const lastAlert = this.alertThrottle.get(alertType);
        const now = Date.now();

        if (lastAlert && (now - lastAlert) < this.throttleWindow) {
            return false; // Throttled
        }

        this.alertThrottle.set(alertType, now);
        return true;
    }

    async sendEmail(subject, htmlContent) {
        if (!this.adminEmail) {
            console.warn('\x1b[33m[ALERT]\x1b[0m No admin email configured');
            return false;
        }

        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: this.adminEmail,
                subject: `[TechNexus Alert] ${subject}`,
                html: htmlContent
            });

            console.log(`\x1b[32m[ALERT]\x1b[0m Email sent: ${subject}`);
            return true;
        } catch (error) {
            console.error('\x1b[31m[ALERT]\x1b[0m Failed to send email:', error.message);
            return false;
        }
    }

    async sendCriticalAlert(error, context = {}) {
        const alertType = 'critical-error';

        if (!this.shouldSendAlert(alertType)) {
            console.log(`\x1b[33m[ALERT]\x1b[0m Critical alert throttled`);
            return;
        }

        const subject = `🚨 Critical Error Detected`;
        const html = `
            <h2 style="color: #dc2626;">🚨 Critical Error</h2>
            <p><strong>Time:</strong> ${new Date().toISOString()}</p>
            <p><strong>Error:</strong> ${error.message}</p>
            <p><strong>Context:</strong> ${JSON.stringify(context, null, 2)}</p>
            <h3>Stack Trace:</h3>
            <pre style="background: #f3f4f6; padding: 10px; border-radius: 5px;">${error.stack || 'N/A'}</pre>
            <p style="color: #dc2626;"><strong>Action Required:</strong> Immediate attention needed</p>
        `;

        await this.sendEmail(subject, html);
        this.logAlert('critical', subject, error.message);
    }

    async sendWarningAlert(message, details = {}) {
        const alertType = 'warning';

        if (!this.shouldSendAlert(alertType)) {
            console.log(`\x1b[33m[ALERT]\x1b[0m Warning alert throttled`);
            return;
        }

        const subject = `⚠️ Warning: ${message}`;
        const html = `
            <h2 style="color: #f59e0b;">⚠️ Warning</h2>
            <p><strong>Time:</strong> ${new Date().toISOString()}</p>
            <p><strong>Message:</strong> ${message}</p>
            <p><strong>Details:</strong></p>
            <pre style="background: #f3f4f6; padding: 10px; border-radius: 5px;">${JSON.stringify(details, null, 2)}</pre>
            <p style="color: #f59e0b;"><strong>Action:</strong> Review when possible</p>
        `;

        await this.sendEmail(subject, html);
        this.logAlert('warning', subject, message);
    }

    async sendDailySummary(stats) {
        const alertType = 'daily-summary';

        const subject = `📊 Daily Summary - ${new Date().toLocaleDateString()}`;
        const html = `
            <h2 style="color: #3b82f6;">📊 TechNexus Daily Summary</h2>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            
            <h3>Error Statistics (24h)</h3>
            <ul>
                <li>Critical: ${stats.errorCount?.critical || 0}</li>
                <li>Warning: ${stats.errorCount?.warning || 0}</li>
                <li>Info: ${stats.errorCount?.info || 0}</li>
            </ul>
            
            <h3>System Health</h3>
            <ul>
                <li>Database: ${stats.health?.database || 'Unknown'}</li>
                <li>API Endpoints: ${stats.health?.apiEndpoints || 'Unknown'}</li>
                <li>Memory: ${stats.health?.memory || 'Unknown'}</li>
                <li>External APIs: ${stats.health?.externalAPIs || 'Unknown'}</li>
            </ul>
            
            <h3>Updates</h3>
            <ul>
                <li>Hackathons Updated: ${stats.updates?.hackathons || 'N/A'}</li>
                <li>News Updated: ${stats.updates?.news || 'N/A'}</li>
                <li>Last Update: ${stats.updates?.lastUpdate || 'N/A'}</li>
            </ul>
            
            <p style="color: #10b981;"><strong>Status:</strong> System running normally</p>
        `;

        await this.sendEmail(subject, html);
        this.logAlert('info', subject, 'Daily summary sent');
    }

    async sendUpdateNotification(type, success, details = {}) {
        if (success) {
            console.log(`\x1b[32m[ALERT]\x1b[0m ${type} update successful`);
            this.logAlert('info', `${type} Update Success`, JSON.stringify(details));
        } else {
            const alertType = `${type}-update-failed`;

            if (!this.shouldSendAlert(alertType)) {
                return;
            }

            const subject = `❌ ${type} Update Failed`;
            const html = `
                <h2 style="color: #dc2626;">❌ Update Failed</h2>
                <p><strong>Type:</strong> ${type}</p>
                <p><strong>Time:</strong> ${new Date().toISOString()}</p>
                <p><strong>Details:</strong></p>
                <pre style="background: #f3f4f6; padding: 10px; border-radius: 5px;">${JSON.stringify(details, null, 2)}</pre>
                <p style="color: #dc2626;"><strong>Action:</strong> Check API connectivity and logs</p>
            `;

            await this.sendEmail(subject, html);
            this.logAlert('warning', subject, `${type} update failed`);
        }
    }

    logAlert(severity, subject, message) {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] [${severity.toUpperCase()}] ${subject}\n${message}\n\n`;

        try {
            fs.appendFileSync(this.alertLog, logEntry);
        } catch (error) {
            console.error('Failed to write alert log:', error);
        }
    }

    scheduleDailySummary() {
        // Send daily summary at 9 AM
        const now = new Date();
        const scheduledTime = new Date();
        scheduledTime.setHours(9, 0, 0, 0);

        if (now > scheduledTime) {
            scheduledTime.setDate(scheduledTime.getDate() + 1);
        }

        const timeUntilSummary = scheduledTime - now;

        setTimeout(() => {
            // Send first summary
            this.sendDailySummary({});

            // Then send every 24 hours
            setInterval(() => {
                this.sendDailySummary({});
            }, 86400000); // 24 hours
        }, timeUntilSummary);

        console.log(`\x1b[36m[ALERT]\x1b[0m Daily summary scheduled for ${scheduledTime.toLocaleString()}`);
    }
}

module.exports = new AlertSystem();
