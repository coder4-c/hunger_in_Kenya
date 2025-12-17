// ===== NAVIGATION JAVASCRIPT =====

class Navigation {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.isMenuOpen = false;
        this.lastScrollY = window.pageYOffset;
        this.scrollThreshold = 100;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupActiveLink();
        this.setupSmoothScrolling();
        this.setupKeyboardNavigation();
        this.handleMobileMenu();
        
        console.log('Navigation initialized');
    }
    
    // Setup event listeners
    setupEventListeners() {
        // Mobile menu toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navbar.contains(e.target) && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        });
        
        // Handle scroll for navbar behavior
        window.addEventListener('scroll', throttle(() => {
            this.handleScroll();
        }, 10));
        
        // Handle window resize
        window.addEventListener('resize', debounce(() => {
            this.handleResize();
        }, 250));
        
        // Handle link clicks
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                this.handleLinkClick(e);
            });
        });
    }
    
    // Toggle mobile menu
    toggleMobileMenu() {
        if (this.isMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }
    
    // Open mobile menu
    openMobileMenu() {
        this.isMenuOpen = true;
        this.navMenu.classList.add('active');
        this.navToggle.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus first menu item for accessibility
        const firstLink = this.navMenu.querySelector('.nav-link');
        if (firstLink) {
            setTimeout(() => firstLink.focus(), 100);
        }
        
        // Add event listener to close menu when clicking on links
        this.navMenu.addEventListener('click', this.handleMenuClick.bind(this));
    }
    
    // Close mobile menu
    closeMobileMenu() {
        this.isMenuOpen = false;
        this.navMenu.classList.remove('active');
        this.navToggle.classList.remove('active');
        document.body.style.overflow = '';
        
        // Remove menu click listener
        this.navMenu.removeEventListener('click', this.handleMenuClick.bind(this));
    }
    
    // Handle menu link clicks
    handleMenuClick(e) {
        if (e.target.classList.contains('nav-link')) {
            this.closeMobileMenu();
        }
    }
    
    // Handle scroll behavior
    handleScroll() {
        const currentScrollY = window.pageYOffset;
        
        // Show/hide navbar based on scroll direction
        if (currentScrollY > this.lastScrollY && currentScrollY > this.scrollThreshold) {
            // Scrolling down
            this.navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            this.navbar.style.transform = 'translateY(0)';
        }
        
        // Update navbar styling based on scroll position
        if (currentScrollY > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
        
        this.lastScrollY = currentScrollY;
    }
    
    // Handle window resize
    handleResize() {
        // Close mobile menu if switching to desktop
        if (window.innerWidth > 991 && this.isMenuOpen) {
            this.closeMobileMenu();
        }
        
        // Update active link based on current section
        this.updateActiveLink();
    }
    
    // Setup active link highlighting
    setupActiveLink() {
        this.updateActiveLink();
        
        // Recheck on scroll and after animations
        window.addEventListener('scroll', debounce(() => {
            this.updateActiveLink();
        }, 100));
        
        // Recheck after page load
        window.addEventListener('load', () => {
            this.updateActiveLink();
        });
    }
    
    // Update active navigation link
    updateActiveLink() {
        const currentSection = this.getCurrentSection();
        
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            
            if (link.getAttribute('href') === currentSection) {
                link.classList.add('active');
            }
        });
    }
    
    // Get current visible section
    getCurrentSection() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.pageYOffset + 100; // Offset for navbar
        
        for (let i = sections.length - 1; i >= 0; i--) {
            const section = sections[i];
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                return `#${section.id}`;
            }
        }
        
        return '#home';
    }
    
    // Setup smooth scrolling for anchor links
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    
                    const offsetTop = target.offsetTop - 70; // Account for navbar height
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Update URL without triggering scroll
                    history.pushState(null, null, this.getAttribute('href'));
                }
            });
        });
    }
    
    // Handle navigation link clicks
    handleLinkClick(e) {
        const link = e.target.closest('.nav-link');
        if (!link) return;
        
        const href = link.getAttribute('href');
        
        // Handle external links
        if (href.startsWith('http')) {
            return; // Let browser handle external links
        }
        
        // Handle internal links
        if (href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update active link
                this.navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // Close mobile menu if open
                if (this.isMenuOpen) {
                    this.closeMobileMenu();
                }
                
                // Update URL
                history.pushState(null, null, href);
            }
        } else {
            // Handle page navigation
            if (link.classList.contains('donate-btn')) {
                // Special handling for donation button
                this.handleDonationClick(e);
            } else {
                // Regular page navigation
                this.handlePageNavigation(e, link);
            }
        }
    }
    
    // Handle donation button click
    handleDonationClick(e) {
        e.preventDefault();
        
        // Track donation button click
        this.trackEvent('donation_button_click', {
            location: 'navigation',
            timestamp: Date.now()
        });
        
        // Redirect to donation page
        if (href = link.getAttribute('href')) {
            window.location.href = href;
        }
    }
    
    // Handle page navigation
    handlePageNavigation(e, link) {
        e.preventDefault();
        
        const href = link.getAttribute('href');
        if (href && !href.startsWith('#')) {
            // Add loading state
            link.classList.add('loading');
            
            // Navigate to page
            window.location.href = href;
        }
    }
    
    // Setup keyboard navigation
    setupKeyboardNavigation() {
        // Tab navigation through menu items
        this.navMenu.addEventListener('keydown', (e) => {
            if (!this.isMenuOpen) return;
            
            const focusableElements = this.navMenu.querySelectorAll('.nav-link');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            switch (e.key) {
                case 'Tab':
                    if (e.shiftKey) {
                        // Shift + Tab (backwards)
                        if (document.activeElement === firstElement) {
                            e.preventDefault();
                            lastElement.focus();
                        }
                    } else {
                        // Tab (forwards)
                        if (document.activeElement === lastElement) {
                            e.preventDefault();
                            firstElement.focus();
                        }
                    }
                    break;
                    
                case 'Escape':
                    e.preventDefault();
                    this.closeMobileMenu();
                    this.navToggle.focus(); // Return focus to toggle button
                    break;
            }
        });
        
        // Arrow key navigation for dropdowns
        document.querySelectorAll('.dropdown').forEach(dropdown => {
            const trigger = dropdown.querySelector('.dropdown-trigger');
            const menu = dropdown.querySelector('.dropdown-menu');
            
            if (trigger && menu) {
                trigger.addEventListener('keydown', (e) => {
                    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.openDropdown(dropdown);
                    }
                });
            }
        });
    }
    
    // Handle mobile menu interactions
    handleMobileMenu() {
        // Prevent body scroll when menu is open
        if (this.isMenuOpen) {
            document.body.style.overflow = 'hidden';
        }
        
        // Handle swipe gestures for mobile
        let startY = 0;
        let endY = 0;
        
        this.navMenu.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
        });
        
        this.navMenu.addEventListener('touchend', (e) => {
            endY = e.changedTouches[0].clientY;
            const diff = startY - endY;
            
            // Swipe up to close menu
            if (diff > 50 && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        });
    }
    
    // Open dropdown menu
    openDropdown(dropdown) {
        dropdown.classList.add('active');
        const menu = dropdown.querySelector('.dropdown-menu');
        if (menu) {
            menu.setAttribute('aria-hidden', 'false');
            
            // Focus first item
            const firstItem = menu.querySelector('.dropdown-item');
            if (firstItem) {
                firstItem.focus();
            }
        }
    }
    
    // Close dropdown menu
    closeDropdown(dropdown) {
        dropdown.classList.remove('active');
        const menu = dropdown.querySelector('.dropdown-menu');
        if (menu) {
            menu.setAttribute('aria-hidden', 'true');
        }
    }
    
    // Track navigation events (for analytics)
    trackEvent(eventName, eventData) {
        // Google Analytics tracking (if implemented)
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, eventData);
        }
        
        // Console log for development
        console.log('Navigation Event:', eventName, eventData);
    }
    
    // Get navigation state
    getState() {
        return {
            isMenuOpen: this.isMenuOpen,
            currentSection: this.getCurrentSection(),
            scrollY: window.pageYOffset
        };
    }
    
    // Reset navigation state
    reset() {
        this.closeMobileMenu();
        this.navLinks.forEach(link => link.classList.remove('active', 'loading'));
        this.navbar.style.transform = 'translateY(0)';
        this.navbar.classList.remove('scrolled');
    }
}

