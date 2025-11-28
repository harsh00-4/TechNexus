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

const { scanFile } = require('./utils/antivirus');
const User = require('./models/User');
const auth = require('./middleware/auth');

// Monitoring Systems
const errorMonitor = require('./monitoring/errorMonitor');
const healthCheck = require('./monitoring/healthCheck');
const selfHealing = require('./monitoring/selfHealing');
const alertSystem = require('./monitoring/alertSystem');
const enhancedAutoUpdater = require('./monitoring/enhancedAutoUpdater');
const dataCleanupService = require('./services/dataCleanup');

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
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000', 'https://tech-nexus-5prj.vercel.app', 'http://127.0.0.1:5173'], // Production URL added
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Problems data
let problems = [
    { id: 1, title: "Optimize A* Algorithm", votes: 12, description: "Looking for ways to make pathfinding faster." },
    { id: 2, title: "React State Management", votes: 8, description: "Redux vs Context API in 2025?" }
];

// Import Models
const Problem = require('./models/Problem');
const Comment = require('./models/Comment');
const aiContentGenerator = require('./services/aiContentGenerator');


// Routes - AI-Powered News and Hackathons + User Submissions
const News = require('./models/News');
const Hackathon = require('./models/Hackathon');

app.get('/api/news', async (req, res) => {
    try {
        const forceRefresh = req.query.refresh === 'true';

        // Get AI-generated news
        const aiNews = await aiContentGenerator.getNews(forceRefresh);

        // Get user-submitted news from database
        const userNews = await News.find({ userSubmitted: true })
            .populate('author', 'name email')
            .sort({ createdAt: -1 })
            .limit(20)
            .lean();

        // Format user news
        const formattedUserNews = userNews.map(n => ({
            id: n._id,
            title: n.title,
            summary: n.summary,
            date: n.date,
            url: n.url,
            verified: n.verified,
            category: n.category,
            userSubmitted: true,
            authorName: n.author?.name || n.authorName,
            authorId: n.author?._id
        }));

        // Combine and sort by date
        const allNews = [...aiNews, ...formattedUserNews].sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });

        res.json(allNews);
    } catch (error) {
        console.error('Error fetching news:', error);
        res.json([
            { id: 1, title: "Loading latest tech news...", summary: "AI-powered news generation in progress", date: new Date().toISOString().split('T')[0] }
        ]);
    }
});

// User submits news
app.post('/api/news/publish', auth, async (req, res) => {
    try {
        const { title, summary, url, category } = req.body;

        if (!title || !summary) {
            return res.status(400).json({ success: false, message: 'Title and summary are required' });
        }

        const newNews = new News({
            title,
            summary,
            url: url || '',
            category: category || 'Tech',
            date: new Date().toISOString().split('T')[0],
            userSubmitted: true,
            author: req.user._id,
            authorName: req.user.name,
            verified: false, // User content not auto-verified
            aiGenerated: false
        });

        await newNews.save();

        res.json({
            success: true,
            message: 'News published successfully!',
            news: newNews
        });
    } catch (error) {
        console.error('Error publishing news:', error);
        res.status(500).json({ success: false, message: 'Error publishing news' });
    }
});

app.get('/api/hackathons', async (req, res) => {
    try {
        const forceRefresh = req.query.refresh === 'true';

        // Get AI-generated hackathons
        const aiHackathons = await aiContentGenerator.getHackathons(forceRefresh);

        // Get user-submitted hackathons from database
        const userHackathons = await Hackathon.find({ userSubmitted: true })
            .populate('author', 'name email')
            .sort({ createdAt: -1 })
            .limit(20)
            .lean();

        // Format user hackathons
        const formattedUserHackathons = userHackathons.map(h => ({
            id: h._id,
            name: h.name,
            date: h.date,
            endDate: h.endDate,
            status: h.status,
            venue: h.venue,
            venueType: h.venueType,
            city: h.city,
            state: h.state,
            theme: h.theme,
            prizePool: h.prizePool,
            organizer: h.organizer,
            registrationLink: h.registrationLink,
            description: h.description,
            userSubmitted: true,
            authorName: h.author?.name || h.authorName,
            authorId: h.author?._id
        }));

        // Combine and sort by date
        const allHackathons = [...aiHackathons, ...formattedUserHackathons].sort((a, b) => {
            return new Date(a.date) - new Date(b.date);
        });

        res.json(allHackathons);
    } catch (error) {
        console.error('Error fetching hackathons:', error);
        res.json([
            { id: 1, name: "Loading hackathons...", date: "TBD", status: "Upcoming" }
        ]);
    }
});

// User submits hackathon
app.post('/api/hackathons/publish', auth, async (req, res) => {
    try {
        const { name, description, date, endDate, venue, venueType, city, state, theme, prizePool, organizer, registrationLink } = req.body;

        if (!name || !description || !date) {
            return res.status(400).json({ success: false, message: 'Name, description, and date are required' });
        }

        const newHackathon = new Hackathon({
            name,
            description,
            date,
            endDate: endDate || date,
            venue: venue || 'TBD',
            venueType: venueType || 'online',
            city: city || '',
            state: state || '',
            theme: theme || '',
            prizePool: prizePool || '',
            organizer: organizer || req.user.name,
            registrationLink: registrationLink || '',
            status: 'Upcoming',
            userSubmitted: true,
            author: req.user._id,
            authorName: req.user.name,
            aiGenerated: false
        });

        await newHackathon.save();

        res.json({
            success: true,
            message: 'Hackathon published successfully!',
            hackathon: newHackathon
        });
    } catch (error) {
        console.error('Error publishing hackathon:', error);
        res.status(500).json({ success: false, message: 'Error publishing hackathon' });
    }
});

