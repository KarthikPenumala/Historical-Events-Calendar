// Advanced Particle animation for the calendar background

class ParticleBackground {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 120; // Increased particle count for more visual impact
        
        // Enhanced color palette with more variety and modern colors
        this.colors = [
            // Primary theme colors
            'rgba(30, 136, 229, 0.6)',   // Glow blue
            'rgba(100, 181, 246, 0.4)',  // Light blue
            'rgba(13, 43, 75, 0.5)',     // Deep blue
            'rgba(41, 182, 246, 0.5)',   // Highlight blue
            
            // Accent colors for visual interest
            'rgba(255, 152, 0, 0.4)',    // Event color (orange)
            'rgba(255, 87, 34, 0.3)',    // Deep orange
            'rgba(156, 39, 176, 0.3)',   // Purple
            'rgba(76, 175, 80, 0.3)',    // Green
            'rgba(233, 30, 99, 0.3)',    // Pink
            'rgba(103, 58, 183, 0.3)'    // Deep purple
        ];
        
        // Particle properties
        this.maxSize = 7;         // Larger max particle size
        this.minSize = 1;         // Minimum particle size for variety
        this.maxSpeed = 1.3;      // Slightly faster movement
        
        // Connection properties
        this.connected = true;    // Keep connection lines
        this.connectionDistance = 200; // Increased connection distance
        this.connectionWidth = 0.7;   // Slightly thicker connections
        
        // Visual effects
        this.glowEffect = true;   // Enable glow effect
        this.pulseEffect = true;  // Enable pulsing animation
        this.waveEffect = true;   // Enable wave motion effect
        this.colorShift = true;   // Enable color shifting effect
        this.particleShapes = true; // Enable different particle shapes
        
        // Interactivity
        this.interactivity = true; // Enable mouse interaction
        this.mouse = { x: null, y: null, radius: 180 }; // Increased interaction radius
        
        // Performance optimization
        this.lastFrameTime = 0;
        this.fpsLimit = 60;
        
