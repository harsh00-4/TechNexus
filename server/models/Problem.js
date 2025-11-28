const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    votes: {
        type: Number,
        default: 0
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    aiGenerated: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Problem', problemSchema);
