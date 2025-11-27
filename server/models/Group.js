const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        trim: true,
        maxlength: 500
    },
    type: {
        type: String,
        enum: ['personal', 'public'],
        default: 'personal'
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    avatar: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
groupSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Add creator to members if not already there
groupSchema.pre('save', function (next) {
    if (this.isNew && !this.members.includes(this.creator)) {
        this.members.push(this.creator);
    }
    next();
});

module.exports = mongoose.model('Group', groupSchema);