        // Initialize
        this.init();
    }
    
    init() {
        // Create canvas element
        this.canvas.id = 'particle-background';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '-1';
        this.canvas.style.pointerEvents = 'none';
        document.body.prepend(this.canvas);
        
        // Set canvas size
        this.resize();
        
        // Create particles
        this.createParticles();
        
        // Start animation
        this.animate();
        
        // Add event listeners
        window.addEventListener('resize', () => this.resize());
        
        // Add mouse interaction event listeners
        if (this.interactivity) {
            this.canvas.addEventListener('mousemove', (e) => {
                const rect = this.canvas.getBoundingClientRect();
                this.mouse.x = e.clientX - rect.left;
                this.mouse.y = e.clientY - rect.top;
            });
            
            this.canvas.addEventListener('mouseout', () => {
                this.mouse.x = null;
                this.mouse.y = null;
            });
            
            // Add touch support for mobile devices
            this.canvas.addEventListener('touchmove', (e) => {
                e.preventDefault();
                const rect = this.canvas.getBoundingClientRect();
                this.mouse.x = e.touches[0].clientX - rect.left;
                this.mouse.y = e.touches[0].clientY - rect.top;
            });
            
            this.canvas.addEventListener('touchend', () => {
                this.mouse.x = null;
                this.mouse.y = null;
            });
        }
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        this.particles = [];
        
        for (let i = 0; i < this.particleCount; i++) {
            // Create particles with more varied properties
            const particle = {
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * (this.maxSize - this.minSize) + this.minSize,
                speedX: (Math.random() - 0.5) * this.maxSpeed,
                speedY: (Math.random() - 0.5) * this.maxSpeed,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                // Add properties for pulsing effect
                baseSize: Math.random() * (this.maxSize - this.minSize) + this.minSize,
                pulseSpeed: 0.02 + Math.random() * 0.03,
                pulseDirection: Math.random() > 0.5 ? 1 : -1,
                pulseAmount: 0,
                // Add property for unique glow intensity
                glowIntensity: 5 + Math.random() * 15,
                // Add properties for color shifting
                originalColor: this.colors[Math.floor(Math.random() * this.colors.length)],
                colorShiftSpeed: 0.005 + Math.random() * 0.01,
                colorShiftAmount: 0,
                colorShiftDirection: Math.random() > 0.5 ? 1 : -1,
                // Add properties for different shapes
                shape: this.particleShapes ? Math.floor(Math.random() * 4) : 0, // 0: circle, 1: square, 2: triangle, 3: star
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                // Add properties for 3D effect
                z: Math.random() * 100,
                // Add properties for trail effect
                trail: Math.random() > 0.8, // Only some particles have trails
                trailLength: Math.floor(Math.random() * 5) + 3,
                trailPositions: [],
                // Add properties for flicker effect
                flicker: Math.random() > 0.7,
                flickerSpeed: 0.1 + Math.random() * 0.2,
                flickerAmount: 0
            };
            
            this.particles.push(particle);
        }
    }
    
    drawParticles() {
        // Calculate delta time for smooth animations regardless of frame rate
        const now = performance.now();
        const deltaTime = (now - this.lastFrameTime) / 16.67; // Normalize to 60fps
        this.lastFrameTime = now;
        
        // Clear canvas with a subtle fade effect for trails
        this.ctx.fillStyle = 'rgba(10, 25, 41, 0.2)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw connections first (if enabled)
        if (this.connected) {
            this.drawConnections();
        }
        
        // Draw particles with enhanced effects
        this.particles.forEach(particle => {
            // Apply pulsing effect if enabled
            if (this.pulseEffect) {
                // Update pulse amount with delta time for smooth animation
                particle.pulseAmount += particle.pulseSpeed * particle.pulseDirection * deltaTime;
                
                // Reverse direction if reached limits
                if (particle.pulseAmount > 1 || particle.pulseAmount < -0.5) {
                    particle.pulseDirection *= -1;
                }
                
                // Apply pulse to size
                particle.size = particle.baseSize * (1 + particle.pulseAmount * 0.3);
            }
            
            // Apply color shifting if enabled
            if (this.colorShift) {
                // Update color shift amount
                particle.colorShiftAmount += particle.colorShiftSpeed * particle.colorShiftDirection * deltaTime;
                
                // Reverse direction if reached limits
                if (particle.colorShiftAmount > 1 || particle.colorShiftAmount < -0.5) {
                    particle.colorShiftDirection *= -1;
                }
                
                // Extract RGB values from original color
                const originalColor = particle.originalColor.match(/\d+/g);
                const r = parseInt(originalColor[0]);
                const g = parseInt(originalColor[1]);
                const b = parseInt(originalColor[2]);
                const a = parseFloat(originalColor[3] || 0.5);
                
                // Apply color shift
                const shiftAmount = particle.colorShiftAmount * 30; // Adjust color shift intensity
                const newR = Math.min(255, Math.max(0, r + shiftAmount));
                const newG = Math.min(255, Math.max(0, g + shiftAmount * 0.5));
                const newB = Math.min(255, Math.max(0, b + shiftAmount * 0.8));
                
                // Update particle color
                particle.color = `rgba(${Math.floor(newR)}, ${Math.floor(newG)}, ${Math.floor(newB)}, ${a})`;
            }
            
            // Apply flicker effect if enabled
            if (particle.flicker) {
                particle.flickerAmount = Math.sin(now * particle.flickerSpeed) * 0.5 + 0.5;
                // Extract color components
                const color = particle.color.match(/\d+/g);
                const alpha = parseFloat(color[3] || 0.5) * (0.5 + particle.flickerAmount * 0.5);
                // Update color with new alpha
                particle.color = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;
            }
            
            // Update trail positions if enabled
            if (particle.trail) {
                // Add current position to trail
                particle.trailPositions.unshift({ x: particle.x, y: particle.y, size: particle.size });
                
                // Limit trail length
                if (particle.trailPositions.length > particle.trailLength) {
                    particle.trailPositions.pop();
                }
                
                // Draw trail
                particle.trailPositions.forEach((pos, index) => {
                    const opacity = 1 - index / particle.trailLength;
                    const size = pos.size * (1 - index / particle.trailLength);
                    
                    // Extract color components
                    const color = particle.color.match(/\d+/g);
                    const trailColor = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity * 0.3})`;
                    
                    this.ctx.beginPath();
                    this.ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2);
                    this.ctx.fillStyle = trailColor;
                    this.ctx.fill();
                });
            }
            
            // Apply glow effect if enabled
            if (this.glowEffect) {
                this.ctx.shadowBlur = particle.glowIntensity;
                this.ctx.shadowColor = particle.color;
            } else {
                this.ctx.shadowBlur = 0;
            }
            
            // Draw the particle based on its shape
            this.ctx.save();
            this.ctx.translate(particle.x, particle.y);
            this.ctx.rotate(particle.rotation);
            
            // Update rotation
            particle.rotation += particle.rotationSpeed * deltaTime;
            
            // Draw different shapes based on particle.shape
            this.ctx.fillStyle = particle.color;
            
            switch (particle.shape) {
                case 1: // Square
                    const halfSize = particle.size * 0.8;
                    this.ctx.fillRect(-halfSize, -halfSize, halfSize * 2, halfSize * 2);
                    break;
                    
                case 2: // Triangle
                    this.ctx.beginPath();
                    this.ctx.moveTo(0, -particle.size);
                    this.ctx.lineTo(particle.size * 0.866, particle.size * 0.5); // 60 degrees
                    this.ctx.lineTo(-particle.size * 0.866, particle.size * 0.5); // -60 degrees
                    this.ctx.closePath();
                    this.ctx.fill();
                    break;
                    
                case 3: // Star
                    this.ctx.beginPath();
                    const outerRadius = particle.size;
                    const innerRadius = particle.size * 0.4;
                    const spikes = 5;
                    
                    for (let i = 0; i < spikes * 2; i++) {
                        const radius = i % 2 === 0 ? outerRadius : innerRadius;
                        const angle = (Math.PI * 2 * i) / (spikes * 2);
                        const x = radius * Math.cos(angle);
                        const y = radius * Math.sin(angle);
                        
                        if (i === 0) {
                            this.ctx.moveTo(x, y);
                        } else {
                            this.ctx.lineTo(x, y);
                        }
                    }
                    
                    this.ctx.closePath();
                    this.ctx.fill();
                    break;
                    
                default: // Circle (default)
                    this.ctx.beginPath();
                    this.ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
                    this.ctx.fill();
                    break;
            }
            
            this.ctx.restore();
        });
        
        // Reset shadow for performance
        this.ctx.shadowBlur = 0;
    }
    
    drawConnections() {
        // Use a more efficient approach to draw connections
        // Only check particles that are likely to be within connection distance
        const gridSize = this.connectionDistance;
        const grid = {};
        
        // Place particles in grid cells for faster proximity checks
        this.particles.forEach((particle, index) => {
            const cellX = Math.floor(particle.x / gridSize);
            const cellY = Math.floor(particle.y / gridSize);
            const cellKey = `${cellX},${cellY}`;
            
            if (!grid[cellKey]) {
                grid[cellKey] = [];
            }
            
            grid[cellKey].push(index);
        });
        
        // Check neighboring cells for connections
        this.particles.forEach((particle1, i) => {
            const cellX = Math.floor(particle1.x / gridSize);
            const cellY = Math.floor(particle1.y / gridSize);
            
            // Check 9 neighboring cells (including current cell)
            for (let nx = cellX - 1; nx <= cellX + 1; nx++) {
                for (let ny = cellY - 1; ny <= cellY + 1; ny++) {
                    const neighborKey = `${nx},${ny}`;
                    const neighbors = grid[neighborKey] || [];
                    
                    // Check particles in this cell
                    neighbors.forEach(j => {
                        // Skip if same particle or already checked (i < j ensures we check each pair once)
                        if (i >= j) return;
                        
                        const particle2 = this.particles[j];
                        const dx = particle1.x - particle2.x;
                        const dy = particle1.y - particle2.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        
                        if (distance < this.connectionDistance) {
                            // Calculate opacity based on distance
                            const opacity = 1 - (distance / this.connectionDistance);
                            
                            // Get color based on the two connected particles
                            const color1 = particle1.color.match(/\d+/g);
                            const color2 = particle2.color.match(/\d+/g);
                            
                            // Blend the colors of the two particles
                            const r = Math.floor((parseInt(color1[0]) + parseInt(color2[0])) / 2);
                            const g = Math.floor((parseInt(color1[1]) + parseInt(color2[1])) / 2);
                            const b = Math.floor((parseInt(color1[2]) + parseInt(color2[2])) / 2);
                            
                            this.ctx.beginPath();
                            this.ctx.moveTo(particle1.x, particle1.y);
                            this.ctx.lineTo(particle2.x, particle2.y);
                            
                            // Use blended color for connection line
                            this.ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity * 0.3})`;
                            
                            // Vary line width based on particle sizes
                            const avgSize = (particle1.size + particle2.size) / 2;
                            this.ctx.lineWidth = this.connectionWidth * (avgSize / this.maxSize);
                            
                            // Add subtle glow to connections
                            if (this.glowEffect && opacity > 0.5) {
                                this.ctx.shadowBlur = 3;
                                this.ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.5)`;
                            }
                            
                            this.ctx.stroke();
                            this.ctx.shadowBlur = 0; // Reset shadow
                        }
                    });
                }
            }
        });
    }
    
    updateParticles() {
        const now = Date.now();
        
        // Calculate delta time for smooth animations regardless of frame rate
        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastFrameTime) / 16.67; // Normalize to 60fps
        
        // Apply global effects based on time
        const globalWaveX = Math.sin(now * 0.0002) * 0.3;
        const globalWaveY = Math.cos(now * 0.0003) * 0.2;
        
        for (let i = 0; i < this.particles.length; i++) {
            const particle = this.particles[i];
            
            // Handle mouse interactivity if enabled
            if (this.interactivity && this.mouse.x !== null && this.mouse.y !== null) {
                // Calculate distance between mouse and particle
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.mouse.radius) {
                    // Inside the mouse radius - apply repulsion force
                    // Strength inversely proportional to distance
                    const force = (this.mouse.radius - distance) / this.mouse.radius;
                    const forceDirectionX = dx / distance || 0;
                    const forceDirectionY = dy / distance || 0;
                    
                    // Apply repulsion force (push particles away from mouse)
                    particle.speedX -= forceDirectionX * force * 0.3 * deltaTime;
                    particle.speedY -= forceDirectionY * force * 0.3 * deltaTime;
                    
                    // Highlight particles near mouse with enhanced effects
                    if (distance < this.mouse.radius / 2) {
                        // Store original color if not already stored
                        if (!particle.interactiveState) {
                            particle.interactiveState = {
                                originalColor: particle.color,
                                originalSize: particle.size,
                                originalGlowIntensity: particle.glowIntensity
                            };
                            
                            // Extract RGB values
                            const color = particle.color.match(/\d+/g);
                            const r = Math.min(255, parseInt(color[0]) + 70);
                            const g = Math.min(255, parseInt(color[1]) + 70);
                            const b = Math.min(255, parseInt(color[2]) + 70);
                            
                            // Create brighter version of the color with increased opacity
                            const alpha = Math.min(1, parseFloat(color[3] || 0.5) + 0.3);
                            particle.color = `rgba(${r}, ${g}, ${b}, ${alpha})`;
                            
                            // Temporarily increase size and glow
                            particle.size *= 1.8;
                            particle.glowIntensity *= 2;
                            
                            // Add special interactive effects
                            particle.rotationSpeed *= 3; // Spin faster when interacted with
                        }
                    }
                } else if (particle.interactiveState) {
                    // Gradually restore original properties when outside mouse radius
                    const transitionSpeed = 0.1 * deltaTime;
                    
                    // Extract current color components
                    const currentColor = particle.color.match(/\d+/g);
                    const originalColor = particle.interactiveState.originalColor.match(/\d+/g);
                    
                    // Interpolate color values
                    const r = parseInt(currentColor[0]) - (parseInt(currentColor[0]) - parseInt(originalColor[0])) * transitionSpeed;
                    const g = parseInt(currentColor[1]) - (parseInt(currentColor[1]) - parseInt(originalColor[1])) * transitionSpeed;
                    const b = parseInt(currentColor[2]) - (parseInt(currentColor[2]) - parseInt(originalColor[2])) * transitionSpeed;
                    const a = parseFloat(currentColor[3] || 0.5) - (parseFloat(currentColor[3] || 0.5) - parseFloat(originalColor[3] || 0.5)) * transitionSpeed;
                    
                    // Update color
                    particle.color = `rgba(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)}, ${a})`;
                    
                    // Interpolate size and glow
                    particle.size -= (particle.size - particle.interactiveState.originalSize) * transitionSpeed;
                    particle.glowIntensity -= (particle.glowIntensity - particle.interactiveState.originalGlowIntensity) * transitionSpeed;
                    particle.rotationSpeed -= (particle.rotationSpeed - particle.rotationSpeed / 3) * transitionSpeed;
                    
                    // Check if transition is complete
                    if (Math.abs(particle.size - particle.interactiveState.originalSize) < 0.1) {
                        particle.color = particle.interactiveState.originalColor;
                        particle.size = particle.interactiveState.originalSize;
                        particle.glowIntensity = particle.interactiveState.originalGlowIntensity;
                        delete particle.interactiveState;
                    }
                }
            }
            
            // Update position with delta time for smooth movement
            particle.x += particle.speedX * deltaTime;
            particle.y += particle.speedY * deltaTime;
            
            // Apply 3D perspective effect
            const perspective = 500;
            const scale = perspective / (perspective + particle.z);
            particle.displaySize = particle.size * scale;
            
            // Apply subtle wave motion
            if (this.waveEffect) {
                // Each particle has a slightly different wave pattern
                const waveOffset = i * 0.05;
                const waveAmplitude = 0.15;
                
                // Apply sine wave motion to speed with global wave influence
                particle.speedX += (Math.sin(now * 0.001 + waveOffset) * waveAmplitude + globalWaveX) * 0.01 * deltaTime;
                particle.speedY += (Math.cos(now * 0.001 + waveOffset) * waveAmplitude + globalWaveY) * 0.01 * deltaTime;
                
                // Apply subtle z-axis movement for 3D effect
                particle.z += Math.sin(now * 0.0005 + waveOffset) * 0.5 * deltaTime;
                particle.z = Math.max(0, Math.min(100, particle.z)); // Keep z within bounds
                
                // Limit maximum speed
                const speed = Math.sqrt(particle.speedX * particle.speedX + particle.speedY * particle.speedY);
                if (speed > this.maxSpeed) {
                    particle.speedX = (particle.speedX / speed) * this.maxSpeed;
                    particle.speedY = (particle.speedY / speed) * this.maxSpeed;
                }
            }
            
            // Add subtle gravitational effect
            const centerX = this.canvas.width / 2;
            const centerY = this.canvas.height / 2;
            const dx = centerX - particle.x;
            const dy = centerY - particle.y;
            const distanceToCenter = Math.sqrt(dx * dx + dy * dy);
            
            if (distanceToCenter > 100) { // Only apply when far from center
                const gravityForce = 0.00003 * deltaTime;
                particle.speedX += (dx / distanceToCenter) * gravityForce;
                particle.speedY += (dy / distanceToCenter) * gravityForce;
            }
            
            // Apply friction to gradually slow particles
            const friction = 0.99;
            particle.speedX *= friction;
            particle.speedY *= friction;
            
            // Bounce off edges with slight randomization for more natural behavior
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.speedX *= -1;
                // Add slight randomization to bounce angle
                particle.speedY += (Math.random() - 0.5) * 0.1 * deltaTime;
                // Create bounce effect
                if (particle.trail) {
                    // Clear trail on bounce for visual effect
                    particle.trailPositions = [];
                }
            }
            
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.speedY *= -1;
                // Add slight randomization to bounce angle
                particle.speedX += (Math.random() - 0.5) * 0.1 * deltaTime;
                // Create bounce effect
                if (particle.trail) {
                    // Clear trail on bounce for visual effect
                    particle.trailPositions = [];
                }
            }
            
            // Occasionally change particle color slightly for dynamic effect
            if (Math.random() < 0.001 * deltaTime) {
                // Only change color if not in interactive state
                if (!particle.interactiveState) {
                    const color = particle.color.match(/\d+/g);
                    const r = Math.min(255, Math.max(0, parseInt(color[0]) + (Math.random() - 0.5) * 20));
                    const g = Math.min(255, Math.max(0, parseInt(color[1]) + (Math.random() - 0.5) * 20));
                    const b = Math.min(255, Math.max(0, parseInt(color[2]) + (Math.random() - 0.5) * 20));
                    const a = parseFloat(color[3] || 0.5);
                    particle.color = `rgba(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)}, ${a})`;
                }
            }
            
            // Occasionally change particle shape for more dynamic visuals
            if (this.particleShapes && Math.random() < 0.0005 * deltaTime) {
                particle.shape = Math.floor(Math.random() * 4);
            }
        }
    }
    
    animate() {
        // Implement frame rate limiting for better performance
        const now = performance.now();
        const elapsed = now - this.lastFrameTime;
        
        // Only update if enough time has passed (based on FPS limit)
        if (elapsed > 1000 / this.fpsLimit) {
            this.updateParticles();
            this.drawParticles();
            this.lastFrameTime = now;
        }
        
        // Request next frame
        requestAnimationFrame(() => this.animate());
    }
    
    // Handle window resize to ensure canvas fills the screen
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Adjust particle positions if they're outside the new boundaries
        this.particles.forEach(particle => {
            if (particle.x > this.canvas.width) particle.x = this.canvas.width * Math.random();
            if (particle.y > this.canvas.height) particle.y = this.canvas.height * Math.random();
        });
    }
}

// Initialize particle background when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ParticleBackground();
});