// ===== DONATION TRACKER JAVASCRIPT =====

class DonationTracker {
    constructor() {
        this.currentStats = {
            peopleFed: 24567,
            donationAmount: 47832,
            activePrograms: 12
        };
        
        this.goalStats = {
            monthlyGoal: 100000,
            peopleGoal: 50000,
            programsGoal: 15
        };
        
        this.updateInterval = 30000; // 30 seconds
        this.animationDuration = 2000; // 2 seconds
        
        this.init();
    }
    
    init() {
        this.loadSavedStats();
        this.updateDisplay();
        this.startRealTimeUpdates();
        this.setupEventListeners();
        this.animateNumbers();
    }
    
    // Load saved stats from localStorage
    loadSavedStats() {
        const saved = getFromStorage('donationTrackerStats');
        if (saved && saved.lastUpdate) {
            const timeDiff = Date.now() - saved.lastUpdate;
            const hoursPassed = timeDiff / (1000 * 60 * 60);
            
            // If less than 24 hours have passed, use saved stats
            if (hoursPassed < 24) {
                this.currentStats = saved.stats;
                return;
            }
        }
        
        // Otherwise, generate realistic stats based on time
        this.generateRealisticStats();
    }
    
    // Generate realistic stats for demonstration
    generateRealisticStats() {
        const now = new Date();
        const hour = now.getHours();
        
        // People fed increases throughout the day
        const basePeopleFed = 20000;
        const hourlyIncrease = Math.floor(hour * 50);
        this.currentStats.peopleFed = basePeopleFed + hourlyIncrease;
        
        // Donation amount varies daily
        const dailyDonations = [25000, 35000, 42000, 38000, 45000, 52000, 48000];
        const dayOfWeek = now.getDay();
        this.currentStats.donationAmount = dailyDonations[dayOfWeek];
        
        // Active programs remain relatively stable
        this.currentStats.activePrograms = Math.floor(Math.random() * 5) + 10;
    }
    
    // Update the display with current stats
    updateDisplay() {
        this.updatePeopleFed();
        this.updateDonationAmount();
        this.updateActivePrograms();
        this.updateProgressBars();
        
        // Save current stats
        this.saveStats();
    }
    
    // Update people fed counter
    updatePeopleFed() {
        const element = document.getElementById('people-fed');
        if (element) {
            this.animateNumber(element, this.currentStats.peopleFed, 'people');
        }
    }
    
    // Update donation amount counter
    updateDonationAmount() {
        const element = document.getElementById('donation-amount');
        if (element) {
            this.animateNumber(element, this.currentStats.donationAmount, 'currency');
        }
    }
    
    // Update active programs counter
    updateActivePrograms() {
        const element = document.getElementById('active-programs');
        if (element) {
            this.animateNumber(element, this.currentStats.activePrograms, 'number');
        }
    }
    
    // Generic number animation function
    animateNumber(element, targetValue, type) {
        const startValue = this.getCurrentValue(element);
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / this.animationDuration, 1);
            
            // Easing function for smooth animation
            const easedProgress = this.easeOutCubic(progress);
            
            const currentValue = Math.floor(startValue + (targetValue - startValue) * easedProgress);
            
            // Format and display the value
            let displayValue;
            switch (type) {
                case 'currency':
                    displayValue = formatCurrency(currentValue);
                    break;
                case 'people':
                    displayValue = formatNumber(currentValue);
                    break;
                default:
                    displayValue = currentValue.toString();
            }
            
