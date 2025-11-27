const mongoose = require('mongoose');

const hackathonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: String,
        required: true
    },
    endDate: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['Upcoming', 'Registration Open', 'Happening Soon', 'Ongoing', 'Completed'],
        default: 'Upcoming'
    },
    venue: {
        type: String,
        default: 'TBD'
    },
    venueType: {
        type: String,
        enum: ['online', 'offline', 'hybrid'],
        default: 'online'
    },
    city: {
        type: String,
        default: ''
    },
    state: {
        type: String,
        default: ''
    },
    theme: {
        type: String,
        default: ''
    },
    prizePool: {
        type: String,
        default: ''
    },
    organizer: {
        type: String,
        default: ''
    },
    registrationLink: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    aiGenerated: {
        type: Boolean,
        default: false
    },
    userSubmitted: {
        type: Boolean,
        default: false
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    authorName: {
        type: String,
        default: 'TechNexus AI'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Indexes for faster queries
hackathonSchema.index({ date: 1 });
hackathonSchema.index({ state: 1 });
hackathonSchema.index({ city: 1 });
hackathonSchema.index({ venueType: 1 });
hackathonSchema.index({ status: 1 });
hackathonSchema.index({ createdAt: -1 });
hackathonSchema.index({ author: 1 });
hackathonSchema.index({ userSubmitted: 1 });

module.exports = mongoose.model('Hackathon', hackathonSchema);
