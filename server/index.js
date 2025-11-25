console.log('🚀 Starting TechNexus Server...'); // Debug log

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Groq = require('groq-sdk');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const autoUpdater = require('./autoUpdater');
const { scanFile } = require('./utils/antivirus');
const User = require('./models/User');
const auth = require('./middleware/auth');

// Monitoring Systems
const errorMonitor = require('./monitoring/errorMonitor');
const healthCheck = require('./monitoring/healthCheck');
const selfHealing = require('./monitoring/selfHealing');
const alertSystem = require('./monitoring/alertSystem');
const enhancedAutoUpdater = require('./monitoring/enhancedAutoUpdater');

const app = express();
const PORT = process.env.PORT || 5000;

// Root Route for Health Checks
app.get('/', (req, res) => {
    res.send('TechNexus Server is Running! 🚀');
});

// Initialize Monitoring Systems
errorMonitor.setupGlobalErrorHandlers();
selfHealing.initialize();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/technexus')
    .then(() => {
        console.log('✓ MongoDB connected');
        // Start monitoring after successful connection
        healthCheck.startPeriodicChecks(300000); // 5 minutes
        enhancedAutoUpdater.startAutoUpdates();
        alertSystem.scheduleDailySummary();
    })
    .catch(async (err) => {
        console.log('⚠️  MongoDB connection error:', err.message);
        await errorMonitor.logError(err, { type: 'mongodb-connection' });
    });

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        // Allow common file types
        const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only images, PDFs, and documents are allowed.'));
        }
    }
});

// Helper function to sanitize input (prevent XSS)
function sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}

// Security Middleware
app.use(helmet()); // Secure HTTP headers
app.use(hpp()); // Prevent HTTP Parameter Pollution

// Global Rate Limiting (DDoS Protection)
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later."
});
app.use(globalLimiter);

// Strict Rate Limiting for API Endpoints (Feedback & Chat)
const apiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each IP to 10 requests per hour
    message: "Too many requests, please try again later."
});

// CORS Configuration (Restrict to frontend)
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000', 'https://tech-nexus-5prj.vercel.app'], // Production URL added
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Problems data
let problems = [
    { id: 1, title: "Optimize A* Algorithm", votes: 12, description: "Looking for ways to make pathfinding faster." },
    { id: 2, title: "React State Management", votes: 8, description: "Redux vs Context API in 2025?" }
];

// Import Problem Model
const Problem = require('./models/Problem');

// Routes
app.get('/api/news', (req, res) => {
    const news = autoUpdater.getNews();
    res.json(news.length > 0 ? news : [
        { id: 1, title: "Loading latest tech news...", summary: "Fetching from Dev.to API", date: new Date().toISOString().split('T')[0] }
    ]);
});

app.get('/api/hackathons', (req, res) => {
    const hackathons = autoUpdater.getHackathons();
    res.json(hackathons.length > 0 ? hackathons : [
        { id: 1, name: "Loading hackathons...", date: "TBD", status: "Upcoming" }
    ]);
});

// Get all problems
app.get('/api/problems', async (req, res) => {
    try {
        const problems = await Problem.find().sort({ createdAt: -1 });
        res.json(problems);
    } catch (error) {
        res.status(500).json({ message: "Error fetching problems" });
    }
});

// Post a new problem
app.post('/api/problems', auth, async (req, res) => {
    const { title, description, tags } = req.body;
    if (!title || !description) {
        return res.status(400).json({ success: false, message: "Title and description required" });
    }
    try {
        const newProblem = new Problem({
            title,
            description,
            tags: tags || [],
            author: req.user._id
        });
        await newProblem.save();
        res.json({ success: true, problem: newProblem });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error creating problem" });
    }
});

