const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });
const News = require('../models/News');

const checkNews = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/technexus');
        console.log('Connected to MongoDB');

        const news = await News.find({});
        console.log(`Found ${news.length} news articles:`);
        news.forEach(n => {
            console.log(`- [${n._id}] ${n.title} (AI: ${n.aiGenerated})`);
        });

        await mongoose.disconnect();
        console.log('Disconnected');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkNews();
