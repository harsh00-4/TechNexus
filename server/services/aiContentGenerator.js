const Groq = require('groq-sdk');
const News = require('../models/News');
const Hackathon = require('../models/Hackathon');
const Problem = require('../models/Problem');

class AIContentGenerator {
    constructor() {
        this.groq = process.env.GROQ_API_KEY ? new Groq({
            apiKey: process.env.GROQ_API_KEY
        }) : null;
        this.newsCache = [];
        this.hackathonsCache = [];
        this.problemsCache = [];
        this.lastNewsUpdate = null;
        this.lastHackathonUpdate = null;
        this.lastProblemUpdate = null;
        this.updateInterval = 3600000; // 1 hour
    }

    async generateTechNews() {
        try {
            const currentDate = new Date().toISOString().split('T')[0];

            const prompt = `Generate 12 realistic, current tech news articles for ${currentDate}. 
Focus on: AI, Web Development, Cloud Computing, Cybersecurity, Startups, Programming Languages, DevOps, Mobile Development, Blockchain, and Emerging Technologies.

Return ONLY a valid JSON array with this exact structure (no markdown, no code blocks):
[
  {
    "title": "Brief, catchy headline (max 80 chars)",
    "summary": "Detailed 2-3 sentence summary explaining the news",
    "date": "${currentDate}",
    "url": "https://techcrunch.com/article-slug" or "https://www.theverge.com/..." (Must be a valid real URL),
    "verified": true,
    "category": "AI" or "Web Dev" or "Cloud" etc
  }
]

Make the news sound realistic, current, and engaging. Include real company names and technologies.
IMPORTANT: For the 'url', randomly select from these reliable sources:
- https://techcrunch.com
- https://www.theverge.com/tech
- https://www.wired.com/category/tech/
- https://arstechnica.com/
- https://venturebeat.com/
- https://www.engadget.com/
Ensure the URL is valid and points to the main site or a relevant category.`;

            const completion = await this.groq.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: 'You are a tech news generator. Generate realistic, current tech news. Return ONLY valid JSON array, no markdown formatting, no code blocks, no explanations.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                model: 'llama-3.3-70b-versatile',
                temperature: 0.8,
                max_tokens: 2000
            });

            let responseText = completion.choices[0]?.message?.content || '[]';

            // Clean up response - remove markdown code blocks if present
            responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

            const newsArticles = JSON.parse(responseText);

            // Save to database
            try {
                // Clear old AI-generated news (keep last 50)
                const oldNews = await News.find({ aiGenerated: true }).sort({ createdAt: -1 }).skip(50);
                if (oldNews.length > 0) {
                    await News.deleteMany({ _id: { $in: oldNews.map(n => n._id) } });
                }

                // Save new articles
                const savedArticles = await News.insertMany(newsArticles.map((article, index) => ({
                    ...article,
                    aiGenerated: true,
                    createdAt: new Date(Date.now() + index) // Slight offset for ordering
                })));

                console.log(`✅ Saved ${savedArticles.length} news articles to database`);
            } catch (dbError) {
                console.error('Error saving news to database:', dbError);
            }

            this.newsCache = newsArticles;
            this.lastNewsUpdate = Date.now();