// Add navigation-specific CSS styles
const navigationStyles = `
    .navbar {
        transition: transform 0.3s ease-in-out;
    }
    
    .nav-link.loading {
        opacity: 0.6;
        pointer-events: none;
    }
    
    .nav-link.active {
        color: var(--kenya-red);
        position: relative;
    }
    
    .nav-link.active::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 50%;
        transform: translateX(-50%);
        width: 20px;
        height: 2px;
        background: var(--kenya-red);
        border-radius: 1px;
    }
    
    .dropdown-menu {
        position: absolute;
        top: 100%;
        left: 0;
        background: var(--kenya-white);
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-lg);
        min-width: 200px;
        opacity: 0;
        visibility: hidden;
        transform: translateY(-10px);
        transition: all 0.3s ease;
        z-index: 1000;
    }
    
    .dropdown.active .dropdown-menu {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
    }
    
    .dropdown-item {
        padding: 0.75rem 1rem;
        color: var(--gray-700);
        transition: all 0.2s ease;
        border-bottom: 1px solid var(--gray-100);
    }
    
    .dropdown-item:last-child {
        border-bottom: none;
    }
    
    .dropdown-item:hover,
    .dropdown-item:focus {
        background: var(--kenya-red);
        color: var(--kenya-white);
    }
    
    /* Update notification styles */
    .update-notification {
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--kenya-green);
        color: var(--kenya-white);
        padding: 1rem 1.5rem;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-lg);
        transform: translateX(400px);
        transition: transform 0.3s ease;
        z-index: 10000;
        max-width: 300px;
    }
    
    .update-notification.show {
        transform: translateX(0);
    }
    
    .update-notification i {
        margin-right: 0.5rem;
        color: var(--kenya-white);
    }
    
    /* Donation celebration styles */
    .donation-celebration {
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
        max-width: 400px;
        width: 90%;
    }
    
    .donation-celebration.show {
        transform: translate(-50%, -50%) scale(1);
    }
    
    .celebration-content i {
        font-size: 3rem;
        color: var(--kenya-red);
        margin-bottom: 1rem;
        animation: heartbeat 1s ease-in-out infinite;
    }
    
    @keyframes heartbeat {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
    
    /* Mobile menu animation improvements */
    @media (max-width: 991px) {
        .nav-menu {
            transform: translateX(-100%);
            transition: transform 0.3s ease-in-out;
        }
        
        .nav-menu.active {
            transform: translateX(0);
        }
    }
`;

// Inject navigation styles
const navigationStyleSheet = document.createElement('style');
navigationStyleSheet.textContent = navigationStyles;
document.head.appendChild(navigationStyleSheet);

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.navigation = new Navigation();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Navigation;
}