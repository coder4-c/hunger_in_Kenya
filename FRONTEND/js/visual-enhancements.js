// ===== VISUAL ENHANCEMENTS =====

class VisualEnhancements {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupLoadingStates();
        this.setupInteractiveElements();
        this.addFloatingElements();
    }

    // Animate elements on scroll
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.stat-card, .solution-card, .impact-example, .way-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease-out';
            observer.observe(el);
        });

        // Add CSS for animation
        const style = document.createElement('style');
        style.textContent = `
            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Enhanced hover effects
    setupHoverEffects() {
        // Card tilt effect
        document.querySelectorAll('.stat-card, .solution-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            });
        });

        // Button ripple effect
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.6);
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    pointer-events: none;
                `;
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });

        // Add ripple animation CSS
        const rippleStyle = document.createElement('style');
        rippleStyle.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            .btn {
                position: relative;
                overflow: hidden;
            }
        `;
        document.head.appendChild(rippleStyle);
    }

    // Loading states
    setupLoadingStates() {
        // Add loading overlay
        const loadingHTML = `
            <div class="loading-overlay" id="page-loading">
                <div class="loading-content">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>Loading...</p>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', loadingHTML);

        // Remove loading when page is fully loaded
        window.addEventListener('load', () => {
            setTimeout(() => {
                const loading = document.getElementById('page-loading');
                if (loading) {
                    loading.style.opacity = '0';
                    setTimeout(() => loading.remove(), 300);
                }
            }, 500);
        });
    }

    // Interactive elements
    setupInteractiveElements() {
        // Animated counters
        this.animateCounters();
        
        // Floating action button for donations
        this.createFloatingDonationButton();
        
        // Progress bars
        this.createProgressBars();
        
        // Interactive tooltips
        this.createTooltips();
    }

    // Animate number counters
    animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
            if (target) {
                const increment = target / 50;
                let current = 0;
                
                const updateCounter = () => {
                    if (current < target) {
                        current += increment;
                        const displayValue = Math.floor(current);
                        const suffix = counter.textContent.replace(/[\d]/g, '');
                        counter.textContent = displayValue + suffix;
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = counter.textContent; // Reset to original
                    }
                };
                
                // Start animation when element is visible
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            updateCounter();
                            observer.unobserve(entry.target);
                        }
                    });
                });
                
                observer.observe(counter);
            }
        });
    }

    // Create floating donation button
    createFloatingDonationButton() {
        const fab = document.createElement('div');
        fab.className = 'floating-donate-btn';
        fab.innerHTML = `
            <i class="fas fa-heart"></i>
            <span>Donate</span>
        `;
        
        fab.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: linear-gradient(135deg, var(--kenya-green), var(--kenya-green-light));
            color: white;
            padding: 15px 20px;
            border-radius: 50px;
            box-shadow: 0 8px 25px rgba(0, 102, 0, 0.3);
            cursor: pointer;
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 600;
            transition: all 0.3s ease;
            animation: pulse 2s infinite;
        `;
        
        fab.addEventListener('click', () => {
            window.location.href = 'pages/donation.html';
        });
        
        fab.addEventListener('mouseenter', () => {
            fab.style.transform = 'scale(1.1)';
            fab.style.boxShadow = '0 12px 35px rgba(0, 102, 0, 0.4)';
        });
        
        fab.addEventListener('mouseleave', () => {
            fab.style.transform = 'scale(1)';
            fab.style.boxShadow = '0 8px 25px rgba(0, 102, 0, 0.3)';
        });
        
        document.body.appendChild(fab);
    }

    // Create progress bars
    createProgressBars() {
        const progressBars = document.querySelectorAll('.progress-bar');
        
        progressBars.forEach(bar => {
            const fill = bar.querySelector('.progress-fill');
            if (fill) {
                const targetWidth = fill.style.width || '0%';
                fill.style.width = '0%';
                
                setTimeout(() => {
                    fill.style.width = targetWidth;
                }, 500);
            }
        });
    }

    // Create interactive tooltips
    createTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                const tooltip = document.createElement('div');
                tooltip.className = 'custom-tooltip';
                tooltip.textContent = element.getAttribute('data-tooltip');
                
                tooltip.style.cssText = `
                    position: absolute;
                    background: var(--kenya-black);
                    color: white;
                    padding: 8px 12px;
                    border-radius: 6px;
                    font-size: 14px;
                    white-space: nowrap;
                    z-index: 1001;
                    pointer-events: none;
                    opacity: 0;
                    transform: translateY(10px);
                    transition: all 0.3s ease;
                `;
                
                document.body.appendChild(tooltip);
                
                const rect = element.getBoundingClientRect();
                tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
                tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
                
                setTimeout(() => {
                    tooltip.style.opacity = '1';
                    tooltip.style.transform = 'translateY(0)';
                }, 10);
                
                element._tooltip = tooltip;
            });
            
            element.addEventListener('mouseleave', () => {
                if (element._tooltip) {
                    element._tooltip.style.opacity = '0';
                    element._tooltip.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        element._tooltip.remove();
                        element._tooltip = null;
                    }, 300);
                }
            });
        });
    }

    // Add floating background elements
    addFloatingElements() {
        const floatingElements = document.createElement('div');
        floatingElements.className = 'floating-elements';
        floatingElements.innerHTML = `
            <div class="floating-circle" style="top: 10%; left: 10%;"></div>
            <div class="floating-circle" style="top: 20%; right: 15%;"></div>
            <div class="floating-circle" style="bottom: 30%; left: 5%;"></div>
            <div class="floating-circle" style="bottom: 20%; right: 10%;"></div>
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            .floating-elements {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: -1;
            }
            .floating-circle {
                position: absolute;
                width: 100px;
                height: 100px;
                background: linear-gradient(135deg, rgba(187, 0, 0, 0.1), rgba(0, 102, 0, 0.1));
                border-radius: 50%;
                animation: float 6s ease-in-out infinite;
            }
            .floating-circle:nth-child(2) {
                animation-delay: 2s;
            }
            .floating-circle:nth-child(3) {
                animation-delay: 4s;
            }
            .floating-circle:nth-child(4) {
                animation-delay: 1s;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(floatingElements);
    }

    // Add scroll progress indicator
    addScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, var(--kenya-red), var(--kenya-green));
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', () => {
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            progressBar.style.width = scrollPercent + '%';
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize on main pages, not on donation page to avoid conflicts
    if (!window.location.pathname.includes('donation.html')) {
        new VisualEnhancements();
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VisualEnhancements;
}