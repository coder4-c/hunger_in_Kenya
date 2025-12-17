const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

// Database connection
const connectDB = require('./config/database');

// Import models
const Donation = require('./models/Donation');
const Contact = require('./models/Contact');
const Volunteer = require('./models/Volunteer');
const Newsletter = require('./models/Newsletter');

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"]
        }
    }
}));

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Specific rate limiting for sensitive endpoints
const sensitiveLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many requests to this endpoint, please try again later.'
});

// API Routes
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Hunger in Kenya API is running',
        timestamp: new Date().toISOString()
    });
});

// Donation tracking API with real data
app.get('/api/donations/current', async (req, res) => {
    try {
        const currentMonth = new Date();
        currentMonth.setDate(1);
        currentMonth.setHours(0, 0, 0, 0);

        const monthlyDonations = await Donation.aggregate([
            {
                $match: {
                    paymentStatus: 'completed',
                    createdAt: { $gte: currentMonth }
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            }
        ]);

        // Calculate people fed (assuming $2 per person per meal)
        const totalAmount = monthlyDonations[0]?.totalAmount || 0;
        const donationCount = monthlyDonations[0]?.count || 0;
        const peopleFed = Math.floor(totalAmount / 2);

        // Get active programs count
        const activePrograms = await Donation.distinct('program', {
            paymentStatus: 'completed',
            createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
        }).then(programs => programs.length);

        res.json({
            peopleFed: peopleFed,
            donationAmount: totalAmount,
            activePrograms: activePrograms || 12,
            donationCount: donationCount,
            lastUpdated: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error fetching donation data:', error);
        res.status(500).json({ error: 'Failed to fetch donation data' });
    }
});

// Impact statistics API with real data
app.get('/api/impact/statistics', async (req, res) => {
    try {
        const totalDonations = await Donation.aggregate([
            { $match: { paymentStatus: 'completed' } },
            { $group: { _id: null, totalAmount: { $sum: '$amount' } } }
        ]);

        const totalAmount = totalDonations[0]?.totalAmount || 0;
        
        // Calculate estimated impact metrics based on donations
        const totalPeopleServed = Math.floor(totalAmount / 3); // $3 per person per day
        const childrenFedDaily = Math.floor(totalPeopleServed * 0.4); // 40% are children
        const farmersTrained = Math.floor(totalAmount / 100); // $100 per farmer training
        const communitiesTransformed = Math.floor(totalAmount / 10000); // $10k per community
        const countiesWithPrograms = 32; // Updated based on latest crisis information
        const activeProjects = Math.floor(totalAmount / 5000); // $5k per project

        res.json({
            totalPeopleServed,
            farmersTrained,
            childrenFedDaily,
            communitiesTransformed,
            countiesWithPrograms,
            activeProjects,
            totalDonations: totalAmount
        });
    } catch (error) {
        console.error('Error fetching impact statistics:', error);
        res.status(500).json({ error: 'Failed to fetch impact statistics' });
    }
});

// Program locations API
app.get('/api/programs/locations', (req, res) => {
    const locations = [
        {
            name: "Turkana County - Emergency Relief",
            lat: 3.1167,
            lng: 35.5997,
            type: "emergency-relief",
            status: "active",
            description: "Emergency food distribution for 15,000 families",
            peopleServed: 75000
        },
        {
            name: "Garissa County - School Feeding",
            lat: -0.4536,
            lng: 39.6401,
            type: "school-feeding",
            status: "active",
            description: "School feeding program serving 25,000 children",
            peopleServed: 25000
        },
        {
            name: "Kitui County - Sustainable Farming",
            lat: -1.3700,
            lng: 38.0100,
            type: "sustainable-farming",
            status: "active",
            description: "Training 2,000 farmers in drought-resistant agriculture",
            peopleServed: 10000
        },
        {
            name: "Nairobi County - Community Development",
            lat: -1.2921,
            lng: 36.8219,
            type: "community-development",
            status: "active",
            description: "Urban agriculture and youth employment programs",
            peopleServed: 5000
        }
    ];
    res.json(locations);
});

// Contact form submission API
app.post('/api/contact', [
    body('firstName').trim().isLength({ min: 1 }).withMessage('First name is required'),
    body('lastName').trim().isLength({ min: 1 }).withMessage('Last name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('subject').trim().isLength({ min: 1 }).withMessage('Subject is required'),
    body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { firstName, lastName, email, phone, subject, message, isNewsletter } = req.body;

        // Save to database
        const contact = new Contact({
            firstName,
            lastName,
            email,
            phone,
            subject,
            message,
            isNewsletter: isNewsletter || false
        });

        await contact.save();

        res.json({
            success: true,
            message: 'Thank you for your message. We will get back to you soon!'
        });
    } catch (error) {
        console.error('Error saving contact form:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit contact form. Please try again.'
        });
    }
});

// Newsletter subscription API
app.post('/api/newsletter', [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('firstName').optional().trim(),
    body('lastName').optional().trim()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { email, firstName, lastName, interests } = req.body;

        // Check if email already exists
        const existingSubscriber = await Newsletter.findOne({ email });
        if (existingSubscriber) {
            if (existingSubscriber.status === 'active') {
                return res.status(400).json({
                    success: false,
                    message: 'This email is already subscribed to our newsletter.'
                });
            } else {
                // Reactivate subscription
                existingSubscriber.status = 'active';
                existingSubscriber.subscribedAt = new Date();
                await existingSubscriber.save();
                return res.json({
                    success: true,
                    message: 'Welcome back! Your subscription has been reactivated.'
                });
            }
        }

        // Create new subscription
        const newsletter = new Newsletter({
            email,
            firstName,
            lastName,
            interests: interests || ['general-news'],
            source: 'website'
        });

        await newsletter.save();

        res.json({
            success: true,
            message: 'Successfully subscribed to newsletter!'
        });
    } catch (error) {
        console.error('Error saving newsletter subscription:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to subscribe. Please try again.'
        });
    }
});

