const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    interests: [{
        type: String,
        enum: ['emergency-updates', 'success-stories', 'volunteer-opportunities', 'donation-campaigns', 'program-updates', 'general-news']
    }],
    status: {
        type: String,
        enum: ['active', 'unsubscribed', 'bounced'],
        default: 'active'
    },
    subscribedAt: {
        type: Date,
        default: Date.now
    },
    unsubscribedAt: Date,
    source: {
        type: String,
        enum: ['website', 'event', 'referral', 'social-media', 'other'],
        default: 'website'
    },
    confirmationToken: String,
    isConfirmed: {
        type: Boolean,
        default: false
    },
    confirmedAt: Date,
    tags: [{
        type: String,
        trim: true
    }]
}, {
    timestamps: true
});

// Index for better query performance
newsletterSchema.index({ email: 1 });
newsletterSchema.index({ status: 1 });
newsletterSchema.index({ subscribedAt: -1 });

module.exports = mongoose.model('Newsletter', newsletterSchema);