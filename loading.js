// Modern loading animation for the calendar application

class LoadingAnimation {
    constructor() {
        this.loadingScreen = null;
        this.progressBar = null;
        this.progressText = null;
        this.progressBarContainer = null;
        this.loadingParticles = [];
        this.particleCanvas = null;
        this.particleCtx = null;
        
        // More engaging and varied loading messages
        this.loadingMessages = [
            'Gathering real-time events...',
            'Preparing your personalized calendar...',
            'Loading global festivals and celebrations...',
            'Synchronizing with real-time data sources...',
            'Optimizing your experience...',
            'Connecting to news services...',
            'Analyzing historical patterns...',
            'Preparing dynamic visualizations...',
            'Almost ready for your exploration...',
        ];
        
        this.currentMessage = 0;
        this.progress = 0;
        this.loadingInterval = null;
        this.messageInterval = null;
        this.particleInterval = null;
        this.animationFrame = null;
        
        // Color theme for loading animation
        this.colors = {
            primary: '#4285f4',    // Google Blue
            secondary: '#ea4335',  // Google Red
            accent1: '#fbbc05',    // Google Yellow
            accent2: '#34a853',    // Google Green
            background: '#1a1a2e',  // Dark blue background
            text: '#ffffff'        // White text
        };
        
        // Initialize
        this.init();
    }
    
    init() {
        // Create loading screen
        this.createLoadingScreen();
        
        // Start progress simulation
        this.startLoading();
        
        // Listen for when the page is fully loaded
        window.addEventListener('load', () => {
            // Give a little extra time for visual effect
            setTimeout(() => {
                this.completeLoading();
            }, 500);
        });
    }
    
    createLoadingScreen() {
        // Create loading screen container
        this.loadingScreen = document.createElement('div');
        this.loadingScreen.className = 'loading-screen';
        
        // Create loading content
        const loadingContent = document.createElement('div');
        loadingContent.className = 'loading-content';
        
        // Create loading title
        const loadingTitle = document.createElement('h2');
        loadingTitle.textContent = 'Historical Events Calendar';
        loadingTitle.className = 'loading-title';
        
        // Create loading icon
        const loadingIcon = document.createElement('div');
        loadingIcon.className = 'loading-icon';
        loadingIcon.innerHTML = '<i class="fas fa-calendar-alt"></i>';
        
        // Create loading message
        this.loadingMessage = document.createElement('p');
        this.loadingMessage.className = 'loading-message';
        this.loadingMessage.textContent = this.loadingMessages[0];
        
        // Create progress bar container
        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-container';
        
        // Create progress bar
        this.progressBar = document.createElement('div');
        this.progressBar.className = 'progress-bar';
        
        // Create progress text
        this.progressText = document.createElement('div');
        this.progressText.className = 'progress-text';
        this.progressText.textContent = '0%';
        
        // Assemble the loading screen
        progressContainer.appendChild(this.progressBar);
        progressContainer.appendChild(this.progressText);
        
        loadingContent.appendChild(loadingTitle);
        loadingContent.appendChild(loadingIcon);
        loadingContent.appendChild(this.loadingMessage);
        loadingContent.appendChild(progressContainer);
        
        this.loadingScreen.appendChild(loadingContent);
        
        // Add to document
        document.body.appendChild(this.loadingScreen);
    }
    
    startLoading() {
        // Simulate progress
        this.loadingInterval = setInterval(() => {
            if (this.progress < 90) {
                this.progress += Math.random() * 10;
                if (this.progress > 90) this.progress = 90;
                this.updateProgress();
            }
        }, 500);
        
        // Cycle through messages
        this.messageInterval = setInterval(() => {
            this.currentMessage = (this.currentMessage + 1) % this.loadingMessages.length;
            this.updateMessage();
        }, 2000);
    }
    
    updateProgress() {
        const progressValue = Math.floor(this.progress);
        this.progressBar.style.width = `${progressValue}%`;
        this.progressText.textContent = `${progressValue}%`;
    }
    
    updateMessage() {
        // Fade out
        this.loadingMessage.style.opacity = 0;
        
        setTimeout(() => {
            // Update text
            this.loadingMessage.textContent = this.loadingMessages[this.currentMessage];
            // Fade in
            this.loadingMessage.style.opacity = 1;
        }, 300);
    }
    
    completeLoading() {
        // Clear intervals
        clearInterval(this.loadingInterval);
        clearInterval(this.messageInterval);
        
        // Complete progress to 100%
        this.progress = 100;
        this.updateProgress();
        this.loadingMessage.textContent = 'Ready!';
        
        // Add loaded class for animation
        setTimeout(() => {
            this.loadingScreen.classList.add('loaded');
            
            // Remove loading screen after animation
            setTimeout(() => {
                document.body.removeChild(this.loadingScreen);
            }, 1000);
        }, 500);
    }
}

// Initialize loading animation immediately
const loadingAnimation = new LoadingAnimation();