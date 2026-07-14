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

    // Navbar scroll states + hero parallax (single rAF-throttled handler;
    // class toggles only fire on state change so the fixed navbar layer
    // is never restyled per frame)
    const navbar = document.querySelector('.navbar');
    const heroSection = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    const heroScreenshot = document.querySelector('.hero-screenshot');
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    let navSolid = false;
    let navHidden = false;
    let peekedByMouse = false;

    function onScroll() {
        const scrollY = window.scrollY;

        const solid = scrollY > 100;
        if (solid !== navSolid) {
            navSolid = solid;
            navbar.classList.toggle('navbar-solid', solid);
        }

        const hidden = scrollY > 200;
        if (hidden !== navHidden) {
            navHidden = hidden;
            peekedByMouse = false;
            navbar.classList.toggle('navbar-hidden', hidden);
        }

        // Parallax: desktop only — per-frame style writes on the hero
        // subtree are too expensive on budget phones
        if (!isTouchDevice && heroSection && scrollY < window.innerHeight) {
            const parallaxSpeed = 0.5;
            if (heroContent) {
                heroContent.style.transform = `translateY(${scrollY * parallaxSpeed}px)`;
                heroContent.style.opacity = 1 - (scrollY / 600);
            }
            if (heroScreenshot) {
                heroScreenshot.style.transform = `translateY(${scrollY * parallaxSpeed * 0.7}px)`;
            }
        }
    }

    let scrollTicking = false;
    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            scrollTicking = true;
            requestAnimationFrame(() => {
                onScroll();
                scrollTicking = false;
            });
        }
    }, { passive: true });

    // Show navbar when hovering near top of page (desktop only)
    if (!isTouchDevice) {
        document.addEventListener('mousemove', (e) => {
            if (!navHidden) return;
            if (e.clientY < 100 && !peekedByMouse) {
                peekedByMouse = true;
                navbar.classList.remove('navbar-hidden');
            } else if (e.clientY > 100 && peekedByMouse) {
                peekedByMouse = false;
                navbar.classList.add('navbar-hidden');
            }
        }, { passive: true });
    }



    // Gumroad button - now properly linked
    const gumroadButton = document.getElementById('gumroad-button');
    if (gumroadButton) {
        // Button now has proper href - no need to prevent default
        // Just track the click for analytics
        gumroadButton.addEventListener('click', function() {
            trackEvent('click', 'purchase', 'gumroad-soundanalyzer');
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
                observer.unobserve(entry.target);
                // Clear inline styles after the reveal so CSS hover effects work
                setTimeout(() => {
                    entry.target.style.transform = '';
                    entry.target.style.transition = '';
                }, 700);
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



    // Magnetic effect on CTA buttons
    const magneticButtons = document.querySelectorAll('.cta-button, .pricing-button, .download-button');
    magneticButtons.forEach(button => {
        button.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            this.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) scale(1.05)`;
        });

        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(0, 0) scale(1)';
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
    ║  Contact: xyaudiomail@gmail.com                             ║
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

    // Show More Guides toggle
    const showMoreBtn = document.getElementById('show-more-guides');
    const moreGuides = document.getElementById('more-guides');

    if (showMoreBtn && moreGuides) {
        showMoreBtn.addEventListener('click', function() {
            if (moreGuides.style.display === 'none') {
                moreGuides.style.display = 'block';
                showMoreBtn.textContent = 'Show Less Guides';
                showMoreBtn.style.background = 'var(--accent-secondary)';
                showMoreBtn.style.color = 'white';
            } else {
                moreGuides.style.display = 'none';
                showMoreBtn.textContent = 'Show More Guides...';
                showMoreBtn.style.background = 'transparent';
                showMoreBtn.style.color = 'var(--accent-secondary)';
            }
        });
    }
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

// Spectrum screenshot fullscreen function
function openSpectrumFullscreen(img) {
    if (img.requestFullscreen) {
        img.requestFullscreen();
    } else if (img.webkitRequestFullscreen) {
        img.webkitRequestFullscreen();
    } else if (img.msRequestFullscreen) {
        img.msRequestFullscreen();
    }
}

// Make function globally available
window.openSpectrumFullscreen = openSpectrumFullscreen;

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatCurrency,
        debounce,
        openSpectrumFullscreen
    };
}