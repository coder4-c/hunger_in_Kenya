const express = require('express');
const { body, validationResult } = require('express-validator');
const MpesaService = require('../services/mpesaService');
const Donation = require('../models/Donation');

const router = express.Router();
const mpesaService = new MpesaService();

// Middleware to validate request
const validateMpesaRequest = [
    body('amount').isFloat({ min: 10 }).withMessage('Amount must be at least KES 10'),
    body('donorName').trim().isLength({ min: 2 }).withMessage('Donor name is required'),
    body('donorEmail').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('phoneNumber').trim().isLength({ min: 10 }).withMessage('Phone number is required'),
    body('program').optional().isIn(['emergency-relief', 'school-feeding', 'sustainable-farming', 'community-development', 'general'])
];

// Initiate M-Pesa STK Push
router.post('/stk-push', validateMpesaRequest, async (req, res) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const {
            amount,
            donorName,
            donorEmail,
            phoneNumber,
            program,
            isRecurring,
            recurringInterval,
            isAnonymous,
            message
        } = req.body;

        // Validate and format data
        const validatedAmount = mpesaService.validateAmount(amount);
        const formattedPhone = mpesaService.formatPhoneNumber(phoneNumber);

        // Create donation record (pending status)
        const donation = new Donation({
            donorName,
            donorEmail,
            amount: validatedAmount,
            currency: 'KES',
            paymentMethod: 'mpesa',
            paymentStatus: 'pending',
            program: program || 'general',
            isRecurring: isRecurring || false,
            recurringInterval: recurringInterval || 'one-time',
            isAnonymous: isAnonymous || false,
            message: message || '',
            phoneNumber: formattedPhone,
            mpesaReference: mpesaService.generateAccountReference(donorName, new Date().getTime().toString())
        });

        await donation.save();

        // Generate account reference
        const accountReference = mpesaService.generateAccountReference(donorName, donation._id.toString());
        
        // Initiate STK Push
        const stkResult = await mpesaService.initiateSTKPush(
            formattedPhone,
            validatedAmount,
            accountReference,
            `Donation to Hunger in Kenya by ${donorName}`
        );

        if (stkResult.success) {
            // Update donation with checkout request ID
            donation.mpesaReference = stkResult.checkoutRequestID;
            await donation.save();

            console.log('STK Push initiated successfully:', {
                donationId: donation._id,
                checkoutRequestID: stkResult.checkoutRequestID,
                amount: validatedAmount,
                phone: formattedPhone
            });

            res.json({
                success: true,
                checkoutRequestID: stkResult.checkoutRequestID,
                customerMessage: stkResult.customerMessage,
                donationId: donation._id,
                message: 'STK Push initiated successfully. Please check your phone.'
            });
        } else {
            // Update donation status to failed
            donation.paymentStatus = 'failed';
            await donation.save();

            res.status(400).json({
                success: false,
                message: stkResult.errorMessage || 'Failed to initiate M-Pesa payment',
                errorCode: stkResult.errorCode,
                donationId: donation._id
            });
        }

    } catch (error) {
        console.error('Error in STK Push endpoint:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// Query transaction status
router.get('/status/:checkoutRequestID', async (req, res) => {
    try {
        const { checkoutRequestID } = req.params;

        if (!checkoutRequestID) {
            return res.status(400).json({
                success: false,
                message: 'Checkout Request ID is required'
            });
        }

        // Find donation by checkout request ID
        const donation = await Donation.findOne({ mpesaReference: checkoutRequestID });
        
        if (!donation) {
            return res.status(404).json({
                success: false,
                message: 'Donation not found'
            });
        }

        // Query M-Pesa for transaction status
        const statusResult = await mpesaService.queryTransactionStatus(checkoutRequestID);

        if (statusResult.success) {
            // Payment completed successfully
            if (donation.paymentStatus !== 'completed') {
                donation.paymentStatus = 'completed';
                donation.mpesaReceipt = statusResult.transactionID;
                await donation.save();

                // TODO: Send confirmation email
                // await sendDonationConfirmation(donation);
                
                console.log('Payment completed:', {
                    donationId: donation._id,
                    transactionID: statusResult.transactionID,
                    amount: donation.amount
                });
            }

            res.json({
                success: true,
                status: 'completed',
                transactionID: statusResult.transactionID,
                amount: donation.amount,
                phoneNumber: donation.phoneNumber,
                message: 'Payment completed successfully'
            });
        } else {
            // Payment failed or pending
            const currentStatus = donation.paymentStatus;
            
            if (statusResult.resultCode !== null && statusResult.resultCode !== '0') {
                // Payment failed
                if (donation.paymentStatus !== 'completed') {
                    donation.paymentStatus = 'failed';
                    await donation.save();
                }
                
                res.json({
                    success: false,
                    status: 'failed',
                    errorMessage: statusResult.resultDesc || 'Payment failed',
                    donationId: donation._id
                });
            } else {
                // Still pending
                res.json({
                    success: true,
                    status: 'pending',
                    message: 'Payment is still being processed',
                    donationId: donation._id
                });
            }
        }

    } catch (error) {
        console.error('Error querying transaction status:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// M-Pesa callback URL (called by Safaricom)
router.post('/callback', async (req, res) => {
    try {
        console.log('Received M-Pesa callback:', req.body);

        const callbackResult = mpesaService.processCallback(req.body);
        
        // Find donation by checkout request ID
        const donation = await Donation.findOne({ mpesaReference: callbackResult.checkoutRequestID });
        
        if (!donation) {
            console.error('Donation not found for checkout request:', callbackResult.checkoutRequestID);
            return res.status(404).json({
                success: false,
                message: 'Donation not found'
            });
        }

        if (callbackResult.success) {
            // Payment successful
            donation.paymentStatus = 'completed';
            donation.mpesaReceipt = callbackResult.transactionID;
            donation.phoneNumber = callbackResult.phoneNumber;
            await donation.save();

            console.log('Payment confirmed via callback:', {
                donationId: donation._id,
                transactionID: callbackResult.transactionID,
                amount: callbackResult.amount
            });

            // TODO: Send confirmation email
            // await sendDonationConfirmation(donation);

        } else {
            // Payment failed
            donation.paymentStatus = 'failed';
            await donation.save();

            console.log('Payment failed via callback:', {
                donationId: donation._id,
                resultCode: callbackResult.resultCode,
                resultDesc: callbackResult.resultDesc
            });
        }

        // Always respond with success to Safaricom
        res.json({
            ResultCode: 0,
            ResultDesc: 'Accepted'
        });

    } catch (error) {
        console.error('Error processing M-Pesa callback:', error);
        
        // Still respond with success to avoid callback retries
        res.json({
            ResultCode: 0,
            ResultDesc: 'Accepted'
        });
    }
});

// M-Pesa timeout URL (called by Safaricom if transaction times out)
router.post('/timeout', async (req, res) => {
    try {
        console.log('Received M-Pesa timeout:', req.body);

        const { Body } = req.body;
        if (Body && Body.stkCallback) {
            const { CheckoutRequestID } = Body.stkCallback;
            
            // Find and update donation
            const donation = await Donation.findOne({ mpesaReference: CheckoutRequestID });
            if (donation && donation.paymentStatus === 'pending') {
                donation.paymentStatus = 'failed';
                await donation.save();
                
                console.log('Payment marked as failed due to timeout:', donation._id);
            }
        }

        res.json({
            ResultCode: 0,
            ResultDesc: 'Accepted'
        });

    } catch (error) {
        console.error('Error processing M-Pesa timeout:', error);
        res.json({
            ResultCode: 0,
            ResultDesc: 'Accepted'
        });
    }
});

// Test M-Pesa connection
router.get('/test', async (req, res) => {
    try {
        const testResult = await mpesaService.testConnection();
        res.json(testResult);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'M-Pesa test failed',
            error: error.message
        });
    }
});

module.exports = router;