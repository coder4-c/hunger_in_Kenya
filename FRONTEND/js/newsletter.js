// ===== NEWSLETTER JAVASCRIPT =====

class Newsletter {
    constructor() {
        this.forms = document.querySelectorAll('.newsletter-form');
        this.apiEndpoint = '/api/newsletter/subscribe'; // Placeholder endpoint
        this.successMessage = 'Thank you for subscribing! You\'ll receive updates on our progress.';
        this.errorMessage = 'Sorry, there was an error subscribing you. Please try again.';
        this.duplicateMessage = 'You\'re already subscribed to our newsletter.';
        
        this.init();
    }
    
    init() {
        this.setupForms();
        this.loadSavedSubscriptions();
        this.setupAccessibility();
        
        console.log('Newsletter system initialized');
    }
    
    // Setup all newsletter forms
    setupForms() {
        this.forms.forEach(form => {
            this.setupForm(form);
        });
    }
    
    // Setup individual form
    setupForm(form) {
        const emailInput = form.querySelector('input[type="email"]');
        const submitButton = form.querySelector('button[type="submit"]');
        
        if (!emailInput || !submitButton) {
            console.warn('Newsletter form missing required elements');
            return;
        }
        
        // Form submission handler
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmission(form);
        });
        
        // Email validation on blur
        emailInput.addEventListener('blur', () => {
            this.validateEmail(emailInput);
        });
        
        // Clear validation on input
        emailInput.addEventListener('input', () => {
            this.clearValidation(emailInput);
        });
        
        // Prevent double submission
        form.addEventListener('submit', (e) => {
            if (form.classList.contains('submitting')) {
                e.preventDefault();
                return false;
            }
        });
    }
    
    // Handle form submission
    async handleSubmission(form) {
        const emailInput = form.querySelector('input[type="email"]');
        const submitButton = form.querySelector('button[type="submit"]');
        const email = emailInput.value.trim();
        
        // Validate email
        if (!this.validateEmail(emailInput)) {
            this.showMessage(form, 'Please enter a valid email address.', 'error');
            return;
        }
        
        // Check if already subscribed
        if (this.isAlreadySubscribed(email)) {
            this.showMessage(form, this.duplicateMessage, 'info');
            return;
        }
        
        // Show loading state
        this.setLoadingState(form, true);
        
        try {
            // Simulate API call (replace with actual endpoint)
            const success = await this.subscribeEmail(email);
            
            if (success) {
                this.handleSuccess(form, email);
            } else {
                this.handleError(form);
            }
        } catch (error) {
            console.error('Newsletter subscription error:', error);
            this.handleError(form);
        } finally {
            this.setLoadingState(form, false);
        }
    }
    
    // Validate email format
    validateEmail(input) {
        const email = input.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            this.showValidationError(input, 'Email address is required.');
            return false;
        }
        
        if (!emailRegex.test(email)) {
            this.showValidationError(input, 'Please enter a valid email address.');
            return false;
        }
        
        this.clearValidation(input);
        return true;
    }
    
    // Show validation error
    showValidationError(input, message) {
        this.clearValidation(input);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'validation-error';
        errorDiv.textContent = message;
        
        input.parentNode.appendChild(errorDiv);
        input.classList.add('error');
        input.setAttribute('aria-invalid', 'true');
    }
    
    // Clear validation error
    clearValidation(input) {
        const existingError = input.parentNode.querySelector('.validation-error');
        if (existingError) {
            existingError.remove();
        }
        
        input.classList.remove('error');
        input.setAttribute('aria-invalid', 'false');
    }
    
    // Check if email is already subscribed
    isAlreadySubscribed(email) {
        const subscriptions = this.getSubscriptions();
        return subscriptions.includes(email.toLowerCase());
    }
    
    // Get all subscriptions from localStorage
    getSubscriptions() {
        const saved = getFromStorage('newsletterSubscriptions');
        return saved ? saved.emails : [];
    }
    
    // Save subscription to localStorage
    saveSubscription(email) {
        const subscriptions = this.getSubscriptions();
        if (!subscriptions.includes(email.toLowerCase())) {
            subscriptions.push(email.toLowerCase());
            saveToStorage('newsletterSubscriptions', {
                emails: subscriptions,
                lastUpdate: Date.now()
            });
        }
    }
    
    // Simulate email subscription API call
    async subscribeEmail(email) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simulate 90% success rate
        const success = Math.random() > 0.1;
        
        if (success) {
            this.saveSubscription(email);
        }
        
        return success;
    }
    
    // Handle successful subscription
    handleSuccess(form, email) {
        this.showMessage(form, this.successMessage, 'success');
        form.reset();
        
        // Track subscription
        this.trackEvent('newsletter_subscribed', {
            email: email,
            timestamp: Date.now()
        });
        
        // Show success animation
        this.showSuccessAnimation(form);
    }
    
    // Handle subscription error
    handleError(form) {
        this.showMessage(form, this.errorMessage, 'error');
    }
    
    // Show message to user
    showMessage(form, message, type) {
        // Remove existing messages
        this.clearMessage(form);
        
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `newsletter-message ${type}`;
        messageDiv.innerHTML = `
            <i class="fas ${this.getMessageIcon(type)}"></i>
            <span>${message}</span>
        `;
        
        // Insert message
        form.appendChild(messageDiv);
        
        // Auto-hide success messages
        if (type === 'success') {
            setTimeout(() => {
                this.clearMessage(form);
            }, 5000);
        }
        
        // Focus message for accessibility
        setTimeout(() => {
            messageDiv.focus();
        }, 100);
    }
    
    // Clear message
    clearMessage(form) {
        const existingMessage = form.querySelector('.newsletter-message');
        if (existingMessage) {
            existingMessage.remove();
        }
    }
    
    // Get icon for message type
    getMessageIcon(type) {
        switch (type) {
            case 'success':
                return 'fa-check-circle';
            case 'error':
                return 'fa-exclamation-circle';
            case 'info':
                return 'fa-info-circle';
            default:
                return 'fa-info-circle';
        }
    }
    
    // Set loading state
    setLoadingState(form, isLoading) {
        const submitButton = form.querySelector('button[type="submit"]');
        
        if (isLoading) {
            form.classList.add('submitting');
            submitButton.disabled = true;
            submitButton.innerHTML = `
                <i class="fas fa-spinner fa-spin"></i>
                Subscribing...
            `;
        } else {
            form.classList.remove('submitting');
            submitButton.disabled = false;
            submitButton.innerHTML = `
                <i class="fas fa-paper-plane"></i>
                Subscribe
            `;
        }
    }
    
    // Show success animation
    showSuccessAnimation(form) {
        const animation = document.createElement('div');
        animation.className = 'newsletter-success-animation';
        animation.innerHTML = `
            <div class="success-content">
                <i class="fas fa-check"></i>
                <span>Welcome to our community!</span>
            </div>
        `;
        
        document.body.appendChild(animation);
        
        // Trigger animation
        setTimeout(() => animation.classList.add('show'), 100);
        
        // Remove after animation
        setTimeout(() => {
            animation.classList.remove('show');
            setTimeout(() => animation.remove(), 300);
        }, 3000);
    }
    
    // Load saved subscriptions and show appropriate UI
    loadSavedSubscriptions() {
        const subscriptions = this.getSubscriptions();
        
        // If user is already subscribed, show different UI
        if (subscriptions.length > 0) {
            this.forms.forEach(form => {
                this.showSubscribedState(form);
            });
        }
    }
    
    // Show subscribed state
    showSubscribedState(form) {
        const emailInput = form.querySelector('input[type="email"]');
        const submitButton = form.querySelector('button[type="submit"]');
        
        if (emailInput && submitButton) {
            emailInput.value = subscriptions[subscriptions.length - 1];
            emailInput.readOnly = true;
            submitButton.innerHTML = `
                <i class="fas fa-check"></i>
                Subscribed
            `;
            submitButton.disabled = true;
            form.classList.add('subscribed');
        }
    }
    
    // Setup accessibility features
    setupAccessibility() {
        this.forms.forEach(form => {
            const emailInput = form.querySelector('input[type="email"]');
            const messageContainer = form.querySelector('.newsletter-message');
            
            if (emailInput) {
                // Add aria-describedby for validation errors
                emailInput.setAttribute('aria-describedby', 'email-error');
                
                // Add live region for messages
                if (!messageContainer) {
                    const liveRegion = document.createElement('div');
                    liveRegion.id = 'newsletter-live-region';
                    liveRegion.setAttribute('aria-live', 'polite');
                    liveRegion.setAttribute('aria-atomic', 'true');
                    liveRegion.className = 'sr-only';
                    form.appendChild(liveRegion);
                }
            }
        });
    }
    
    // Track events for analytics
    trackEvent(eventName, eventData) {
        // Google Analytics tracking (if implemented)
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, eventData);
        }
        
        // Console log for development
        console.log('Newsletter Event:', eventName, eventData);
    }
    
    // Unsubscribe functionality
    unsubscribe(email) {
        const subscriptions = this.getSubscriptions();
        const updatedSubscriptions = subscriptions.filter(sub => sub !== email.toLowerCase());
        
        saveToStorage('newsletterSubscriptions', {
            emails: updatedSubscriptions,
            lastUpdate: Date.now()
        });
        
        this.trackEvent('newsletter_unsubscribed', {
            email: email,
            timestamp: Date.now()
        });
        
        return true;
    }
    
    // Get subscription statistics
    getStats() {
        const subscriptions = this.getSubscriptions();
        return {
            totalSubscribers: subscriptions.length,
            lastUpdate: getFromStorage('newsletterSubscriptions')?.lastUpdate || null
        };
    }
    
    // Reset form to initial state
    reset(form) {
        form.reset();
        form.classList.remove('submitting', 'subscribed');
        
        const emailInput = form.querySelector('input[type="email"]');
        const submitButton = form.querySelector('button[type="submit"]');
        
        if (emailInput && submitButton) {
            emailInput.readOnly = false;
            emailInput.setAttribute('aria-invalid', 'false');
            submitButton.disabled = false;
            submitButton.innerHTML = `
                <i class="fas fa-paper-plane"></i>
                Subscribe
            `;
        }
        
        this.clearMessage(form);
        this.clearValidation(emailInput);
    }
}

