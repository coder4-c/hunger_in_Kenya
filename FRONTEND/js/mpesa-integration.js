// ===== M-PESA INTEGRATION =====

class MpesaIntegration {
    constructor() {
        this.companyMpesaNumber = '0713185939';
        this.apiBaseUrl = '/api/mpesa';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupFormValidation();
    }

    setupEventListeners() {
        const donationForm = document.getElementById('donation-form');
        if (donationForm) {
            donationForm.addEventListener('submit', this.handleDonationSubmit.bind(this));
        }

        // Payment method change handler
        const paymentOptions = document.querySelectorAll('input[name="payment"]');
        paymentOptions.forEach(option => {
            option.addEventListener('change', this.handlePaymentMethodChange.bind(this));
        });

        // Amount selection handlers
        const amountButtons = document.querySelectorAll('.amount-btn');
        amountButtons.forEach(btn => {
            btn.addEventListener('click', this.handleAmountSelection.bind(this));
        });

        // Custom amount input handler
        const customAmountInput = document.getElementById('custom-amount');
        if (customAmountInput) {
            customAmountInput.addEventListener('input', this.handleCustomAmountChange.bind(this));
        }
    }

    setupFormValidation() {
        // Set minimum amount to 10 KES
        const customAmountInput = document.getElementById('custom-amount');
        if (customAmountInput) {
            customAmountInput.min = '10';
        }
    }

    handlePaymentMethodChange(event) {
        const selectedMethod = event.target.value;
        const paymentDetails = document.getElementById('payment-details');
        
        // Clear previous payment details
        if (paymentDetails) {
            paymentDetails.innerHTML = '';
        }

        if (selectedMethod === 'mpesa') {
            this.showMpesaInstructions();
        }
    }

    showMpesaInstructions() {
        const paymentDetails = document.getElementById('payment-details');
        if (paymentDetails) {
            paymentDetails.innerHTML = `
                <div class="mpesa-instructions">
                    <div class="instruction-step">
                        <i class="fas fa-mobile-alt"></i>
                        <div class="step-content">
                            <h4>M-Pesa Payment Instructions</h4>
                            <p>When you click "Donate Now", you'll receive an M-Pesa prompt on your phone.</p>
                        </div>
                    </div>
                    <div class="instruction-step">
                        <i class="fas fa-shield-alt"></i>
                        <div class="step-content">
                            <h4>Secure Payment</h4>
                            <p>Your payment is processed securely through M-Pesa's official API.</p>
                        </div>
                    </div>
                    <div class="mpesa-info">
                        <p><strong>Paybill:</strong> ${this.companyMpesaNumber}</p>
                        <p><strong>Account:</strong> HungerKenya</p>
                    </div>
                </div>
            `;
        }
    }

    handleAmountSelection(event) {
        const amount = event.target.dataset.amount;
        const customAmountInput = document.getElementById('custom-amount');
        
        // Update custom amount input
        if (customAmountInput) {
            customAmountInput.value = amount;
        }

        // Update selected state
        document.querySelectorAll('.amount-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        event.target.classList.add('selected');

        // Update summary
        this.updateDonationSummary();
    }

    handleCustomAmountChange(event) {
        const amount = event.target.value;
        
        // Remove selected state from amount buttons
        document.querySelectorAll('.amount-btn').forEach(btn => {
            btn.classList.remove('selected');
        });

        // Update summary
        this.updateDonationSummary();
    }

    updateDonationSummary() {
        const customAmountInput = document.getElementById('custom-amount');
        const summaryAmount = document.getElementById('summary-amount');
        const summaryTotal = document.getElementById('summary-total');

        if (customAmountInput && summaryAmount && summaryTotal) {
            const amount = customAmountInput.value || '50';
            const formattedAmount = `KSh ${parseFloat(amount).toFixed(2)}`;
            
            summaryAmount.textContent = formattedAmount;
            summaryTotal.textContent = formattedAmount;
        }
    }

    async handleDonationSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const paymentMethod = formData.get('payment');

        if (paymentMethod === 'mpesa') {
            await this.processMpesaDonation(formData);
        } else {
            // Handle other payment methods
            this.processOtherDonation(formData);
        }
    }