            element.textContent = displayValue;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }
    
    // Get current value from element
    getCurrentValue(element) {
        const text = element.textContent.replace(/[$,]/g, '');
        return parseInt(text) || 0;
    }
    
    // Easing function for smooth animations
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
    
    // Update progress bars if they exist
    updateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-bar');
        progressBars.forEach(bar => {
            const goal = bar.dataset.goal ? parseInt(bar.dataset.goal) : this.goalStats.monthlyGoal;
            const current = bar.dataset.current ? parseInt(bar.dataset.current) : this.currentStats.donationAmount;
            
            const percentage = Math.min((current / goal) * 100, 100);
            bar.style.width = `${percentage}%`;
            
            // Update text if present
            const text = bar.parentNode.querySelector('.progress-text');
            if (text) {
                text.textContent = `${Math.round(percentage)}% of goal reached`;
            }
        });
    }
    
    // Start real-time updates
    startRealTimeUpdates() {
        setInterval(() => {
            this.simulateRealTimeUpdate();
        }, this.updateInterval);
    }
    
    // Simulate real-time updates
    simulateRealTimeUpdate() {
        // Randomly increase people fed (10-50 people every 30 seconds)
        const peopleIncrease = Math.floor(Math.random() * 40) + 10;
        this.currentStats.peopleFed += peopleIncrease;
        
        // Occasionally increase donation amount
        if (Math.random() < 0.3) { // 30% chance
            const donationIncrease = Math.floor(Math.random() * 1000) + 100;
            this.currentStats.donationAmount += donationIncrease;
        }
        
        // Occasionally add/remove active programs
        if (Math.random() < 0.1) { // 10% chance
            const change = Math.random() < 0.5 ? -1 : 1;
            this.currentStats.activePrograms = Math.max(8, 
                Math.min(20, this.currentStats.activePrograms + change));
        }
        
        this.updateDisplay();
        this.showUpdateNotification();
    }
    
    // Show update notification
    showUpdateNotification() {
        // Create subtle notification
        const notification = document.createElement('div');
        notification.className = 'update-notification';
        notification.innerHTML = `
            <i class="fas fa-heart"></i>
            <span>New impact: +${Math.floor(Math.random() * 30) + 10} people fed!</span>
        `;
        
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // Setup event listeners
    setupEventListeners() {
        // Manual refresh button
        const refreshBtn = document.querySelector('.refresh-tracker');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.manualRefresh();
            });
        }
        
        // Goal setting
        const goalInputs = document.querySelectorAll('.goal-input');
        goalInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                this.updateGoal(e.target.dataset.goalType, parseInt(e.target.value));
            });
        });
        
        // Donation goal updates
        document.addEventListener('donationMade', (e) => {
            this.handleDonationUpdate(e.detail);
        });
    }
    
    // Manual refresh
    manualRefresh() {
        this.generateRealisticStats();
        this.updateDisplay();
        
        // Show loading state
        const refreshBtn = document.querySelector('.refresh-tracker');
        if (refreshBtn) {
            refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';
            setTimeout(() => {
                refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh';
            }, 1000);
        }
    }
    
    // Handle donation updates
    handleDonationUpdate(donationData) {
        this.currentStats.donationAmount += donationData.amount;
        this.currentStats.peopleFed += Math.floor(donationData.amount / 2); // Rough estimate
        this.updateDisplay();
        
        // Show celebration animation
        this.showDonationAnimation(donationData);
    }
    
    // Show donation celebration
    showDonationAnimation(donationData) {
        const celebration = document.createElement('div');
        celebration.className = 'donation-celebration';
        celebration.innerHTML = `
            <div class="celebration-content">
                <i class="fas fa-heart"></i>
                <h3>Thank you for your donation!</h3>
                <p>Your ${formatCurrency(donationData.amount)} will help feed approximately ${Math.floor(donationData.amount / 2)} people</p>
            </div>
        `;
        
        document.body.appendChild(celebration);
        
        setTimeout(() => celebration.classList.add('show'), 100);
        setTimeout(() => {
            celebration.classList.remove('show');
            setTimeout(() => celebration.remove(), 500);
        }, 4000);
    }
    
    // Update goal values
    updateGoal(goalType, value) {
        if (this.goalStats.hasOwnProperty(goalType + 'Goal')) {
            this.goalStats[goalType + 'Goal'] = value;
            this.updateProgressBars();
            this.saveStats();
        }
    }
    
    // Save current stats to localStorage
    saveStats() {
        saveToStorage('donationTrackerStats', {
            stats: this.currentStats,
            goals: this.goalStats,
            lastUpdate: Date.now()
        });
    }
    
    // Animate numbers on initial load
    animateNumbers() {
        // Start with lower numbers and animate up
        const originalStats = { ...this.currentStats };
        
        this.currentStats.peopleFed = Math.floor(originalStats.peopleFed * 0.7);
        this.currentStats.donationAmount = Math.floor(originalStats.donationAmount * 0.6);
        
        this.updateDisplay();
        
        // Animate to real values after a short delay
        setTimeout(() => {
            this.currentStats = originalStats;
            this.updateDisplay();
        }, 500);
    }
    
    // Get current stats (for external use)
    getCurrentStats() {
        return { ...this.currentStats };
    }
    
    // Get goal stats (for external use)
    getGoalStats() {
        return { ...this.goalStats };
    }
    
    // Calculate progress percentage
    getProgressPercentage(type) {
        const current = this.currentStats[type + 'Goal'] ? this.currentStats[type + 'Goal'] : 0;
        const goal = this.goalStats[type + 'Goal'] || 1;
        return Math.min((current / goal) * 100, 100);
    }
    
    // Reset to default values (for testing)
    reset() {
        this.currentStats = {
            peopleFed: 24567,
            donationAmount: 47832,
            activePrograms: 12
        };
        this.updateDisplay();
    }
}

// Initialize donation tracker when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if tracker elements exist
    if (document.getElementById('people-fed') || 
        document.getElementById('donation-amount') || 
        document.getElementById('active-programs')) {
        window.donationTracker = new DonationTracker();
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DonationTracker;
}