// SoundAnalyzer Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Navbar background opacity on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(26, 26, 26, 0.98)';
        } else {
            navbar.style.background = 'rgba(26, 26, 26, 0.95)';
        }
    });

    // Interactive sliders in mockup
    const sliders = document.querySelectorAll('.slider');
    sliders.forEach(slider => {
        const valueDisplay = slider.nextElementSibling;
        
        slider.addEventListener('input', function() {
            const value = this.value;
            const max = this.max;
            const min = this.min;
            
            // Update value display
            if (this.classList.contains('slider') && valueDisplay) {
                if (slider.min == "0" && slider.max == "100") {
                    // Smoothing slider (0.00 - 1.00)
                    valueDisplay.textContent = (value / 100).toFixed(2);
                } else {
                    // dB Range slider
                    valueDisplay.textContent = value + '.0 dB';
                }
            }
            
            // Animate spectrum curve based on smoothing
            animateSpectrum(value);
        });
    });

    // Animate spectrum curve
    function animateSpectrum(intensity) {
        const spectrumPath = document.querySelector('.spectrum-svg path');
        if (spectrumPath) {
            const baseIntensity = intensity / 100;
            const newPath = generateSpectrumPath(baseIntensity);
            spectrumPath.setAttribute('d', newPath);
        }
    }

    // Generate dynamic spectrum path
    function generateSpectrumPath(intensity) {
        const points = [];
        const width = 400;
        const height = 200;
        const numPoints = 20;
        
        for (let i = 0; i <= numPoints; i++) {
            const x = (i / numPoints) * width;
            const baseY = height - 20;
            const variation = Math.sin(i * 0.5) * 60 * intensity;
            const randomVariation = (Math.random() - 0.5) * 20 * intensity;
            const y = baseY - 40 - variation - randomVariation;
            points.push({x, y: Math.max(20, Math.min(height - 20, y))});
        }
        
        // Create smooth curve through points
        let path = `M${points[0].x},${points[0].y}`;
        for (let i = 1; i < points.length; i++) {
            const prev = points[i - 1];
            const curr = points[i];
            const cpx = (prev.x + curr.x) / 2;
            path += ` Q${cpx},${prev.y} ${curr.x},${curr.y}`;
        }
        
        return path;
    }

    // Checkbox interactions
    const checkboxes = document.querySelectorAll('.checkbox-label input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // Visual feedback for checkbox state changes
            const spectrumDisplay = document.querySelector('.spectrum-display');
            if (this.checked) {
                spectrumDisplay.style.borderColor = '#ff8c42';
            } else {
                spectrumDisplay.style.borderColor = '#404040';
            }
            
            // Animate based on peak hold state
            if (this.parentElement.textContent.includes('Peak Hold')) {
                togglePeakHold(this.checked);
            }
        });
    });

    // Peak hold animation
    function togglePeakHold(enabled) {
        const spectrumCurve = document.querySelector('.spectrum-curve');
        if (enabled) {
            spectrumCurve.style.animationDuration = '1s';
        } else {
            spectrumCurve.style.animationDuration = '3s';
        }
    }

    // Dropdown interactions
    const selects = document.querySelectorAll('.control-select');
    selects.forEach(select => {
        select.addEventListener('change', function() {
            // Visual feedback for parameter changes
            const mockupContent = document.querySelector('.mockup-content');
            mockupContent.style.transform = 'scale(1.02)';
            setTimeout(() => {
                mockupContent.style.transform = 'scale(1)';
            }, 200);
        });
    });

    // Gumroad button (placeholder for actual integration)
    const gumroadButton = document.getElementById('gumroad-button');
    if (gumroadButton) {
        gumroadButton.addEventListener('click', function(e) {
            e.preventDefault();
            // TODO: Replace with actual Gumroad link when store is set up
            alert('Gumroad store coming soon! Check back in a few days.');
        });
    }

    // Add loading animation to CTA buttons
    const ctaButtons = document.querySelectorAll('.cta-button, .pricing-button, .download-button');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (!this.classList.contains('loading')) {
                this.classList.add('loading');
                setTimeout(() => {
                    this.classList.remove('loading');
                }, 2000);
            }
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe feature cards and spec categories
    const animatedElements = document.querySelectorAll('.feature-card, .spec-category, .pricing-card');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });

    // Initialize spectrum animation
    setTimeout(() => {
        animateSpectrum(50); // Start with medium intensity
    }, 1000);

    // Auto-update spectrum animation
    setInterval(() => {
        const randomIntensity = 30 + Math.random() * 40; // 30-70% intensity
        animateSpectrum(randomIntensity);
    }, 3000);

    // Add dynamic hover effects to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.borderColor = '#ff8c42';
            this.style.boxShadow = '0 15px 35px rgba(255, 140, 66, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.borderColor = '#505050';
            this.style.boxShadow = 'none';
        });
    });

    // Add ripple effect to buttons
    function createRipple(event) {
        const button = event.currentTarget;
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
        circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
        circle.classList.add('ripple');

        const ripple = button.getElementsByClassName('ripple')[0];
        if (ripple) {
            ripple.remove();
        }

        button.appendChild(circle);
    }

    // Add ripple effect to all buttons
    ctaButtons.forEach(button => {
        button.addEventListener('click', createRipple);
    });

    // Console easter egg for developers
    console.log(`
    ╔══════════════════════════════════════════════════════════════╗
    ║                      XY Audio SoundAnalyzer                  ║
    ║                   Professional Audio Software                ║
    ║──────────────────────────────────────────────────────────────║
    ║  Interested in our code? We're always looking for talented  ║
    ║  developers to join our team!                               ║
    ║                                                              ║
    ║  Contact: contact@xyaudio.net                               ║
    ║  Website: https://xyaudio.net                               ║
    ╚══════════════════════════════════════════════════════════════╝
    `);

    // Performance monitoring (development only)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('🔧 Development mode detected');
        
        // Monitor frame rate
        let lastTime = performance.now();
        let frameCount = 0;
        
        function monitorFPS() {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime >= lastTime + 1000) {
                console.log(`📊 FPS: ${frameCount}`);
                frameCount = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(monitorFPS);
        }
        
        monitorFPS();
    }

    // Keyboard navigation enhancement
    document.addEventListener('keydown', function(e) {
        // Press 'D' to go to download section
        if (e.key === 'd' || e.key === 'D') {
            const downloadSection = document.getElementById('download');
            if (downloadSection) {
                downloadSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
        
        // Press 'F' to go to features section
        if (e.key === 'f' || e.key === 'F') {
            const featuresSection = document.getElementById('features');
            if (featuresSection) {
                featuresSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
        
        // Press 'P' to go to pricing section
        if (e.key === 'p' || e.key === 'P') {
            const pricingSection = document.getElementById('pricing');
            if (pricingSection) {
                pricingSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });

    // Mobile menu toggle (for future responsive menu)
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('mobile-open');
        });
    }

    // Add CSS for ripple effect dynamically
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.4);
            transform: scale(0);
            animation: ripple-animation 600ms linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .loading {
            position: relative;
            overflow: hidden;
        }
        
        .loading::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            animation: loading-shimmer 2s infinite;
        }
        
        @keyframes loading-shimmer {
            0% { left: -100%; }
            100% { left: 100%; }
        }
        
        .mobile-open {
            display: flex !important;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: var(--bg-primary);
            padding: 1rem 2rem;
            border-top: 1px solid var(--border-color);
        }
    `;
    document.head.appendChild(rippleStyle);

    // Analytics placeholder (for future implementation)
    function trackEvent(action, category, label) {
        // TODO: Implement analytics tracking
        console.log(`📈 Event: ${action}, Category: ${category}, Label: ${label}`);
    }

    // Track button clicks
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            trackEvent('click', 'button', buttonText);
        });
    });

    // Track section views
    const sections = document.querySelectorAll('section[id]');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                trackEvent('view', 'section', entry.target.id);
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });
});

// Utility functions
function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatCurrency,
        debounce
    };
}