// Manual refresh endpoint for admins
app.post('/api/refresh-content', auth, async (req, res) => {
    try {
        const { type } = req.body; // 'news' or 'hackathons' or 'all'

        if (type === 'news' || type === 'all') {
            await aiContentGenerator.generateTechNews();
        }

        if (type === 'hackathons' || type === 'all') {
            await aiContentGenerator.generateHackathons();
        }

        res.json({ success: true, message: `${type} content refreshed successfully` });
    } catch (error) {
        console.error('Error refreshing content:', error);
        res.status(500).json({ success: false, message: 'Error refreshing content' });
    }
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

// --- COMMENTS ENDPOINTS ---

// Get comments for a problem
app.get('/api/problems/:id/comments', async (req, res) => {
    try {
        const comments = await Comment.find({ problem: req.params.id }).sort({ createdAt: -1 });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching comments" });
    }
});

// Post a comment
app.post('/api/problems/:id/comments', auth, async (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ success: false, message: "Comment text required" });

    try {
        const newComment = new Comment({
            text,
            author: req.user.name,
            userId: req.user._id,
            problem: req.params.id
        });
        await newComment.save();
        res.json({ success: true, comment: newComment });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error posting comment" });
    }
});


// Import Chat Routes
const chatRoutes = require('./routes/chatRoutes');
app.use('/api/chat', chatRoutes);

// Import Group Routes
const groupRoutes = require('./routes/groupRoutes');
app.use('/api/groups', groupRoutes);

// User search endpoint (for finding users to message or add to groups)
app.get('/api/users/search', auth, async (req, res) => {
    try {
        const { query } = req.query;

        if (!query || query.length < 2) {
            return res.json({ success: true, users: [] });
        }

        const users = await User.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ],
            _id: { $ne: req.user._id } // Exclude current user
        })
            .select('name email')
            .limit(10);

        res.json({ success: true, users });
    } catch (error) {
        console.error('User search error:', error);
        res.status(500).json({ success: false, message: 'Error searching users' });
    }
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

// Forgot Password - Request reset token
app.post('/api/auth/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an email'
            });
        }

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            // Don't reveal if user exists or not (security)
            return res.json({
                success: true,
                message: 'If an account exists with that email, a password reset link has been sent.'
            });
        }

        // Generate reset token
        const resetToken = user.generateResetToken();
        await user.save();

        // Create reset URL
        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

        // Send email (if email service is configured)
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
                    to: user.email,
                    subject: 'TechNexus Password Reset',
                    html: `
                        <h2>Password Reset Request</h2>
                        <p>You requested a password reset for your TechNexus account.</p>
                        <p>Click the link below to reset your password:</p>
                        <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #06b6d4; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
                        <p>This link will expire in 1 hour.</p>
                        <p>If you didn't request this, please ignore this email.</p>
                    `
                };

                await transporter.sendMail(mailOptions);
                console.log(`✅ Password reset email sent to ${user.email}`);
            } catch (emailError) {
                console.warn('⚠️ Email sending failed:', emailError.message);
            }
        } else {
            // For development: log the reset URL
            console.log(`🔗 Password Reset URL: ${resetUrl}`);
        }

        res.json({
            success: true,
            message: 'If an account exists with that email, a password reset link has been sent.',
            // In development, include the token
            ...(process.env.NODE_ENV === 'development' && { resetToken, resetUrl })
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing password reset request'
        });
    }
});

// Reset Password - Update password with token
app.post('/api/auth/reset-password/:token', async (req, res) => {
    try {
        const { password } = req.body;
        const { token } = req.params;

        if (!password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a new password'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            });
        }

        // Hash the token to compare with database
        const crypto = require('crypto');
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        // Find user with valid reset token
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        }).select('+resetPasswordToken +resetPasswordExpires');

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token'
            });
        }

        // Update password
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        console.log(`✅ Password reset successful for ${user.email}`);

        res.json({
            success: true,
            message: 'Password reset successful! You can now login with your new password.'
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'Error resetting password'
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

app.listen(PORT, '0.0.0.0', async () => {
    console.log(`✓ Server running on http://0.0.0.0:${PORT}`);
    console.log(`✓ Security: Helmet, Manual XSS Protection, HPP, Rate Limiting`);
    console.log(`✓ Antivirus: ClamAV integration (optional)`)
        ;
    console.log(`🤖 AI-Powered Content: Initializing...`);

    // Initialize AI content generator
    await aiContentGenerator.initialize();

    console.log(`✓ AI Updates: Tech News & Hackathons refresh every hour`);
    console.log(`✓ Cost: $0 FOREVER`);

    // Start automatic data cleanup (30-day retention)
    dataCleanupService.startScheduler();
    console.log(`✓ Data Cleanup: Automatic 30-day retention policy active`);
});
