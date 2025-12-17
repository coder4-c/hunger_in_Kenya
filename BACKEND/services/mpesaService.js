const axios = require('axios');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

class MpesaService {
    constructor() {
        // M-Pesa API credentials (replace with actual credentials)
        this.consumerKey = process.env.MPESA_CONSUMER_KEY || 'your_consumer_key';
        this.consumerSecret = process.env.MPESA_CONSUMER_SECRET || 'your_consumer_secret';
        this.businessShortCode = process.env.MPESA_BUSINESS_SHORT_CODE || '713185939'; // Your M-Pesa number
        this.passkey = process.env.MPESA_PASSKEY || 'your_passkey';
        this.callbackUrl = process.env.MPESA_CALLBACK_URL || 'https://yourdomain.com/api/mpesa/callback';
        this.timeoutUrl = process.env.MPESA_TIMEOUT_URL || 'https://yourdomain.com/api/mpesa/timeout';
        
        // API URLs
        this.baseUrl = 'https://sandbox.safaricom.co.ke'; // Use production URL for live
        this.authUrl = `${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`;
        this.stkPushUrl = `${this.baseUrl}/mpesa/stkpush/v1/processrequest`;
    }

    // Generate access token
    async generateAccessToken() {
        try {
            const auth = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64');
            
            const response = await axios.get(this.authUrl, {
                headers: {
                    'Authorization': `Basic ${auth}`
                }
            });

            return response.data.access_token;
        } catch (error) {
            console.error('Error generating access token:', error.response?.data || error.message);
            throw new Error('Failed to generate access token');
        }
    }

    // Generate password for STK Push
    generatePassword() {
        const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
        const dataToEncode = `${this.businessShortCode}${this.passkey}${timestamp}`;
        return crypto.createHash('sha256').update(dataToEncode).digest('hex');
    }

    // Initiate STK Push
    async initiateSTKPush(phoneNumber, amount, accountReference, transactionDesc) {
        try {
            const accessToken = await this.generateAccessToken();
            const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
            const password = this.generatePassword();
            
            const requestBody = {
                BusinessShortCode: this.businessShortCode,
                Password: password,
                Timestamp: timestamp,
                TransactionType: 'CustomerPayBillOnline',
                Amount: Math.round(amount), // Ensure integer
                PartyA: phoneNumber,
                PartyB: this.businessShortCode,
                PhoneNumber: phoneNumber,
                CallBackURL: this.callbackUrl,
                AccountReference: accountReference,
                TransactionDesc: transactionDesc || 'Donation to Hunger in Kenya'
            };

            console.log('Initiating STK Push:', requestBody);

            const response = await axios.post(this.stkPushUrl, requestBody, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            return {
                success: true,
                checkoutRequestID: response.data.CheckoutRequestID,
                customerMessage: response.data.CustomerMessage,
                responseCode: response.data.ResponseCode,
                responseDescription: response.data.ResponseDescription
            };

        } catch (error) {
            console.error('Error initiating STK Push:', error.response?.data || error.message);
            
            // Handle specific M-Pesa errors
            if (error.response?.data) {
                const errorData = error.response.data;
                return {
                    success: false,
                    errorCode: errorData.errorCode || 'UNKNOWN_ERROR',
                    errorMessage: errorData.errorMessage || errorData.ResponseDescription || 'STK Push failed',
                    responseCode: errorData.responseCode || '1'
                };
            }
            
            throw new Error('Failed to initiate STK Push: ' + error.message);
        }
    }

    // Process STK Push callback
    processCallback(callbackData) {
        try {
            const { Body } = callbackData;
            
            if (!Body || !Body.stkCallback) {
                throw new Error('Invalid callback data structure');
            }

            const { stkCallback } = Body;
            
            return {
                success: stkCallback.ResultCode === 0,
                resultCode: stkCallback.ResultCode,
                resultDesc: stkCallback.ResultDesc,
                checkoutRequestID: stkCallback.CheckoutRequestID,
                merchantRequestID: stkCallback.MerchantRequestID,
                amount: stkCallback.Amount,
                transactionID: stkCallback.CallbackMetadata?.Item?.find(item => item.Name === 'MpesaReceiptNumber')?.Value,
                phoneNumber: stkCallback.CallbackMetadata?.Item?.find(item => item.Name === 'MSISDN')?.Value,
                transactionDate: stkCallback.CallbackMetadata?.Item?.find(item => item.Name === 'TransactionDate')?.Value,
                metadata: stkCallback.CallbackMetadata?.Item || []
            };

        } catch (error) {
            console.error('Error processing callback:', error);
            throw new Error('Failed to process callback data');
        }
    }

    // Query transaction status
    async queryTransactionStatus(checkoutRequestID) {
        try {
            const accessToken = await this.generateAccessToken();
            const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
            const password = this.generatePassword();

            const requestBody = {
                BusinessShortCode: this.businessShortCode,
                Password: password,
                Timestamp: timestamp,
                CheckoutRequestID: checkoutRequestID
            };

            const response = await axios.post(
                `${this.baseUrl}/mpesa/stkpushquery/v1/query`,
                requestBody,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return {
                success: response.data.ResponseCode === '0',
                responseCode: response.data.ResponseCode,
                responseDescription: response.data.ResponseDescription,
                checkoutRequestID: response.data.CheckoutRequestID,
                resultCode: response.data.ResultCode,
                resultDesc: response.data.ResultDesc,
                amount: response.data.Amount,
                transactionID: response.data.MpesaReceiptNumber,
                phoneNumber: response.data.PhoneNumber,
                transactionDate: response.data.TransactionDate
            };

        } catch (error) {
            console.error('Error querying transaction status:', error.response?.data || error.message);
            throw new Error('Failed to query transaction status');
        }
    }

    // Format phone number for M-Pesa (ensure it starts with 254)
    formatPhoneNumber(phoneNumber) {
        if (!phoneNumber) {
            throw new Error('Phone number is required');
        }

        // Remove all non-digit characters
        const digits = phoneNumber.replace(/\D/g, '');
        
        // Handle different formats
        if (digits.startsWith('254')) {
            return digits;
        } else if (digits.startsWith('0')) {
            return '254' + digits.substring(1);
        } else if (digits.length === 9) {
            return '254' + digits;
        } else {
            throw new Error('Invalid phone number format');
        }
    }

    // Validate donation amount (minimum 10 KES)
    validateAmount(amount) {
        const numAmount = parseFloat(amount);
        
        if (isNaN(numAmount) || numAmount < 10) {
            throw new Error('Minimum donation amount is KES 10');
        }
        
        if (numAmount > 150000) { // M-Pesa daily limit
            throw new Error('Maximum donation amount is KES 150,000');
        }
        
        return Math.round(numAmount);
    }

    // Generate unique account reference
    generateAccountReference(donorName, donationId) {
        const cleanName = donorName.replace(/[^a-zA-Z0-9]/g, '').substring(0, 10);
        const shortId = donationId.substring(0, 8);
        return `${cleanName}${shortId}`.toUpperCase();
    }

    // Test connection
    async testConnection() {
        try {
            const token = await this.generateAccessToken();
            return {
                success: true,
                message: 'M-Pesa connection successful',
                hasToken: !!token
            };
        } catch (error) {
            return {
                success: false,
                message: 'M-Pesa connection failed',
                error: error.message
            };
        }
    }
}

module.exports = MpesaService;