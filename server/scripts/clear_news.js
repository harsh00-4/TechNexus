const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });
const News = require('../models/News');

const clearNews = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/technexus');
        console.log('Connected to MongoDB');

        const result = await News.deleteMany({ aiGenerated: true });
        console.log(`Deleted ${result.deletedCount} AI-generated news articles.`);

        await mongoose.disconnect();
        console.log('Disconnected');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

clearNews();