// Newsletter-specific CSS styles
const newsletterStyles = `
    .newsletter-form {
        position: relative;
    }
    
    .newsletter-form.submitting {
        opacity: 0.8;
    }
    
    .newsletter-form.subscribed {
        background: rgba(34, 197, 94, 0.1);
        border-radius: var(--border-radius);
        padding: 1rem;
    }
    
    .newsletter-message {
        margin-top: 1rem;
        padding: 0.75rem 1rem;
        border-radius: var(--border-radius-sm);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9rem;
        animation: slideIn 0.3s ease;
    }
    
    .newsletter-message.success {
        background: rgba(34, 197, 94, 0.1);
        color: var(--kenya-green);
        border: 1px solid rgba(34, 197, 94, 0.2);
    }
    
    .newsletter-message.error {
        background: rgba(239, 68, 68, 0.1);
        color: var(--kenya-red);
        border: 1px solid rgba(239, 68, 68, 0.2);
    }
    
    .newsletter-message.info {
        background: rgba(59, 130, 246, 0.1);
        color: #3B82F6;
        border: 1px solid rgba(59, 130, 246, 0.2);
    }
    
    .newsletter-success-animation {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        background: var(--kenya-white);
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-xl);
        padding: 2rem;
        text-align: center;
        z-index: 10000;
        transition: transform 0.3s ease;
    }
    
    .newsletter-success-animation.show {
        transform: translate(-50%, -50%) scale(1);
    }
    
    .success-content {
        color: var(--kenya-green);
    }
    
    .success-content i {
        font-size: 2rem;
        margin-bottom: 0.5rem;
        display: block;
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .validation-error {
        color: var(--kenya-red);
        font-size: 0.875rem;
        margin-top: 0.25rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }
    
    .validation-error i {
        font-size: 0.75rem;
    }
    
    input.error {
        border-color: var(--kenya-red) !important;
        box-shadow: 0 0 0 3px rgba(187, 0, 0, 0.1) !important;
    }
    
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }
`;

// Inject newsletter styles
const newsletterStyleSheet = document.createElement('style');
newsletterStyleSheet.textContent = newsletterStyles;
document.head.appendChild(newsletterStyleSheet);

// Initialize newsletter when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.newsletter = new Newsletter();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Newsletter;
}