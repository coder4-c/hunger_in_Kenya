const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    donorName: {
        type: String,
        required: true,
        trim: true
    },
    donorEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    amount: {
        type: Number,
        required: true,
        min: 1
    },
    currency: {
        type: String,
        default: 'KES',
        enum: ['USD', 'KES', 'EUR']
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['card', 'bank_transfer', 'mobile_money', 'paypal', 'mpesa']
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    program: {
        type: String,
        enum: ['emergency-relief', 'school-feeding', 'sustainable-farming', 'community-development', 'general'],
        default: 'general'
    },
    isRecurring: {
        type: Boolean,
        default: false
    },
    recurringInterval: {
        type: String,
        enum: ['monthly', 'quarterly', 'yearly'],
        required: function() { return this.isRecurring; }
    },
    stripePaymentId: String,
    paypalPaymentId: String,
    mpesaReference: String,
    mpesaReceipt: String,
    phoneNumber: String,
    message: {
        type: String,
        maxlength: 500
    },
    isAnonymous: {
        type: Boolean,
        default: false
    },
    taxReceiptSent: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index for better query performance
donationSchema.index({ donorEmail: 1, createdAt: -1 });
donationSchema.index({ paymentStatus: 1 });
donationSchema.index({ program: 1 });

module.exports = mongoose.model('Donation', donationSchema);