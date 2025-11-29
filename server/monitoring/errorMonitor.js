const fs = require('fs');
const path = require('path');
const Groq = require('groq-sdk');
const { GoogleGenerativeAI } = require('@google/generative-ai');

class ErrorMonitor {
    constructor() {
        this.errorLog = path.join(__dirname, '../logs/errors.log');
        this.errorCount = { critical: 0, warning: 0, info: 0 };
        this.recentErrors = [];
        this.maxRecentErrors = 50;

        // Initialize Groq if key exists
        this.groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

        // Initialize Gemini if key exists
        this.gemini = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;
        this.geminiModel = this.gemini ? this.gemini.getGenerativeModel({ model: "gemini-1.5-flash" }) : null;

        // Ensure logs directory exists
        this.ensureLogDirectory();
    }

    ensureLogDirectory() {
        const logsDir = path.join(__dirname, '../logs');
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir, { recursive: true });
        }
    }

    classifyError(error) {
        const errorString = error.toString().toLowerCase();

        // Critical errors
        if (errorString.includes('econnrefused') && errorString.includes('mongodb')) {
            return 'critical';
        }
        if (errorString.includes('out of memory')) {
            return 'critical';
        }
        if (errorString.includes('enospc')) { // Disk full
            return 'critical';
        }

        // Warning errors
        if (errorString.includes('timeout')) {
            return 'warning';
        }
        if (errorString.includes('econnrefused')) {
            return 'warning';
        }
        if (errorString.includes('validation')) {
            return 'warning';
        }

        // Default to info
        return 'info';
    }

    async logError(error, context = {}) {
        const severity = this.classifyError(error);
        const timestamp = new Date().toISOString();

        const errorEntry = {
            timestamp,
            severity,
            message: error.message || error.toString(),
            stack: error.stack,
            context,
            ...context
        };

        // Increment error count
        this.errorCount[severity]++;

        // Add to recent errors
        this.recentErrors.unshift(errorEntry);
        if (this.recentErrors.length > this.maxRecentErrors) {
            this.recentErrors.pop();
        }

        // Write to log file
        const logLine = `[${timestamp}] [${severity.toUpperCase()}] ${errorEntry.message}\n${errorEntry.stack || ''}\nContext: ${JSON.stringify(context)}\n\n`;

        try {
            fs.appendFileSync(this.errorLog, logLine);
        } catch (writeError) {
            console.error('Failed to write to error log:', writeError);
        }

        // Console log with color
        const color = severity === 'critical' ? '\x1b[31m' : severity === 'warning' ? '\x1b[33m' : '\x1b[36m';
        console.error(`${color}[${severity.toUpperCase()}]\x1b[0m ${errorEntry.message}`);

        // Analyze error with AI if critical or warning
        if ((severity === 'critical' || severity === 'warning') && (this.groq || this.geminiModel)) {
            this.analyzeErrorWithAI(errorEntry).catch(err => {
                console.error('AI analysis failed:', err.message);
            });
        }

        return errorEntry;
    }

    async analyzeErrorWithAI(errorEntry) {
        try {
            const prompt = `Analyze this ${errorEntry.severity} error and provide:
1. Root cause
2. Suggested fix
3. Prevention strategy

Error: ${errorEntry.message}
Stack: ${errorEntry.stack?.substring(0, 500) || 'N/A'}

Respond in 3 concise bullet points.`;

            let analysis = '';

            if (this.geminiModel) {
                const result = await this.geminiModel.generateContent(prompt);
                const response = await result.response;
                analysis = response.text();
            } else if (this.groq) {
                const response = await this.groq.chat.completions.create({
                    messages: [{ role: 'user', content: prompt }],
                    model: 'llama-3.3-70b-versatile',
                    temperature: 0.3,
                    max_tokens: 200
                });
                analysis = response.choices[0].message.content;
            } else {
                return null;
            }

            // Log AI analysis
            const analysisLog = `[${new Date().toISOString()}] AI Analysis for ${errorEntry.severity} error:\n${analysis}\n\n`;
            fs.appendFileSync(this.errorLog, analysisLog);

            console.log(`\x1b[35m[AI ANALYSIS]\x1b[0m ${analysis}`);

            return analysis;
        } catch (error) {
            console.error('AI error analysis failed:', error.message);
            return null;
        }
    }

    getStats() {
        return {
            errorCount: this.errorCount,
            recentErrors: this.recentErrors.slice(0, 10),
            totalErrors: this.errorCount.critical + this.errorCount.warning + this.errorCount.info
        };
    }

    clearStats() {
        this.errorCount = { critical: 0, warning: 0, info: 0 };
        this.recentErrors = [];
    }

    // Global error handler
    setupGlobalErrorHandlers() {
        // Uncaught exceptions
        process.on('uncaughtException', (error) => {
            this.logError(error, { type: 'uncaughtException' });
            console.error('Uncaught Exception - Server may be unstable');
        });

        // Unhandled promise rejections
        process.on('unhandledRejection', (reason, promise) => {
            this.logError(new Error(reason), { type: 'unhandledRejection' });
        });
    }
}

module.exports = new ErrorMonitor();
