// ===== M-PESA INTEGRATION - SIMPLIFIED =====

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

        // Frequency change handler
        const frequencyOptions = document.querySelectorAll('input[name="frequency"]');
        frequencyOptions.forEach(option => {
            option.addEventListener('change', this.updateImpactPreview.bind(this));
        });
    }

    setupFormValidation() {
        // Set minimum amount to 10 KES
        const customAmountInput = document.getElementById('custom-amount');
        if (customAmountInput) {
            customAmountInput.min = '10';
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

        // Update impact preview
        this.updateImpactPreview();
    }

    handleCustomAmountChange(event) {
        const amount = event.target.value;
        
        // Remove selected state from amount buttons
        document.querySelectorAll('.amount-btn').forEach(btn => {
            btn.classList.remove('selected');
        });

        // Update impact preview
        this.updateImpactPreview();
    }

    updateImpactPreview() {
        const amount = parseFloat(document.getElementById('custom-amount').value) || 0;
        const impactText = document.getElementById('impact-text');
        
        if (impactText) {
            let impactMessage = '';
            
            if (amount >= 1000) {
                impactMessage = 'Your donation will support a community farming program';
            } else if (amount >= 250) {
                impactMessage = 'Your donation will provide seeds and tools for farmers';
            } else if (amount >= 100) {
                impactMessage = 'Your donation will provide school meals for 5 children';
            } else if (amount >= 50) {
                impactMessage = 'Your donation will feed a family for one day';
            } else if (amount >= 10) {
                impactMessage = 'Your donation will provide a meal for a child';
            } else {
                impactMessage = 'Your donation will provide meals for families in need';
            }
            
            impactText.textContent = impactMessage;
        }
    }

    async handleDonationSubmit(event) {
        event.preventDefault();

        try {
            // Get form data
            const amount = parseFloat(document.getElementById('custom-amount').value);
            const frequency = document.querySelector('input[name="frequency"]:checked').value;

            // Validate amount
            if (!amount || amount < 10) {
                this.showError('Minimum donation amount is KSh 10');
                return;
            }

            // Show loading state
            this.showLoading('Preparing M-Pesa payment...');

            // For simplified donations, we'll collect phone number during M-Pesa flow
            const donationData = {
                amount: amount,
                currency: 'KES',
                donorName: 'Anonymous Donor', // Will be updated if user provides later
                donorEmail: 'anonymous@hungerinkenya.org', // Placeholder
                phoneNumber: '254000000000', // Will be provided by M-Pesa
                paymentMethod: 'mpesa',
                program: 'general',
                isRecurring: frequency === 'monthly',
                recurringInterval: frequency,
                isAnonymous: true,
                message: `Simplified donation via website - ${frequency} donation`
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
                this.showMpesaPrompt(result.checkoutRequestID, amount);
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

    showMpesaPrompt(checkoutRequestID, amount) {
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
                    <p>We've sent an M-Pesa prompt to your phone for <strong>KSh ${amount}</strong>.</p>
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
                    <h3>Thank You!</h3>
                    <p>Your donation has been received successfully.</p>
                    <p>Your contribution will help feed families affected by Kenya's hunger crisis.</p>
                    <div class="transaction-details">
                        <p><strong>Transaction ID:</strong> ${transactionID}</p>
                        <p>You will receive a confirmation SMS shortly.</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="location.reload()">
                        Donate Again
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
}

// Initialize M-Pesa integration when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize on donation page
    if (document.getElementById('donation-form')) {
        window.mpesaIntegration = new MpesaIntegration();
        
        // Set default amount
        const defaultAmount = document.querySelector('.amount-btn[data-amount="50"]');
        if (defaultAmount) {
            defaultAmount.click();
        }
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MpesaIntegration;
}