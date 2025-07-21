// Sound effects manager for the calendar application

const SoundEffects = {
    // Sound effect URLs - using local sound files
    sounds: {
        click: './sounds/click.mp3',  // Soft click
        hover: './sounds/hover.mp3',  // Hover sound
        success: './sounds/success.mp3', // Success sound
        notification: './sounds/notification.mp3', // Notification
        modalOpen: './sounds/modalOpen.mp3',  // Modal open
        modalClose: './sounds/modalClose.mp3', // Modal close
        daySelect: './sounds/daySelect.mp3',  // Day selection
        tabSwitch: './sounds/tabSwitch.mp3'   // Tab switch
    },
    
    // Fallback sounds if primary sources fail
    fallbackSounds: {
        click: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=',  // Empty sound
        hover: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=',
        success: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=',
        notification: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=',
        modalOpen: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=',
        modalClose: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=',
        daySelect: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=',
        tabSwitch: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA='
    },
    
    // Audio objects cache
    audioCache: {},
    
    // Settings
    enabled: false, // Disable sounds by default due to file issues
    volume: 0.5,
    
    // Initialize sound effects
    init() {
        try {
            // Add sound toggle to the page
            this.addSoundToggle();
            
            // Add event listeners for interactive elements
            this.setupEventListeners();
            
            // Don't attempt to load sounds if disabled
            if (!this.enabled) {
                console.log('Sound effects are disabled');
                return;
            }
            
            // Pre-load sounds with error handling
            for (const [key, url] of Object.entries(this.sounds)) {
                try {
                    this.audioCache[key] = new Audio(url);
                    this.audioCache[key].volume = this.volume;
                    
                    // Add error handler to use fallback if loading fails
                    this.audioCache[key].addEventListener('error', () => {
                        console.log(`Error loading sound: ${key}, using fallback`);
                        if (this.fallbackSounds[key]) {
                            this.audioCache[key] = new Audio(this.fallbackSounds[key]);
                            this.audioCache[key].volume = this.volume;
                        }
                    });
                    
                    this.audioCache[key].load();
                } catch (e) {
                    console.log(`Error initializing sound: ${key}`, e);
                    // Use fallback sound
                    if (this.fallbackSounds[key]) {
                        this.audioCache[key] = new Audio(this.fallbackSounds[key]);
                        this.audioCache[key].volume = this.volume;
                    }
                }
            }
        } catch (e) {
            console.error('Error initializing sound system:', e);
            this.enabled = false;
        }
    },
    
    // Play a sound effect with error handling
    play(soundName) {
        if (!this.enabled) return;
        
        // If sound exists in cache
        if (this.audioCache[soundName]) {
            try {
                // Create a new audio instance to allow overlapping sounds
                const sound = this.audioCache[soundName].cloneNode();
                sound.volume = this.volume;
                
                // Play with error handling
                sound.play().catch(e => {
                    console.log('Sound play error:', e);
                    // Try fallback sound if available
                    if (this.fallbackSounds[soundName]) {
                        const fallbackSound = new Audio(this.fallbackSounds[soundName]);
                        fallbackSound.volume = this.volume;
                        fallbackSound.play().catch(() => {});
                    }
                });
            } catch (e) {
                console.log('Sound clone error:', e);
            }
        }
    },
    
    // Toggle sound on/off
    toggleSound() {
        this.enabled = !this.enabled;
        const toggle = document.getElementById('sound-toggle');
        if (toggle) {
            toggle.innerHTML = this.enabled ? 
                '<i class="fas fa-volume-up"></i>' : 
                '<i class="fas fa-volume-mute"></i>';
            toggle.setAttribute('title', this.enabled ? 'Mute Sounds' : 'Enable Sounds');
        }
        
        // Play feedback sound if enabling
        if (this.enabled) {
            this.play('click');
        }
    },
    
    // Add sound toggle button to the page
    addSoundToggle() {
        const header = document.querySelector('header');
        if (header) {
            const soundToggle = document.createElement('button');
            soundToggle.id = 'sound-toggle';
            soundToggle.className = 'sound-toggle';
            soundToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
            soundToggle.setAttribute('title', 'Mute Sounds');
            soundToggle.addEventListener('click', () => this.toggleSound());
            header.appendChild(soundToggle);
        }
    },
    
    // Setup event listeners for interactive elements
    setupEventListeners() {
        // Calendar days
        document.addEventListener('click', (e) => {
            // Day clicks
            if (e.target.closest('.day')) {
                this.play('daySelect');
            }
            
            // Button clicks
            if (e.target.closest('button')) {
                this.play('click');
            }
            
            // Tab switches
            if (e.target.closest('.tab-btn')) {
                this.play('tabSwitch');
            }
            
            // Modal open/close
            if (e.target.closest('.add-btn')) {
                this.play('modalOpen');
            }
            
            if (e.target.closest('.close-btn')) {
                this.play('modalClose');
            }
            
            // Save actions
            if (e.target.closest('.save-note-btn')) {
                this.play('success');
            }
        });
        
        // Hover effects
        document.addEventListener('mouseover', (e) => {
            // Only play hover sound for important interactive elements
            if (e.target.closest('.day') || 
                e.target.closest('button:not(#sound-toggle)') || 
                e.target.closest('.tab-btn')) {
                this.play('hover');
            }
        }, { passive: true });
    }
};

// Initialize sounds when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    SoundEffects.init();
});