            console.log(`✅ Generated ${newsArticles.length} AI-powered tech news articles`);
            return newsArticles;

        } catch (error) {
            console.error('Error generating tech news:', error);
            // Try to load from database
            const dbNews = await this.loadNewsFromDatabase();
            if (dbNews.length > 0) {
                return dbNews;
            }
            return this.getFallbackNews();
        }
    }

    async generateHackathons() {
        try {
            const currentDate = new Date();
            const futureDate = new Date();
            futureDate.setMonth(futureDate.getMonth() + 3);

            const prompt = `Generate 15 realistic upcoming hackathons in India for the next 3 months (${currentDate.toISOString().split('T')[0]} to ${futureDate.toISOString().split('T')[0]}).

Include hackathons from major cities: Mumbai, Delhi, Bangalore, Hyderabad, Pune, Chennai, Kolkata, Ahmedabad.
Include both online and offline venues.
Use realistic themes: AI/ML, Web3, Healthcare Tech, FinTech, EdTech, Sustainability, IoT, AR/VR, etc.

Return ONLY a valid JSON array with this exact structure (no markdown, no code blocks):
[
  {
    "name": "Hackathon Name (e.g., 'AI Innovation Challenge 2025')",
    "date": "YYYY-MM-DD",
    "endDate": "YYYY-MM-DD",
    "status": "Upcoming" or "Registration Open" or "Happening Soon",
    "venue": "Specific venue name or 'Online'",
    "venueType": "online" or "offline",
    "city": "City name",
    "state": "State name",
    "theme": "Main theme/focus area",
    "prizePool": "₹X Lakhs" or "₹X Cr",
    "organizer": "Company/Organization name",
    "registrationLink": "https://unstop.com/hackathons",
    "description": "Brief 1-2 sentence description"
  }
]

Make them realistic with proper dates, real company names as organizers, and attractive prize pools. ALWAYS use 'https://unstop.com/hackathons' as the registration link to ensure it works.`;

            const completion = await this.groq.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: 'You are a hackathon event generator for India. Generate realistic upcoming hackathons. Return ONLY valid JSON array, no markdown formatting, no code blocks, no explanations.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                model: 'llama-3.3-70b-versatile',
                temperature: 0.7,
                max_tokens: 3000
            });

            let responseText = completion.choices[0]?.message?.content || '[]';

            // Clean up response
            responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

            const hackathons = JSON.parse(responseText);

            // Save to database
            try {
                // Clear old AI-generated hackathons (keep last 50)
                const oldHackathons = await Hackathon.find({ aiGenerated: true }).sort({ createdAt: -1 }).skip(50);
                if (oldHackathons.length > 0) {
                    await Hackathon.deleteMany({ _id: { $in: oldHackathons.map(h => h._id) } });
                }

                // Save new hackathons
                const savedHackathons = await Hackathon.insertMany(hackathons.map((hackathon, index) => ({
                    ...hackathon,
                    aiGenerated: true,
                    createdAt: new Date(Date.now() + index)
                })));

                console.log(`✅ Saved ${savedHackathons.length} hackathons to database`);
            } catch (dbError) {
                console.error('Error saving hackathons to database:', dbError);
            }

            this.hackathonsCache = hackathons;
            this.lastHackathonUpdate = Date.now();

            console.log(`✅ Generated ${hackathons.length} AI-powered hackathon events`);
            return hackathons;

        } catch (error) {
            console.error('Error generating hackathons:', error);
            // Try to load from database
            const dbHackathons = await this.loadHackathonsFromDatabase();
            if (dbHackathons.length > 0) {
                return dbHackathons;
            }
            return this.getFallbackHackathons();
        }
    }

    async generateProblems() {
        try {
            const prompt = `Generate 5 interesting and challenging coding problems/discussions for a student tech community.
Focus on: Algorithms, System Design, React Patterns, Database Optimization, and AI Ethics.

Return ONLY a valid JSON array with this exact structure (no markdown, no code blocks):
[
  {
    "title": "Engaging Title (e.g., 'How to optimize React re-renders?')",
    "description": "Detailed description of the problem or discussion point. Include code snippets if relevant (escaped properly).",
    "tags": ["React", "Performance", "Frontend"]
  }
]

Make them thought-provoking and suitable for discussion.`;

            const completion = await this.groq.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: 'You are a senior tech lead creating coding challenges. Return ONLY valid JSON array.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                model: 'llama-3.3-70b-versatile',
                temperature: 0.8,
                max_tokens: 2000
            });

            let responseText = completion.choices[0]?.message?.content || '[]';
            responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            const problems = JSON.parse(responseText);

            // Save to database
            try {
                // Clear old AI-generated problems
                await Problem.deleteMany({ aiGenerated: true });

                // Save new problems
                const savedProblems = await Problem.insertMany(problems.map(p => ({
                    ...p,
                    aiGenerated: true,
                    votes: Math.floor(Math.random() * 20) + 5 // Random initial votes
                })));

                console.log(`✅ Saved ${savedProblems.length} problems to database`);
            } catch (dbError) {
                console.error('Error saving problems to database:', dbError);
            }

            this.problemsCache = problems;
            this.lastProblemUpdate = Date.now();
            return problems;

        } catch (error) {
            console.error('Error generating problems:', error);
            return [];
        }
    }

    async getProblems(forceRefresh = false) {
        const needsUpdate = !this.lastProblemUpdate ||
            (Date.now() - this.lastProblemUpdate > this.updateInterval) ||
            forceRefresh;

        if (needsUpdate || this.problemsCache.length === 0) {
            return await this.generateProblems();
        }
        return this.problemsCache;
    }

    async loadNewsFromDatabase() {
        try {
            const news = await News.find({ aiGenerated: true }).sort({ createdAt: -1 }).limit(12).lean();
            console.log(`📚 Loaded ${news.length} news articles from database`);
            return news.map(n => ({
                id: n._id,
                title: n.title,
                summary: n.summary,
                date: n.date,
                url: n.url,
                verified: n.verified,
                category: n.category
            }));
        } catch (error) {
            console.error('Error loading news from database:', error);
            return [];
        }
    }

    async loadHackathonsFromDatabase() {
        try {
            const hackathons = await Hackathon.find({ aiGenerated: true }).sort({ createdAt: -1 }).limit(15).lean();
            console.log(`📚 Loaded ${hackathons.length} hackathons from database`);
            return hackathons.map(h => ({
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
                description: h.description
            }));
        } catch (error) {
            console.error('Error loading hackathons from database:', error);
            return [];
        }
    }

    async getNews(forceRefresh = false) {
        const needsUpdate = !this.lastNewsUpdate ||
            (Date.now() - this.lastNewsUpdate > this.updateInterval) ||
            forceRefresh;

        if (needsUpdate || this.newsCache.length === 0) {
            return await this.generateTechNews();
        }

        return this.newsCache;
    }

    async getHackathons(forceRefresh = false) {
        const needsUpdate = !this.lastHackathonUpdate ||
            (Date.now() - this.lastHackathonUpdate > this.updateInterval) ||
            forceRefresh;

        if (needsUpdate || this.hackathonsCache.length === 0) {
            return await this.generateHackathons();
        }

        return this.hackathonsCache;
    }

    getFallbackNews() {
        const currentDate = new Date().toISOString().split('T')[0];
        const randomSuffix = Math.floor(Math.random() * 1000);
        return [
            {
                id: `fallback-1-${randomSuffix}`,
                name: "AI Models Reach New Performance Benchmarks",
                title: "AI Models Reach New Performance Benchmarks",
                summary: "Latest AI models demonstrate unprecedented accuracy in natural language processing tasks, setting new industry standards for performance and efficiency.",
                date: currentDate,
                url: "https://venturebeat.com/category/ai/",
                verified: true,
                category: "AI"
            },
            {
                id: `fallback-2-${randomSuffix}`,
                name: "Cloud Computing Market Sees Explosive Growth",
                title: "Cloud Computing Market Sees Explosive Growth",
                summary: "Major cloud providers report record adoption rates as businesses accelerate digital transformation initiatives across all sectors.",
                date: currentDate,
                url: "https://www.theverge.com/tech",
                verified: true,
                category: "Cloud"
            },
            {
                id: `fallback-3-${randomSuffix}`,
                name: "New JavaScript Framework Gains Developer Traction",
                title: "New JavaScript Framework Gains Developer Traction",
                summary: "Innovative web framework promises faster development cycles and improved performance, attracting attention from major tech companies.",
                date: currentDate,
                url: "https://github.com/trending",
                verified: true,
                category: "Web Dev"
            },
            {
                id: `fallback-4-${randomSuffix}`,
                name: "Cybersecurity Threats on the Rise in 2025",
                title: "Cybersecurity Threats on the Rise in 2025",
                summary: "Experts warn of sophisticated AI-driven cyber attacks targeting financial institutions and critical infrastructure globally.",
                date: currentDate,
                url: "https://www.wired.com/category/security/",
                verified: true,
                category: "Cybersecurity"
            },
            {
                id: `fallback-5-${randomSuffix}`,
                name: "The Future of Quantum Computing",
                title: "The Future of Quantum Computing",
                summary: "Breakthroughs in qubit stability bring us closer to practical quantum computers, potentially revolutionizing drug discovery and cryptography.",
                date: currentDate,
                url: "https://arstechnica.com/science/",
                verified: true,
                category: "Emerging Tech"
            },
            {
                id: `fallback-6-${randomSuffix}`,
                name: "Startup Ecosystem Booms in Southeast Asia",
                title: "Startup Ecosystem Booms in Southeast Asia",
                summary: "Venture capital funding floods into Southeast Asian startups, with a focus on fintech, e-commerce, and logistics solutions.",
                date: currentDate,
                url: "https://techcrunch.com/category/startups/",
                verified: true,
                category: "Startups"
            }
        ];
    }

    getFallbackHackathons() {
        const today = new Date();
        const nextMonth = new Date(today);
        nextMonth.setMonth(nextMonth.getMonth() + 1);

        return [
            {
                id: 1,
                name: "AI Innovation Challenge 2025",
                date: nextMonth.toISOString().split('T')[0],
                endDate: new Date(nextMonth.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                status: "Registration Open",
                venue: "Online",
                venueType: "online",
                city: "Mumbai",
                state: "Maharashtra",
                theme: "Artificial Intelligence",
                prizePool: "₹5 Lakhs",
                organizer: "Tech Innovators India",
                registrationLink: "https://unstop.com/hackathons",
                description: "Build innovative AI solutions to solve real-world problems"
            },
            {
                id: 2,
                name: "Web3 Blockchain Summit",
                date: new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                endDate: new Date(today.getTime() + 17 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                status: "Upcoming",
                venue: "T-Hub",
                venueType: "offline",
                city: "Hyderabad",
                state: "Telangana",
                theme: "Blockchain & Web3",
                prizePool: "₹10 Lakhs",
                organizer: "BlockChain India",
                registrationLink: "https://unstop.com/hackathons",
                description: "Create decentralized applications for the future of finance and social media."
            },
            {
                id: 3,
                name: "GreenTech Sustainability Hack",
                date: new Date(today.getTime() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                endDate: new Date(today.getTime() + 47 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                status: "Registration Open",
                venue: "IIT Delhi",
                venueType: "hybrid",
                city: "New Delhi",
                state: "Delhi",
                theme: "Sustainability",
                prizePool: "₹3 Lakhs",
                organizer: "Green Earth Foundation",
                registrationLink: "https://unstop.com/hackathons",
                description: "Develop technology solutions for climate change and sustainable living."
            },
            {
                id: 4,
                name: "FinTech Revolution 2025",
                date: new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                endDate: new Date(today.getTime() + 62 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                status: "Upcoming",
                venue: "Online",
                venueType: "online",
                city: "Bangalore",
                state: "Karnataka",
                theme: "FinTech",
                prizePool: "₹8 Lakhs",
                organizer: "FinTech Association",
                registrationLink: "https://unstop.com/hackathons",
                description: "Revolutionize digital payments and financial inclusion."
            },
            {
                id: 5,
                name: "HealthTech Save-a-Thon",
                date: new Date(today.getTime() + 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                endDate: new Date(today.getTime() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                status: "Happening Soon",
                venue: "Apollo Hospitals",
                venueType: "offline",
                city: "Chennai",
                state: "Tamil Nadu",
                theme: "Healthcare",
                prizePool: "₹4 Lakhs",
                organizer: "MediTech Systems",
                registrationLink: "https://unstop.com/hackathons",
                description: "Innovate for better patient care and hospital management systems."
            },
            {
                id: 6,
                name: "GameDev Arena Championship",
                date: new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                endDate: new Date(today.getTime() + 92 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                status: "Upcoming",
                venue: "Online",
                venueType: "online",
                city: "Pune",
                state: "Maharashtra",
                theme: "Gaming",
                prizePool: "₹15 Lakhs",
                organizer: "Indie Game Devs",
                registrationLink: "https://unstop.com/hackathons",
                description: "Build the next big indie game in 48 hours."
            }
        ];
    }

    // Initialize content on startup
    async initialize() {
        console.log('🤖 Initializing AI Content Generator...');

        if (!process.env.GROQ_API_KEY) {
            console.warn('⚠️  GROQ_API_KEY not found. Loading from database or using fallback content.');

            // Try to load from database
            const dbNews = await this.loadNewsFromDatabase();
            const dbHackathons = await this.loadHackathonsFromDatabase();

            this.newsCache = dbNews.length > 0 ? dbNews : this.getFallbackNews();
            this.hackathonsCache = dbHackathons.length > 0 ? dbHackathons : this.getFallbackHackathons();
            return;
        }

        try {
            await Promise.all([
                this.generateTechNews(),
                this.generateHackathons(),
                this.generateProblems()
            ]);
            console.log('✅ AI Content Generator initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing AI content:', error);

            // Try database fallback
            const dbNews = await this.loadNewsFromDatabase();
            const dbHackathons = await this.loadHackathonsFromDatabase();

            this.newsCache = dbNews.length > 0 ? dbNews : this.getFallbackNews();
            this.hackathonsCache = dbHackathons.length > 0 ? dbHackathons : this.getFallbackHackathons();
        }
    }
}

module.exports = new AIContentGenerator();
