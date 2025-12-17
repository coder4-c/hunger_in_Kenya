// ===== PAGE-SPECIFIC JAVASCRIPT =====

class PageManager {
    constructor() {
        this.currentPage = this.detectCurrentPage();
        this.init();
    }
    
    init() {
        this.setupPageAnimations();
        this.setupInteractiveElements();
        this.setupAccessibility();
        
        console.log(`Page Manager initialized for: ${this.currentPage}`);
    }
    
    // Detect current page
    detectCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop().split('.')[0];
        return page || 'index';
    }
    
    // Setup page-specific animations
    setupPageAnimations() {
        // Animate impact chart bars
        this.animateImpactChart();
        
        // Animate timeline items
        this.animateTimeline();
        
        // Animate statistics
        this.animateStatistics();
    }
    
    // Animate impact chart bars
    animateImpactChart() {
        const chartBars = document.querySelectorAll('.bar-fill');
        
        if (chartBars.length === 0) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const width = bar.style.width;
                    bar.style.width = '0%';
                    
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 200);
                    
                    observer.unobserve(bar);
                }
            });
        }, { threshold: 0.5 });
        
        chartBars.forEach(bar => observer.observe(bar));
    }
    
    // Animate timeline items
    animateTimeline() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        if (timelineItems.length === 0) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateX(0)';
                    }, index * 200);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        timelineItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-30px)';
            item.style.transition = 'all 0.6s ease';
            observer.observe(item);
        });
    }
    
    // Animate statistics counters
    animateStatistics() {
        const statNumbers = document.querySelectorAll('.stat-number, .stat-value');
        
        if (statNumbers.length === 0) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateNumber(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statNumbers.forEach(stat => observer.observe(stat));
    }
    
    // Animate individual number
    animateNumber(element) {
        const text = element.textContent;
        const number = parseInt(text.replace(/[^\d]/g, ''));
        
        if (isNaN(number)) return;
        
        const duration = 2000;
        const steps = 60;
        const increment = number / steps;
        const stepDuration = duration / steps;
        
        let current = 0;
        let step = 0;
        
        const timer = setInterval(() => {
            step++;
            current = Math.min(increment * step, number);
            
            // Format number back to original format
            let displayValue = Math.floor(current).toString();
            
            if (text.includes('M')) {
                displayValue = Math.floor(current / 1000000) + 'M';
            } else if (text.includes('%')) {
                displayValue = Math.floor(current) + '%';
            } else if (text.includes('$')) {
                displayValue = '$' + Math.floor(current).toLocaleString();
            }
            
            element.textContent = displayValue;
            
            if (step >= steps) {
                clearInterval(timer);
                element.textContent = text; // Restore original text
            }
        }, stepDuration);
    }
    
    // Setup interactive elements
    setupInteractiveElements() {
        this.setupRegionCards();
        this.setupCauseCards();
        this.setupImpactGroups();
        this.setupChartInteractions();
    }
    
    // Setup region cards interaction
    setupRegionCards() {
        const regionCards = document.querySelectorAll('.region-card');
        
        regionCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
    
    // Setup cause cards interaction
    setupCauseCards() {
        const causeCards = document.querySelectorAll('.cause-card');
        
        causeCards.forEach(card => {
            card.addEventListener('click', () => {
                this.toggleCardExpansion(card);
            });
            
            // Add expand icon
            const expandIcon = document.createElement('div');
            expandIcon.className = 'expand-icon';
            expandIcon.innerHTML = '<i class="fas fa-chevron-down"></i>';
            expandIcon.style.cssText = `
                position: absolute;
                top: 1rem;
                right: 1rem;
                color: var(--kenya-green);
                cursor: pointer;
                transition: transform 0.3s ease;
            `;
            
            card.style.position = 'relative';
            card.appendChild(expandIcon);
        });
    }
    
    // Toggle card expansion
    toggleCardExpansion(card) {
        const isExpanded = card.classList.contains('expanded');
        const expandIcon = card.querySelector('.expand-icon i');
        
        if (isExpanded) {
            card.classList.remove('expanded');
            card.style.height = '';
            expandIcon.style.transform = 'rotate(0deg)';
        } else {
            card.classList.add('expanded');
            const fullHeight = card.scrollHeight;
            card.style.height = fullHeight + 'px';
            expandIcon.style.transform = 'rotate(180deg)';
        }
    }
    
    // Setup impact groups interaction
    setupImpactGroups() {
        const impactGroups = document.querySelectorAll('.impact-group');
        
        impactGroups.forEach(group => {
            group.addEventListener('mouseenter', () => {
                const icon = group.querySelector('.group-icon');
                icon.style.transform = 'scale(1.1) rotate(5deg)';
            });
            
            group.addEventListener('mouseleave', () => {
                const icon = group.querySelector('.group-icon');
                icon.style.transform = 'scale(1) rotate(0deg)';
            });
        });
    }
    
    // Setup chart interactions
    setupChartInteractions() {
        const chartBars = document.querySelectorAll('.bar-item');
        
        chartBars.forEach(bar => {
            bar.addEventListener('click', () => {
                this.showRegionDetails(bar);
            });
            
            bar.style.cursor = 'pointer';
        });
    }
    
    // Show region details
    showRegionDetails(bar) {
        const regionName = bar.querySelector('.region').textContent;
        const percentage = bar.querySelector('.percentage').textContent;
        
        // Create modal or tooltip with additional information
        const modal = this.createRegionModal(regionName, percentage);
        document.body.appendChild(modal);
        
        setTimeout(() => modal.classList.add('show'), 100);
    }
    
    // Create region details modal
    createRegionModal(region, percentage) {
        const modal = document.createElement('div');
        modal.className = 'region-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${region} Region</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p><strong>Food Insecurity Rate:</strong> ${percentage}</p>
                    <p>Additional information about this region's specific challenges and ongoing initiatives.</p>
                </div>
            </div>
        `;
        
        // Add modal styles
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        const content = modal.querySelector('.modal-content');
        content.style.cssText = `
            background: var(--kenya-white);
            padding: 2rem;
            border-radius: var(--border-radius);
            max-width: 500px;
            width: 90%;
            transform: translateY(-20px);
            transition: transform 0.3s ease;
        `;
        
        modal.classList.add('show');
        
        // Close modal functionality
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
                setTimeout(() => modal.remove(), 300);
            }
        });
        
        return modal;
    }
    
    // Setup accessibility features
    setupAccessibility() {
        this.setupKeyboardNavigation();
        this.setupScreenReaderSupport();
        this.setupFocusManagement();
    }
    
    // Setup keyboard navigation
    setupKeyboardNavigation() {
        // Tab navigation for interactive elements
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
        
        // Escape key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modal = document.querySelector('.region-modal.show');
                if (modal) {
                    modal.classList.remove('show');
                    setTimeout(() => modal.remove(), 300);
                }
            }
        });
    }
    
    // Setup screen reader support
    setupScreenReaderSupport() {
        // Add ARIA labels to interactive elements
        const chartBars = document.querySelectorAll('.bar-item');
        chartBars.forEach(bar => {
            const region = bar.querySelector('.region').textContent;
            const percentage = bar.querySelector('.percentage').textContent;
            bar.setAttribute('aria-label', `${region}: ${percentage} food insecurity rate`);
        });
        
        // Add ARIA labels to cards
        const causeCards = document.querySelectorAll('.cause-card');
        causeCards.forEach(card => {
            const title = card.querySelector('h3').textContent;
            card.setAttribute('aria-label', `${title} - Click for more details`);
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            
            // Add keyboard support
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleCardExpansion(card);
                }
            });
        });
    }
    
    // Setup focus management
    setupFocusManagement() {
        // Ensure focus is visible for keyboard users
        const style = document.createElement('style');
        style.textContent = `
            .keyboard-navigation *:focus {
                outline: 2px solid var(--kenya-red) !important;
                outline-offset: 2px !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Page-specific functionality
    initAboutCrisisPage() {
        if (this.currentPage !== 'about-crisis') return;
        
        // Additional setup for About Crisis page
        this.setupCrisisDataVisualization();
        this.setupTimelineInteractivity();
    }
    
    // Setup crisis data visualization
    setupCrisisDataVisualization() {
        // Add tooltips to statistics
        const statHighlights = document.querySelectorAll('.stat-highlight');
        statHighlights.forEach(stat => {
            stat.setAttribute('data-tooltip', 'Based on latest government and UN reports');
        });
    }
    
    // Setup timeline interactivity
    setupTimelineInteractivity() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach(item => {
            item.addEventListener('click', () => {
                this.toggleTimelineDetails(item);
            });
        });
    }
    
    // Toggle timeline details
    toggleTimelineDetails(item) {
        const isExpanded = item.classList.contains('expanded');
        
        if (isExpanded) {
            item.classList.remove('expanded');
            this.removeTimelineDetails(item);
        } else {
            item.classList.add('expanded');
            this.addTimelineDetails(item);
        }
    }
    
    // Add timeline details
    addTimelineDetails(item) {
        if (item.querySelector('.timeline-details')) return;
        
        const details = document.createElement('div');
        details.className = 'timeline-details';
        details.innerHTML = `
            <p>Additional context and information about this period in Kenya's food security crisis.</p>
            <ul>
                <li>Government response initiatives</li>
                <li>International aid efforts</li>
                <li>Community resilience measures</li>
            </ul>
        `;
        
        const content = item.querySelector('.timeline-content');
        content.appendChild(details);
    }
    
    // Remove timeline details
    removeTimelineDetails(item) {
        const details = item.querySelector('.timeline-details');
        if (details) {
            details.remove();
        }
    }
    
    // Utility methods
    getCurrentPage() {
        return this.currentPage;
    }
    
    refresh() {
        this.setupPageAnimations();
        this.setupInteractiveElements();
    }
}

// Page-specific CSS styles
const pageStyles = `
    .expand-icon {
        transition: transform 0.3s ease;
    }
    
    .cause-card.expanded {
        height: auto !important;
    }
    
    .timeline-details {
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid var(--gray-200);
        animation: slideDown 0.3s ease;
    }
    
    .timeline-details ul {
        margin-top: 0.5rem;
        padding-left: 1.5rem;
    }
    
    .timeline-details li {
        margin-bottom: 0.25rem;
        color: var(--gray-600);
    }
    
    .region-modal.show {
        opacity: 1;
    }
    
    .region-modal .modal-content {
        transform: translateY(0);
    }
    
    .keyboard-navigation *:focus {
        outline: 2px solid var(--kenya-red) !important;
        outline-offset: 2px !important;
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    /* Hover effects */
    .bar-item:hover {
        background: rgba(187, 0, 0, 0.05);
        border-radius: var(--border-radius-sm);
        padding: 0.5rem;
        margin: -0.5rem;
        transition: background 0.2s ease;
    }
    
    .cause-card {
        cursor: pointer;
    }
    
    .cause-card:hover .expand-icon {
        color: var(--kenya-red);
    }
    
    /* Loading states */
    .loading-shimmer {
        background: linear-gradient(90deg, var(--gray-200) 25%, var(--gray-100) 50%, var(--gray-200) 75%);
        background-size: 200% 100%;
        animation: shimmer 2s infinite;
    }
    
    @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
    }
`;

// Inject page styles
const pageStyleSheet = document.createElement('style');
pageStyleSheet.textContent = pageStyles;
document.head.appendChild(pageStyleSheet);

// Initialize page manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.pageManager = new PageManager();
    
    // Initialize page-specific functionality
    window.pageManager.initAboutCrisisPage();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PageManager;
}