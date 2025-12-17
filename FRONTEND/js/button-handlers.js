// ===== BUTTON HANDLERS - COMPREHENSIVE BUTTON FUNCTIONALITY =====

class ButtonManager {
    constructor() {
        this.apiBaseUrl = '/api';
        this.init();
    }

    init() {
        this.setupApplyNowButtons();
        this.setupFormSubmissions();
        this.setupSocialMediaButtons();
        this.setupDownloadButtons();
        this.setupGenericButtons();
        
        console.log('Button Manager initialized');
    }

    // ===== APPLY NOW BUTTONS =====
    setupApplyNowButtons() {
        document.querySelectorAll('.apply-now-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleApplyNowClick(button);
            });
        });
    }

    handleApplyNowClick(button) {
        const opportunity = button.dataset.opportunity;
        const targetForm = document.querySelector(button.getAttribute('href'));
        
        if (targetForm) {
            // Scroll to form with smooth animation
            this.scrollToForm(targetForm);
            
            // Pre-fill the form with opportunity data
            this.prefillVolunteerForm(opportunity);
            
            // Add visual feedback
            this.highlightForm(targetForm);
            
            // Track button click
            this.trackEvent('apply_now_click', {
                opportunity: opportunity,
                timestamp: Date.now()
            });
        }
    }

    scrollToForm(form) {
        const navbarHeight = 70;
        const formTop = form.offsetTop - navbarHeight - 20;
        
        window.scrollTo({
            top: formTop,
            behavior: 'smooth'
        });
    }

    prefillVolunteerForm(opportunity) {
        const form = document.getElementById('volunteer-form');
        if (!form) return;

        // Clear existing data first
        this.clearForm(form);
        
        // Add opportunity-specific text to skills/comments field
        const skillsField = form.querySelector('#skills');
        const commentsField = form.querySelector('#comments');
        
        if (skillsField && !skillsField.value) {
            skillsField.value = `Interested in: ${opportunity}`;
        }
        
        if (commentsField && !commentsField.value) {
            commentsField.value = `I am applying for the ${opportunity} position.`;
        }
        
        // Scroll to first required field
        setTimeout(() => {
            const firstRequired = form.querySelector('input[required]');
            if (firstRequired) {
                firstRequired.focus();
            }
        }, 800);
    }

    clearForm(form) {
        const inputs = form.querySelectorAll('input:not([type="radio"]):not([type="checkbox"]), textarea');
        inputs.forEach(input => {
            if (!input.hasAttribute('data-preserve')) {
                input.value = '';
            }
        });
        
        // Uncheck all checkboxes except newsletter subscription
        const checkboxes = form.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            if (!checkbox.name.includes('newsletter')) {
                checkbox.checked = false;
            }
        });
    }

    highlightForm(form) {
        form.style.transition = 'all 0.3s ease';
        form.style.boxShadow = '0 0 20px rgba(187, 0, 0, 0.3)';
        form.style.border = '2px solid var(--kenya-red)';
        
        setTimeout(() => {
            form.style.boxShadow = '';
            form.style.border = '';
        }, 2000);
    }

    // ===== FORM SUBMISSIONS =====
    setupFormSubmissions() {
        // Volunteer form
        const volunteerForm = document.getElementById('volunteer-form');
        if (volunteerForm) {
            volunteerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleVolunteerSubmission(volunteerForm);
            });
        }

        // Contact form
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactSubmission(contactForm);
            });
        }
    }

    async handleVolunteerSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Validate required fields
        if (!this.validateVolunteerForm(data)) {
            return;
        }

        try {
            this.setFormLoading(form, true);
            
            // Simulate API call (replace with actual endpoint)
            const response = await fetch(`${this.apiBaseUrl}/volunteers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...data,
                    submittedAt: new Date().toISOString(),
                    source: 'website'
                })
            });

            if (response.ok) {
                this.showFormSuccess(form, 'Thank you for your volunteer application! We\'ll be in touch soon.');
                form.reset();
            } else {
                throw new Error('Submission failed');
            }
        } catch (error) {
            console.error('Volunteer submission error:', error);
            this.showFormError(form, 'Sorry, there was an error submitting your application. Please try again.');
        } finally {
            this.setFormLoading(form, false);
        }
    }

    async handleContactSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Validate required fields
        if (!this.validateContactForm(data)) {
            return;
        }

        try {
            this.setFormLoading(form, true);
            
            // Simulate API call (replace with actual endpoint)
            const response = await fetch(`${this.apiBaseUrl}/contacts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...data,
                    submittedAt: new Date().toISOString(),
                    source: 'website'
                })
            });

            if (response.ok) {
                this.showFormSuccess(form, 'Thank you for your message! We\'ll get back to you soon.');
                form.reset();
            } else {
                throw new Error('Submission failed');
            }
        } catch (error) {
            console.error('Contact submission error:', error);
            this.showFormError(form, 'Sorry, there was an error sending your message. Please try again.');
        } finally {
            this.setFormLoading(form, false);
        }
    }

    validateVolunteerForm(data) {
        const required = ['firstName', 'lastName', 'email'];
        const missing = required.filter(field => !data[field]);
        
        if (missing.length > 0) {
            this.showFormError(null, `Please fill in all required fields: ${missing.join(', ')}`);
            return false;
        }
        
        if (!this.isValidEmail(data.email)) {
            this.showFormError(null, 'Please enter a valid email address.');
            return false;
        }
        
        return true;
    }

    validateContactForm(data) {
        const required = ['name', 'email', 'message'];
        const missing = required.filter(field => !data[field]);
        
        if (missing.length > 0) {
            this.showFormError(null, `Please fill in all required fields: ${missing.join(', ')}`);
            return false;
        }
        
        if (!this.isValidEmail(data.email)) {
            this.showFormError(null, 'Please enter a valid email address.');
            return false;
        }
        
        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    setFormLoading(form, isLoading) {
        const submitButton = form.querySelector('button[type="submit"]');
        if (!submitButton) return;

        if (isLoading) {
            form.classList.add('submitting');
            submitButton.disabled = true;
            submitButton.innerHTML = `
                <i class="fas fa-spinner fa-spin"></i>
                Submitting...
            `;
        } else {
            form.classList.remove('submitting');
            submitButton.disabled = false;
            submitButton.innerHTML = submitButton.dataset.originalText || 'Submit';
        }
    }

    showFormSuccess(form, message) {
        this.showNotification(message, 'success');
    }

    showFormError(form, message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    // ===== SOCIAL MEDIA BUTTONS =====
    setupSocialMediaButtons() {
        document.querySelectorAll('.social-share a, .share-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleSocialShare(button);
            });
        });

        // Social media follow buttons
        document.querySelectorAll('a[href="#"].btn').forEach(button => {
            if (button.textContent.includes('Follow') || button.textContent.includes('Connect')) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.handleSocialFollow(button);
                });
            }
        });
    }

    handleSocialShare(button) {
        const platform = this.detectSocialPlatform(button);
        const url = window.location.href;
        const text = 'Join me in supporting Hunger in Kenya - Together we can end hunger!';
        
        let shareUrl = '';
        
        switch (platform) {
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
                break;
        }
        
        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
        
        this.trackEvent('social_share', {
            platform: platform,
            url: url
        });
    }

    handleSocialFollow(button) {
        const platform = this.detectSocialPlatform(button);
        let followUrl = '';
        
        // These would be actual social media profile URLs
        const socialUrls = {
            facebook: 'https://facebook.com/hungerinkenya',
            twitter: 'https://twitter.com/hungerinkenya',
            instagram: 'https://instagram.com/hungerinkenya',
            linkedin: 'https://linkedin.com/company/hungerinkenya'
        };
        
        followUrl = socialUrls[platform] || socialUrls.facebook;
        window.open(followUrl, '_blank');
        
        this.trackEvent('social_follow', {
            platform: platform
        });
    }

    detectSocialPlatform(button) {
        const classes = button.className.toLowerCase();
        const href = button.href || '';
        
        if (classes.includes('whatsapp') || href.includes('whatsapp')) return 'whatsapp';
        if (classes.includes('facebook') || href.includes('facebook')) return 'facebook';
        if (classes.includes('twitter') || href.includes('twitter')) return 'twitter';
        if (classes.includes('instagram') || href.includes('instagram')) return 'instagram';
        if (classes.includes('linkedin') || href.includes('linkedin')) return 'linkedin';
        
        return 'unknown';
    }

    // ===== DOWNLOAD BUTTONS =====
    setupDownloadButtons() {
        document.querySelectorAll('button').forEach(button => {
            const text = button.textContent.toLowerCase();
            
            if (text.includes('get template') || 
                text.includes('download') || 
                text.includes('media kit') ||
                text.includes('event planning')) {
                
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.handleDownload(button);
                });
            }
        });
    }

    handleDownload(button) {
        const buttonText = button.textContent.toLowerCase();
        
        // Generate different content based on button text
        let filename = 'template';
        let content = 'Template content';
        
        if (buttonText.includes('template letter')) {
            filename = 'template-letters.txt';
            content = this.getTemplateLetters();
        } else if (buttonText.includes('media kit')) {
            filename = 'media-kit.txt';
            content = this.getMediaKit();
        } else if (buttonText.includes('event planning')) {
            filename = 'event-planning-guide.txt';
            content = this.getEventPlanningGuide();
        } else if (buttonText.includes('post')) {
            filename = 'social-media-posts.txt';
            content = this.getSocialMediaPosts();
        } else if (buttonText.includes('thread')) {
            filename = 'twitter-threads.txt';
            content = this.getTwitterThreads();
        } else if (buttonText.includes('story')) {
            filename = 'story-templates.txt';
            content = this.getStoryTemplates();
        }
        
        this.downloadFile(filename, content);
        
        this.trackEvent('download_template', {
            template: filename,
            button_text: button.textContent
        });
    }

    getTemplateLetters() {
        return `Template Letters for Hunger in Kenya Support

=== EMAIL TEMPLATE ===
Subject: Join me in fighting hunger in Kenya

Dear [Name],

I wanted to share something important with you. Right now, over 2.1 million Kenyans are facing food insecurity, and children are going to bed hungry.

I've been supporting the Hunger in Kenya initiative, which is making a real difference by:
- Providing emergency food aid to families in crisis
- Training farmers in sustainable agriculture
- Supporting school feeding programs

Would you consider joining me in this mission? Even a small donation can make a big difference.

Learn more: [website link]

Thank you,
[Your name]

=== LETTER TEMPLATE ===
Dear [Representative/Senator Name],

I am writing to urge your support for increased humanitarian aid to address the food crisis in Kenya. With 2.1 million people currently food insecure and 10 counties in critical condition, immediate action is needed.

I respectfully request that you:
1. Support increased funding for humanitarian aid to Kenya
2. Advocate for long-term agricultural development programs
3. Consider Kenya in upcoming foreign aid discussions

Thank you for your attention to this critical issue.

Sincerely,
[Your name and address]`;
    }

    getMediaKit() {
        return `Media Kit - Hunger in Kenya Initiative

=== KEY STATISTICS ===
• 2.1 million people currently food insecure (Dec 2025)
• 32 counties experiencing food insecurity
• 10 counties in critical condition
• Ksh13B government appeal for emergency support
• School feeding programs improve attendance by 85%

=== CONTACT INFORMATION ===
Email: info@hungerinkenya.org
Phone: +254 700 123 456
Website: [website URL]

=== HIGH-LEVEL MESSAGES ===
1. Emergency relief: Providing immediate food aid to crisis-affected families
2. Sustainable solutions: Training farmers in climate-resilient agriculture
3. Community empowerment: Building local capacity for long-term food security

=== QUOTES ===
"The hunger crisis in Kenya requires both immediate humanitarian response and long-term sustainable solutions." - [Spokesperson Name]

=== VISUAL ASSETS ===
High-resolution photos and infographics available upon request.`;
    }

    getEventPlanningGuide() {
        return `Event Planning Guide - Fundraising for Hunger in Kenya

=== PLANNING CHECKLIST ===
□ Set fundraising goal
□ Choose event type and date
□ Secure venue
□ Create promotional materials
□ Recruit volunteers
□ Plan activities and entertainment
□ Set up donation systems
□ Prepare social media content

=== EVENT IDEAS ===
1. Community dinner with Kenyan cuisine
2. Educational seminar about food security
3. Charity run/walk
4. Concert or cultural event
5. Film screening about hunger issues

=== PROMOTIONAL CONTENT ===
Sample social media posts, email templates, and press releases included in media kit.

=== DONATION COLLECTION ===
• Online: [website link]
• Mobile: M-Pesa 0713185939 (Account: HungerKenya)
• Cash/checks: [address]

Contact us for additional support materials.`;
    }

    getSocialMediaPosts() {
        return `Social Media Posts - Hunger in Kenya

=== INSTAGRAM POSTS ===
1. "Did you know? 2.1 million Kenyans need food assistance right now. Together, we can change that. Every share, every donation, every volunteer hour makes a difference. Link in bio to help. #EndHunger #Kenya #Humanity"

2. "Behind every statistic is a family. A mother wondering where her next meal will come from. A child who can't focus in school because they're hungry. This is why we do what we do. #HungerInKenya #FoodSecurity"

3. "From drought-resistant farming to school feeding programs - we're not just addressing hunger today, we're preventing it tomorrow. Learn how your support creates lasting change. #SustainableSolutions #Kenya"

=== TWITTER THREADS ===
Thread 1: Hunger Crisis Overview
🧵 THREAD: The hunger crisis in Kenya isn't just about lack of food - it's about lack of access, climate change, and systemic challenges. Here's what you need to know: 1/6

=== FACEBOOK POSTS ===
"Every child deserves to go to bed with a full stomach. Every family deserves to know where their next meal will come from. 

Right now in Kenya, over 2.1 million people are facing food insecurity. But we can change that together.

Here's how your support makes a difference:
✅ Immediate food aid for families in crisis
✅ Training farmers in drought-resistant techniques  
✅ School feeding programs that improve attendance by 85%
✅ Community empowerment for long-term food security

Join our mission today. Even $10 can provide a meal for a child.

[Donation link]`;
    }

    getTwitterThreads() {
        return `Twitter Threads - Hunger in Kenya

=== THREAD 1: CRISIS OVERVIEW ===
🧵 THREAD: The hunger crisis in Kenya isn't just about lack of food - it's about lack of access, climate change, and systemic challenges. Here's what you need to know: 1/6

2/6 Current situation: 2.1 million people are food insecure across 32 counties. 10 counties are in critical condition. This isn't a future problem - it's happening right now.

3/6 Root causes: 
• Consecutive failed rainy seasons
• Climate change increasing drought frequency
• Rising food prices
• Limited access to markets in remote areas

4/6 Our response: We're not just providing emergency aid - we're building sustainable solutions that address root causes.

5/6 What we're doing:
✅ Emergency food distribution
✅ Training farmers in drought-resistant crops
✅ School feeding programs (85% attendance improvement)
✅ Community-led agriculture projects

6/6 How you can help:
• Donate: [link]
• Volunteer: [link]
• Share this thread
• Contact your representatives

Every action counts. RT to spread awareness. 💪

=== THREAD 2: SUCCESS STORIES ===
🧵 Success stories from Kenya: How communities are defeating hunger through sustainable farming. Thread: 1/5

[Continue with success stories...]`;
    }

    getStoryTemplates() {
        return `Story Templates - Visual Social Media

=== INFOGRAPHIC TEMPLATE ===
Title: "Hunger by the Numbers"
Content:
• 2.1M people need food assistance
• 32 counties affected
• 85% school attendance improvement with feeding programs
• Ksh13B needed for emergency response

=== BEFORE/AFTER TEMPLATE ===
Title: "Transformation in Action"
Content:
BEFORE: "Sarah's farm couldn't grow enough to feed her family"
AFTER: "After drought-resistant training, Sarah's farm now feeds 3 neighboring families too"

=== PHOTO STORY TEMPLATE ===
Title: "A Day in the Life"
Content: Follow our field workers as they distribute food and train farmers in Turkana County. Show the human impact of your donations.

=== QUOTE GRAPHIC TEMPLATE ===
"Volunteering with Hunger in Kenya opened my eyes to global issues and gave me practical skills I use in my career. The experience was life-changing!" - Maria S., Content Creator Volunteer`;
    }

    downloadFile(filename, content) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // ===== GENERIC BUTTONS =====
    setupGenericButtons() {
        // Handle any remaining buttons that might need basic functionality
        document.querySelectorAll('a[href="#"], button:not([type="submit"])').forEach(button => {
            if (!button.hasAttribute('data-handled')) {
                button.addEventListener('click', (e) => {
                    this.handleGenericButton(button, e);
                });
                button.setAttribute('data-handled', 'true');
            }
        });
    }

    handleGenericButton(button, e) {
        const text = button.textContent.toLowerCase();
        
        // Skip if already handled by specific handlers
        if (button.classList.contains('apply-now-btn') || 
            button.closest('.social-share') ||
            button.type === 'submit') {
            return;
        }
        
        // Handle specific cases
        if (text.includes('learn more')) {
            e.preventDefault();
            // Could scroll to more information or open modal
            console.log('Learn more clicked');
        } else if (text.includes('share')) {
            e.preventDefault();
            this.handleSocialShare(button);
        }
    }

    // ===== UTILITY FUNCTIONS =====
    trackEvent(eventName, eventData) {
        // Google Analytics tracking (if implemented)
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, eventData);
        }
        
        // Console log for development
        console.log('Button Event:', eventName, eventData);
    }
}

// Inject notification styles
const notificationStyles = `
    .notification {
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 10000;
        max-width: 400px;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-lg);
        animation: slideInRight 0.3s ease;
    }
    
    .notification-success {
        background: var(--kenya-green);
        color: var(--kenya-white);
    }
    
    .notification-error {
        background: var(--kenya-red);
        color: var(--kenya-white);
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem 1.25rem;
    }
    
    .notification-content i {
        font-size: 1.2rem;
        flex-shrink: 0;
    }
    
    .notification-content button {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        padding: 0.25rem;
        margin-left: auto;
        opacity: 0.8;
        transition: opacity 0.2s;
    }
    
    .notification-content button:hover {
        opacity: 1;
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .form-submitting {
        opacity: 0.8;
        pointer-events: none;
    }
`;

// Inject styles
const notificationStyleSheet = document.createElement('style');
notificationStyleSheet.textContent = notificationStyles;
document.head.appendChild(notificationStyleSheet);

// Initialize button manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.buttonManager = new ButtonManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ButtonManager;
}