// Vote on a problem
app.post('/api/vote', async (req, res) => {
    const { id } = req.body;
    try {
        const problem = await Problem.findById(id);
        if (problem) {
            problem.votes += 1;
            await problem.save();
            res.json({ success: true, votes: problem.votes });
        } else {
            res.status(404).json({ success: false, message: "Problem not found" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Error voting" });
    }
});

// Groq AI Chat with Fallback Models
app.post('/api/chat', apiLimiter, async (req, res) => {
    const { message } = req.body;

    // Input validation
    if (!message || message.length > 500) {
        return res.status(400).json({
            response: 'Please provide a valid message (max 500 characters).'
        });
    }

    const models = [
        "llama-3.3-70b-versatile", // Latest & Greatest
        "llama3-70b-8192",         // Stable Fallback
        "mixtral-8x7b-32768"       // Backup
    ];

    const prompt = `You are TechNexus AI, an assistant for tech students. Answer concisely (2-3 sentences).

Question: ${message}

Answer:`;

    const genAI = new Groq({
        apiKey: process.env.GROQ_API_KEY
    });

    // Try models in sequence
    for (const modelName of models) {
        try {
            console.log(`🤖 Attempting chat with model: ${modelName}`);
            const result = await genAI.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                model: modelName,
                temperature: 0.7,
                max_tokens: 200
            });

            const response = result.choices[0].message.content;
            return res.json({ response }); // Success! Return immediately

        } catch (error) {
            console.warn(`⚠️ Model ${modelName} failed:`, error.message);
            // Continue to next model
        }
    }

    // If all models fail
    console.error("❌ All AI models failed.");
    res.json({
        response: `I'm currently offline due to high traffic. Please try again in a few minutes or check the News section!`
    });
});

// Import Feedback Model
const Feedback = require('./models/Feedback');

// Feedback endpoint with Database Storage + Email
app.post('/api/feedback', apiLimiter, async (req, res) => {
    const { name, email, message } = req.body;

    // Input Validation
    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Basic Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email address.' });
    }

    if (message.length > 1000) {
        return res.status(400).json({ success: false, message: 'Message too long (max 1000 chars).' });
    }

    try {
        // 1. Save to Database (Primary Storage)
        const newFeedback = new Feedback({
            name: sanitizeInput(name),
            email: sanitizeInput(email),
            message: sanitizeInput(message)
        });
        await newFeedback.save();
        console.log(`✅ Feedback saved to database from ${email}`);

        // 2. Try to Send Email (Secondary/Optional)
        // Only attempt if credentials exist
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            try {
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS
                    }
                });

                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: process.env.EMAIL_USER,
                    subject: `TechNexus Feedback from ${name}`,
                    html: `
                        <h2>New Feedback from TechNexus</h2>
                        <p><strong>From:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Message:</strong></p>
                        <p>${message}</p>
                    `
                };

                await transporter.sendMail(mailOptions);
                console.log(`✅ Feedback email sent to ${process.env.EMAIL_USER}`);
            } catch (emailError) {
                console.warn('⚠️ Email sending failed (but saved to DB):', emailError.message);
                // We do NOT fail the request if email fails, since DB save worked
            }
        } else {
            console.log('ℹ️ Email credentials missing, skipping email send.');
        }

        // Return success since DB save worked
        res.json({ success: true, message: 'Feedback received successfully!' });

    } catch (error) {
        console.error('❌ Feedback error:', error);
        res.status(500).json({ success: false, message: 'Failed to save feedback.', error: error.message });
    }
});

// File upload endpoint with antivirus scanning
app.post('/api/upload', apiLimiter, upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    try {
        // Scan the uploaded file for viruses
        await scanFile(req.file.path);

        console.log(`✅ File uploaded and scanned: ${req.file.filename}`);
        res.json({
            success: true,
            message: 'File uploaded and verified as clean.',
            filename: req.file.filename
        });
    } catch (error) {
        // Delete the infected file
        if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        console.error('❌ File scan failed:', error.message);
        res.status(400).json({
            success: false,
            message: 'File rejected: potential security threat detected.'
        });
    }
});

// Authentication Routes

