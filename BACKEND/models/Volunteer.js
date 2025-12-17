const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    address: {
        street: String,
        city: String,
        state: String,
        country: {
            type: String,
            default: 'Kenya'
        },
        postalCode: String
    },
    skills: [{
        type: String,
        trim: true
    }],
    interests: [{
        type: String,
        enum: ['emergency-relief', 'farming-training', 'education', 'healthcare', 'administration', 'fundraising', 'community-outreach', 'technology', 'other']
    }],
    availability: {
        type: String,
        enum: ['weekdays', 'weekends', 'evenings', 'flexible'],
        required: true
    },
    experience: {
        type: String,
        trim: true,
        maxlength: 1000
    },
    emergencyContact: {
        name: {
            type: String,
            required: true,
            trim: true
        },
        relationship: {
            type: String,
            required: true,
            trim: true
        },
        phone: {
            type: String,
            required: true,
            trim: true
        }
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'active', 'inactive'],
        default: 'pending'
    },
    backgroundCheck: {
        completed: {
            type: Boolean,
            default: false
        },
        date: Date,
        status: {
            type: String,
            enum: ['pending', 'passed', 'failed']
        }
    }
}, {
    timestamps: true
});

// Index for better query performance
volunteerSchema.index({ email: 1 });
volunteerSchema.index({ status: 1 });
volunteerSchema.index({ interests: 1 });
volunteerSchema.index({ availability: 1 });

module.exports = mongoose.model('Volunteer', volunteerSchema);