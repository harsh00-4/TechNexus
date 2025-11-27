const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    summary: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    url: {
        type: String,
        default: ''
    },
    verified: {
        type: Boolean,
        default: true
    },
    category: {
        type: String,
        default: 'Tech'
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

// Index for faster queries
newsSchema.index({ date: -1 });
newsSchema.index({ category: 1 });
newsSchema.index({ createdAt: -1 });
newsSchema.index({ author: 1 });
newsSchema.index({ userSubmitted: 1 });

module.exports = mongoose.model('News', newsSchema);