// Signup
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Create user
        const user = await User.create({ name, email, password });

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating user',
            error: error.message
        });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Find user (include password for comparison)
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error logging in',
            error: error.message
        });
    }
});

// Get current user (protected route)
app.get('/api/auth/me', auth, async (req, res) => {
    try {
        res.json({
            success: true,
            user: req.user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user data'
        });
    }
});

// Manual refresh endpoint (optional)
app.get('/api/refresh', async (req, res) => {
    await enhancedAutoUpdater.refreshData();
    res.json({ success: true, message: 'Data refreshed!' });
});

// Monitoring Dashboard
app.get('/api/monitoring/dashboard', async (req, res) => {
    try {
        const uptime = process.uptime();
        const errorStats = errorMonitor.getStats();
        const healthStatus = healthCheck.getStatus();
        const updateStatus = enhancedAutoUpdater.getUpdateStatus();
        const memoryUsage = process.memoryUsage();

        const dashboard = {
            system: {
                uptime: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m`,
                uptimeSeconds: uptime,
                memory: {
                    heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + ' MB',
                    heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + ' MB',
                    usagePercent: Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100) + '%'
                },
                nodeVersion: process.version,
                platform: process.platform
            },
            users: {
                total: await User.countDocuments(),
                active24h: await User.countDocuments({
                    lastActive: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
                })
            },
            errors: {
                total: errorStats.totalErrors,
                breakdown: errorStats.errorCount,
                recent: errorStats.recentErrors.slice(0, 5)
            },
            health: healthStatus,
            updates: updateStatus,
            timestamp: new Date().toISOString()
        };

        res.json({
            success: true,
            dashboard
        });
    } catch (error) {
        await errorMonitor.logError(error, { type: 'dashboard-error' });
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard data'
        });
    }
});

const Notification = require('./models/Notification');

// ... (existing imports)

// Notification Routes

// Get unread notifications for a user
app.get('/api/notifications', auth, async (req, res) => {
    try {
        // Fetch global notifications + user specific notifications
        const notifications = await Notification.find({
            $or: [
                { recipient: null }, // Global
                { recipient: req.user._id } // Specific
            ],
            read: false
        }).sort({ createdAt: -1 }).limit(10);

        res.json({ success: true, notifications });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ success: false, message: 'Error fetching notifications' });
    }
});

// Mark notification as read
app.post('/api/notifications/mark-read/:id', auth, async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        // Check ownership (if it's a specific notification)
        if (notification.recipient && notification.recipient.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        // For global notifications, we can't just mark the document as read because it affects everyone.
        // In a real app, we'd have a separate "UserReadNotification" collection.
        // For this simple MVP, we will only allow marking PERSONAL notifications as read.
        // Global notifications will just stay visible for now (or we can implement client-side hiding).

        if (notification.recipient) {
            notification.read = true;
            await notification.save();
        }

        res.json({ success: true, message: 'Marked as read' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating notification' });
    }
});

// Broadcast notification (Admin/System internal use)
app.post('/api/notifications/broadcast', async (req, res) => {
    // In a real app, add admin auth middleware here
    const { title, message, type } = req.body;

    try {
        await Notification.create({
            recipient: null, // Global
            title,
            message,
            type: type || 'INFO'
        });
        res.json({ success: true, message: 'Broadcast sent' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error sending broadcast' });
    }
});

// Helper Function: Sanitize Input
function sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

app.listen(PORT, '0.0.0.0', () => {
    console.log(`✓ Server running on http://0.0.0.0:${PORT}`);
    console.log(`✓ Security: Helmet, Manual XSS Protection, HPP, Rate Limiting`);
    console.log(`✓ Antivirus: ClamAV integration (optional)`);
    console.log(`✓ FREE Auto-updates: Active (Dev.to + Unstop)`);
    console.log(`✓ Daily Updates: News & Hackathons refresh every 24 hours`);
    console.log(`✓ Cost: $0 FOREVER`);
});
