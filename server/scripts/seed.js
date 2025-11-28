const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });
const News = require('../models/News');
const Hackathon = require('../models/Hackathon');

const sampleNews = [
    {
        title: "TechNexus Launches New AI Features",
        summary: "TechNexus has announced the release of its new AI-powered content generation engine, bringing real-time tech news and hackathon updates to students worldwide.",
        date: new Date().toISOString().split('T')[0],
        category: "Tech",
        verified: true,
        aiGenerated: false,
        authorName: "System Admin"
    },
    {
        title: "The Future of Web Development in 2025",
        summary: "Experts predict a shift towards AI-assisted coding and edge computing as the dominant trends for the coming year.",
        date: new Date().toISOString().split('T')[0],
        category: "Development",
        verified: true,
        aiGenerated: true,
        authorName: "TechNexus AI"
    },
    {
        title: "SpaceX Announces Mars Mission Timeline",
        summary: "Elon Musk reveals updated plans for the first manned mission to Mars, targeting a launch window in late 2028.",
        date: new Date().toISOString().split('T')[0],
        category: "Space",
        verified: true,
        aiGenerated: true,
        authorName: "TechNexus AI"
    }
];

const sampleHackathons = [
    {
        name: "Global AI Challenge 2025",
        date: "2025-12-15",
        endDate: "2025-12-17",
        status: "Registration Open",
        venue: "Online",
        venueType: "online",
        theme: "Artificial Intelligence",
        prizePool: "$50,000",
        organizer: "Tech Giants Alliance",
        description: "Join thousands of developers worldwide to build the next generation of AI applications.",
        registrationLink: "https://example.com/register",
        aiGenerated: false,
        authorName: "System Admin"
    },
    {
        name: "Campus Code Fest",
        date: "2025-11-30",
        endDate: "2025-11-30",
        status: "Happening Soon",
        venue: "University Main Hall",
        venueType: "offline",
        city: "New York",
        state: "NY",
        theme: "Student Innovation",
        prizePool: "$5,000",
        organizer: "University CS Club",
        description: "A 24-hour hackathon for students to showcase their coding skills.",
        aiGenerated: true,
        authorName: "TechNexus AI"
    }
];

async function seedData() {
    try {
        console.log('🌱 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/technexus');
        console.log('✓ Connected');

        console.log('🧹 Clearing existing data...');
        await News.deleteMany({});
        await Hackathon.deleteMany({});

        console.log('📝 Inserting sample news...');
        await News.insertMany(sampleNews);

        console.log('📝 Inserting sample hackathons...');
        await Hackathon.insertMany(sampleHackathons);

        console.log('✅ Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

seedData();
