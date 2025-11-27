const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });
const Hackathon = require('../models/Hackathon');

const clearHackathons = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/technexus');
        console.log('Connected to MongoDB');

        const result = await Hackathon.deleteMany({ aiGenerated: true });
        console.log(`Deleted ${result.deletedCount} AI-generated hackathons.`);

        await mongoose.disconnect();
        console.log('Disconnected');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

clearHackathons();
