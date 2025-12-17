// ===== MAIN JAVASCRIPT FILE =====

// Global variables
const app = {
    currentLang: 'en',
    donationAmount: 0,
    isScrolling: false,
    animations: {
        observerSupported: 'IntersectionObserver' in window
    }
};

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize application
function initializeApp() {
    // Initialize components
    initScrollEffects();
    initAnimations();
    initFormValidation();
    initAccessibility();
    initPerformanceOptimizations();
    
    // Add loaded class to body for CSS animations
    document.body.classList.add('loaded');
    
    console.log('Hunger in Kenya website initialized successfully');
}

// ===== SCROLL EFFECTS =====
function initScrollEffects() {
    const navbar = document.getElementById('navbar');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    // Navbar scroll effect
    window.addEventListener('scroll', throttle(() => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        // Add scrolled class to navbar
        if (scrolled > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Parallax effect for hero background
        const heroBackground = document.querySelector('.hero-background');
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${rate}px)`;
        }
        
        // Hide scroll indicator when scrolling
        if (scrollIndicator) {
            if (scrolled > 100) {
                scrollIndicator.style.opacity = '0';
            } else {
                scrollIndicator.style.opacity = '1';
            }
        }
    }, 10));
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 70; // Account for navbar height
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== ANIMATIONS =====
function initAnimations() {
    if (!app.animations.observerSupported) {
        // Fallback for browsers without IntersectionObserver
        showAllElements();
        return;
    }
    
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.stat-card, .solution-card, .mission-item, .newsletter-content'
    );
    
    animatedElements.forEach(el => {
        el.classList.add('animate-element');
        observer.observe(el);
    });
}

// Fallback function for browsers without IntersectionObserver
function showAllElements() {
    const elements = document.querySelectorAll('.animate-element');
    elements.forEach(el => el.classList.add('animate-in'));
}

// ===== FORM VALIDATION =====
function initFormValidation() {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Validate email inputs
    document.querySelectorAll('input[type="email"]').forEach(input => {
        input.addEventListener('blur', function() {
            validateEmail(this);
        });
        
        input.addEventListener('input', function() {
            clearValidationError(this);
        });
    });
    
    // Phone number validation
    document.querySelectorAll('input[type="tel"]').forEach(input => {
        input.addEventListener('input', function() {
            formatPhoneNumber(this);
        });
    });
    
    // Amount validation for donation forms
    document.querySelectorAll('input[type="number"]').forEach(input => {
        if (input.closest('form').classList.contains('donation-form')) {
            input.addEventListener('input', function() {
                validateDonationAmount(this);
            });
        }
    });
}

// Email validation
function validateEmail(input) {
    const email = input.value.trim();
    const isValid = emailRegex.test(email);
    
    if (!isValid && email.length > 0) {
        showValidationError(input, 'Please enter a valid email address');
        return false;
    }
    
    clearValidationError(input);
    return true;
}

// Phone number formatting
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    
    // Format for Kenyan numbers
    if (value.startsWith('254')) {
        value = '+' + value;
    } else if (value.startsWith('0')) {
        value = '+254' + value.substring(1);
    } else if (value.length === 9) {
        value = '+254' + value;
    }
    
    input.value = value;
}

// Donation amount validation
function validateDonationAmount(input) {
    const amount = parseFloat(input.value);
    
    if (isNaN(amount) || amount < 1) {
        showValidationError(input, 'Please enter a valid amount (minimum $1)');
        return false;
    }
    
    if (amount > 10000) {
        showValidationError(input, 'For amounts over $10,000, please contact us directly');
        return false;
    }
    
    clearValidationError(input);
    return true;
}

// Show validation error
function showValidationError(input, message) {
    clearValidationError(input);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'validation-error';
    errorDiv.textContent = message;
    
    input.parentNode.appendChild(errorDiv);
    input.classList.add('error');
}

// Clear validation error
function clearValidationError(input) {
    const existingError = input.parentNode.querySelector('.validation-error');
    if (existingError) {
        existingError.remove();
    }
    input.classList.remove('error');
}

// ===== ACCESSIBILITY =====
function initAccessibility() {
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link sr-only';
    skipLink.textContent = 'Skip to main content';
    skipLink.addEventListener('focus', function() {
        this.classList.remove('sr-only');
    });
    skipLink.addEventListener('blur', function() {
        this.classList.add('sr-only');
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content landmark
    const main = document.querySelector('main');
    if (main) {
        main.id = 'main-content';
    }
    
    // Keyboard navigation for dropdowns
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        const trigger = dropdown.querySelector('.dropdown-trigger');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (trigger && menu) {
            trigger.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleDropdown(dropdown);
                }
            });
        }
    });
    
    // Focus management for modals
    document.querySelectorAll('[data-modal]').forEach(trigger => {
        trigger.addEventListener('click', function() {
            const modal = document.getElementById(this.dataset.modal);
            if (modal) {
                openModal(modal);
            }
        });
    });
}

// Dropdown toggle
function toggleDropdown(dropdown) {
    const menu = dropdown.querySelector('.dropdown-menu');
    const isOpen = dropdown.classList.contains('active');
    
    // Close all other dropdowns
    document.querySelectorAll('.dropdown.active').forEach(otherDropdown => {
        if (otherDropdown !== dropdown) {
            closeDropdown(otherDropdown);
        }
    });
    
    if (isOpen) {
        closeDropdown(dropdown);
    } else {
        openDropdown(dropdown);
    }
}

function openDropdown(dropdown) {
    dropdown.classList.add('active');
    const menu = dropdown.querySelector('.dropdown-menu');
    if (menu) {
        menu.setAttribute('aria-hidden', 'false');
    }
}

function closeDropdown(dropdown) {
    dropdown.classList.remove('active');
    const menu = dropdown.querySelector('.dropdown-menu');
    if (menu) {
        menu.setAttribute('aria-hidden', 'true');
    }
}

// Modal management
function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus first focusable element
    const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (firstFocusable) {
        firstFocusable.focus();
    }
    
    // Close on escape key
    document.addEventListener('keydown', handleModalKeydown);
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleModalKeydown);
}

function handleModalKeydown(e) {
    if (e.key === 'Escape') {
        const modal = document.querySelector('.modal.active');
        if (modal) {
            closeModal(modal);
        }
    }
}

// ===== PERFORMANCE OPTIMIZATIONS =====
function initPerformanceOptimizations() {
    // Lazy loading for images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Preload critical resources
    const criticalResources = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;600;700&display=swap',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = 'style';
        document.head.appendChild(link);
    });
}

// ===== UTILITY FUNCTIONS =====

// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Debounce function for performance
function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Format currency
function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Format number with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Local storage helpers
function saveToStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (e) {
        console.warn('Could not save to localStorage:', e);
        return false;
    }
}

function getFromStorage(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (e) {
        console.warn('Could not read from localStorage:', e);
        return null;
    }
}

// API helper functions
async function fetchWithTimeout(url, options = {}, timeout = 10000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // You could send this to an error tracking service
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    // You could send this to an error tracking service
});

// ===== CSS ANIMATION CLASSES =====
// Add these to your CSS file
const animationStyles = `
    .animate-element {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }
    
    .animate-element.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .validation-error {
        color: var(--kenya-red);
        font-size: 0.875rem;
        margin-top: 0.25rem;
    }
    
    .error {
        border-color: var(--kenya-red) !important;
        box-shadow: 0 0 0 3px rgba(187, 0, 0, 0.1);
    }
    
    .skip-link {
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--kenya-black);
        color: var(--kenya-white);
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 10000;
        transition: top 0.3s;
    }
    
    .skip-link:focus {
        top: 6px;
    }
    
    .lazy {
        opacity: 0;
        transition: opacity 0.3s;
    }
    
    .lazy.loaded {
        opacity: 1;
    }
`;

// Inject animation styles
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatCurrency,
        formatNumber,
        saveToStorage,
        getFromStorage,
        fetchWithTimeout,
        throttle,
        debounce
    };
}