    async processMpesaDonation(formData) {
        try {
            // Validate minimum amount
            const amount = parseFloat(formData.get('custom-amount') || '0');
            if (amount < 10) {
                this.showError('Minimum donation amount is KSh 10');
                return;
            }

            // Show loading state
            this.showLoading('Initiating M-Pesa payment...');

            // Prepare donation data
            const donationData = {
                amount: amount,
                currency: 'KES',
                donorName: `${formData.get('firstName')} ${formData.get('lastName')}`,
                donorEmail: formData.get('email'),
                phoneNumber: formData.get('phone'),
                paymentMethod: 'mpesa',
                program: formData.get('designation'),
                isRecurring: formData.get('frequency') !== 'one-time',
                recurringInterval: formData.get('frequency'),
                isAnonymous: formData.get('anonymous') === 'on',
                message: formData.get('message') || ''
            };

            // Initiate M-Pesa STK Push
            const response = await fetch(`${this.apiBaseUrl}/stk-push`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(donationData)
            });

            const result = await response.json();

            if (result.success) {
                this.showMpesaPrompt(result.checkoutRequestID);
                this.trackDonationAttempt(donationData);
            } else {
                throw new Error(result.message || 'M-Pesa initialization failed');
            }

        } catch (error) {
            console.error('M-Pesa donation error:', error);
            this.showError('Failed to initiate M-Pesa payment. Please try again.');
        } finally {
            this.hideLoading();
        }
    }

    showMpesaPrompt(checkoutRequestID) {
        // Show success message with M-Pesa instructions
        const modal = document.createElement('div');
        modal.className = 'mpesa-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <i class="fas fa-mobile-alt"></i>
                    <h3>Check Your Phone</h3>
                </div>
                <div class="modal-body">
                    <p>We've sent an M-Pesa prompt to your phone.</p>
                    <p>Please check your phone and complete the payment:</p>
                    <div class="mpesa-details">
                        <p><strong>Paybill:</strong> ${this.companyMpesaNumber}</p>
                        <p><strong>Account:</strong> HungerKenya</p>
                        <p><strong>Reference:</strong> ${checkoutRequestID.substring(0, 8)}</p>
                    </div>
                    <div class="loading-spinner">
                        <i class="fas fa-spinner fa-spin"></i>
                        <span>Waiting for payment confirmation...</span>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.mpesa-modal').remove()">
                        Cancel
                    </button>
                    <button class="btn btn-outline" onclick="location.reload()">
                        Try Again
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Start polling for payment status
        this.pollPaymentStatus(checkoutRequestID);
    }

    async pollPaymentStatus(checkoutRequestID) {
        const maxAttempts = 30; // 5 minutes (30 * 10 seconds)
        let attempts = 0;

        const checkStatus = async () => {
            try {
                const response = await fetch(`${this.apiBaseUrl}/status/${checkoutRequestID}`);
                const result = await response.json();

                if (result.success) {
                    if (result.status === 'completed') {
                        this.showPaymentSuccess(result.transactionID);
                    } else if (result.status === 'failed') {
                        this.showPaymentFailed(result.errorMessage);
                    } else {
                        // Still pending, continue polling
                        if (attempts < maxAttempts) {
                            attempts++;
                            setTimeout(checkStatus, 10000); // Check every 10 seconds
                        } else {
                            this.showPaymentTimeout();
                        }
                    }
                }
            } catch (error) {
                console.error('Status check error:', error);
                if (attempts < maxAttempts) {
                    attempts++;
                    setTimeout(checkStatus, 10000);
                }
            }
        };

        checkStatus();
    }

    showPaymentSuccess(transactionID) {
        const modal = document.querySelector('.mpesa-modal');
        if (modal) {
            modal.querySelector('.modal-body').innerHTML = `
                <div class="success-message">
                    <i class="fas fa-check-circle"></i>
                    <h3>Payment Successful!</h3>
                    <p>Thank you for your donation. Your contribution will make a real difference.</p>
                    <div class="transaction-details">
                        <p><strong>Transaction ID:</strong> ${transactionID}</p>
                        <p>You will receive a confirmation email shortly.</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="location.reload()">
                        Continue
                    </button>
                </div>
            `;
        }

        // Track successful donation
        this.trackSuccessfulDonation(transactionID);
    }

    showPaymentFailed(errorMessage) {
        const modal = document.querySelector('.mpesa-modal');
        if (modal) {
            modal.querySelector('.modal-body').innerHTML = `
                <div class="error-message">
                    <i class="fas fa-times-circle"></i>
                    <h3>Payment Failed</h3>
                    <p>${errorMessage || 'The payment was not completed.'}</p>
                    <p>Please try again or contact support if the problem persists.</p>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.mpesa-modal').remove()">
                        Close
                    </button>
                    <button class="btn btn-primary" onclick="location.reload()">
                        Try Again
                    </button>
                </div>
            `;
        }
    }

    showPaymentTimeout() {
        this.showPaymentFailed('Payment timeout. Please try again.');
    }

    showLoading(message) {
        // Create or update loading overlay
        let loading = document.querySelector('.loading-overlay');
        if (!loading) {
            loading = document.createElement('div');
            loading.className = 'loading-overlay';
            document.body.appendChild(loading);
        }
        
        loading.innerHTML = `
            <div class="loading-content">
                <i class="fas fa-spinner fa-spin"></i>
                <p>${message}</p>
            </div>
        `;
        loading.style.display = 'flex';
    }

    hideLoading() {
        const loading = document.querySelector('.loading-overlay');
        if (loading) {
            loading.style.display = 'none';
        }
    }

    showError(message) {
        // Create error notification
        const error = document.createElement('div');
        error.className = 'error-notification';
        error.innerHTML = `
            <div class="error-content">
                <i class="fas fa-exclamation-triangle"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        document.body.appendChild(error);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (error.parentNode) {
                error.remove();
            }
        }, 5000);
    }

    trackDonationAttempt(donationData) {
        // Track donation attempt for analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'donation_attempt', {
                'currency': donationData.currency,
                'value': donationData.amount,
                'payment_method': donationData.paymentMethod
            });
        }
    }

    trackSuccessfulDonation(transactionID) {
        // Track successful donation
        if (typeof gtag !== 'undefined') {
            gtag('event', 'donation_success', {
                'transaction_id': transactionID,
                'currency': 'KES'
            });
        }

        // Dispatch custom event for other components
        document.dispatchEvent(new CustomEvent('donationMade', {
            detail: {
                amount: parseFloat(document.getElementById('custom-amount').value),
                currency: 'KES',
                paymentMethod: 'mpesa',
                transactionID: transactionID
            }
        }));
    }

    processOtherDonation(formData) {
        // Handle other payment methods (PayPal, Card, etc.)
        // This would integrate with respective APIs
        console.log('Processing other payment method:', formData.get('payment'));
    }
}

// Initialize M-Pesa integration when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize on donation page
    if (document.getElementById('donation-form')) {
        window.mpesaIntegration = new MpesaIntegration();
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MpesaIntegration;
}