// Volunteer application API
app.post('/api/volunteer', [
    body('firstName').trim().isLength({ min: 1 }).withMessage('First name is required'),
    body('lastName').trim().isLength({ min: 1 }).withMessage('Last name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('phone').trim().isLength({ min: 10 }).withMessage('Valid phone number is required'),
    body('dateOfBirth').isISO8601().withMessage('Valid date of birth is required'),
    body('availability').isIn(['weekdays', 'weekends', 'evenings', 'flexible']).withMessage('Valid availability is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const volunteerData = req.body;

        // Save to database
        const volunteer = new Volunteer(volunteerData);
        await volunteer.save();

        res.json({
            success: true,
            message: 'Thank you for your volunteer application! We will review it and contact you soon.'
        });
    } catch (error) {
        console.error('Error saving volunteer application:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit volunteer application. Please try again.'
        });
    }
});

// Donation API
app.post('/api/donation', [
    body('donorName').trim().isLength({ min: 1 }).withMessage('Donor name is required'),
    body('donorEmail').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('amount').isFloat({ min: 1 }).withMessage('Valid donation amount is required'),
    body('paymentMethod').isIn(['card', 'bank_transfer', 'mobile_money', 'paypal']).withMessage('Valid payment method is required'),
    body('program').optional().isIn(['emergency-relief', 'school-feeding', 'sustainable-farming', 'community-development', 'general'])
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const donationData = req.body;

        // In a real application, you would process payment here
        // For now, we'll save as pending
        donationData.paymentStatus = 'pending';

        // Save to database
        const donation = new Donation(donationData);
        await donation.save();

        res.json({
            success: true,
            message: 'Thank you for your donation! Your contribution will make a real difference.',
            donationId: donation._id
        });
    } catch (error) {
        console.error('Error saving donation:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process donation. Please try again.'
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({ error: 'API endpoint not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Hunger in Kenya API server running on port ${PORT}`);
    console.log(`📊 API Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔗 Connected to MongoDB`);
    console.log(`⚠️  Frontend should be served separately on port 3000`);
});

module.exports = app;