import '../css/main.css';

// DOM Elements
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.getElementById('nav-menu');
const categoryButtons = document.querySelectorAll('.category-btn');
const productsGrid = document.getElementById('products-grid');
const brandsCarousel = document.getElementById('brands-carousel');

// Mobile Menu Toggle (Improved)
mobileMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.classList.toggle('menu-open');
});

// Close mobile menu when clicking on nav links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !navMenu.contains(e.target)) {
        mobileMenu.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
});

// Product Category Filter
categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const category = button.getAttribute('data-category');
        filterProducts(category);
    });
});

function filterProducts(category) {
    const products = document.querySelectorAll('.product-card');
    let visibleIndex = 0;

    products.forEach((product) => {
        const productCategory = product.getAttribute('data-category');

        if (category === 'all' || productCategory === category) {
            product.style.display = 'block';
            const delay = visibleIndex * 0.06;
            if (typeof gsap !== 'undefined') {
                gsap.fromTo(product,
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.45, delay, ease: 'power2.out' }
                );
            } else {
                product.style.opacity = '1';
            }
            visibleIndex++;
        } else {
            product.style.display = 'none';
        }
    });
}

// Smooth scrolling mejorado con easing personalizado
function smoothScrollTo(targetPosition, duration = 500) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const ease = easeOutQuart(progress);
        
        window.scrollTo(0, startPosition + distance * ease);
        
        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }
    
    requestAnimationFrame(animation);
}

// Smooth scrolling para enlaces de ancla
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') {
            smoothScrollTo(0, 800);
            return;
        }
        
        const target = document.querySelector(targetId);
        if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight - 20;
            
            smoothScrollTo(targetPosition, 550);
        }
    });
});

// Active Navigation Link Update
function updateActiveLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop - 150) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    updateActiveLink();
    
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Brands Carousel — JS-driven marquee (RAF-based, no CSS animation conflicts)
(function initBrandsCarousel() {
    const carousel = document.getElementById('brands-carousel');
    if (!carousel) return;

    const container = carousel.parentElement;
    // Ensure container clips overflow
    container.style.overflow = 'hidden';
    container.style.position = 'relative';

    let position = 0;
    const speed = 0.6; // px per frame
    let paused = false;
    let rafId = null;

    function getHalfWidth() {
        return carousel.scrollWidth / 2;
    }

    function tick() {
        if (!paused) {
            position -= speed;
            const half = getHalfWidth();
            if (Math.abs(position) >= half) {
                position = 0; // seamless loop: jump back to start
            }
            carousel.style.transform = `translateX(${position}px)`;
        }
        rafId = requestAnimationFrame(tick);
    }

    // Pause on hover
    carousel.addEventListener('mouseenter', () => { paused = true; });
    carousel.addEventListener('mouseleave', () => { paused = false; });

    // Start after a short delay so the section is visible
    setTimeout(() => { rafId = requestAnimationFrame(tick); }, 800);
}());

// WhatsApp Enhanced Functionality
function enhanceWhatsAppLinks() {
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
    
    whatsappLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Add analytics or tracking here if needed
            console.log('WhatsApp link clicked:', link.href);
            
            // Add visual feedback
            link.style.transform = 'scale(0.95)';
            setTimeout(() => {
                link.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// Notification System
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 110px;
        right: 25px;
        background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 6px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.8rem;
        max-width: 400px;
        animation: slideIn 0.4s ease;
        font-family: 'Montserrat', sans-serif;
        font-weight: 600;
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.4s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 400);
        }
    }, 5000);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.4s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 400);
    });
    
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.3rem;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
        font-weight: bold;
    `;
}

// Add CSS animations for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .menu-open {
        overflow: hidden;
    }
`;
document.head.appendChild(notificationStyles);

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Add stagger delay based on sibling index
            const parent = entry.target.parentElement;
            if (parent) {
                const siblings = Array.from(parent.children).filter(c => c.classList.contains('product-card') || c.classList.contains('service-card'));
                const idx = siblings.indexOf(entry.target);
                if (idx >= 0) {
                    entry.target.style.setProperty('--stagger-delay', `${idx * 100}ms`);
                }
            }
            entry.target.classList.add('fade-in');
            
            // Special animations for hero elements
            if (entry.target.classList.contains('hero-content')) {
                entry.target.classList.add('slide-in-left');
            } else if (entry.target.classList.contains('hero-image')) {
                entry.target.classList.add('slide-in-right');
            }
            
            // Scroll-reveal elements
            if (entry.target.classList.contains('scroll-reveal')) {
                entry.target.classList.add('revealed');
            }
            
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Enhanced Button Interactions — no delay, ripple is visual only
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-cart');
    if (btn) {
        // Create ripple effect (non-blocking)
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            background: rgba(255,255,255,0.6);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.5s linear;
            left: ${e.offsetX}px;
            top: ${e.offsetY}px;
            width: 20px;
            height: 20px;
            margin-left: -10px;
            margin-top: -10px;
            pointer-events: none;
        `;
        btn.style.position = 'relative';
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 500);
        // Let the <a> navigate naturally — no preventDefault, no setTimeout
    }
});

// Ripple animation CSS
const rippleStyles = document.createElement('style');
rippleStyles.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyles);

// Form validation and interaction helpers
function validatePhone(phone) {
    const phoneRegex = /^(\+51|51)?\s*[9][0-9]{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Page Load + GSAP Animations
document.addEventListener('DOMContentLoaded', () => {
    // Smooth page load fade
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    window.addEventListener('load', () => {
        document.body.style.opacity = '1';
        setTimeout(() => { document.body.classList.add('loaded'); }, 100);
    });

    enhanceWhatsAppLinks();

    // Guard: GSAP might not be loaded yet (CDN delay), wait for it
    function initGSAP() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            setTimeout(initGSAP, 100);
            return;
        }

        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);

        // ── HERO SECTION ──────────────────────────────────────────
        gsap.from('.hero-content', {
            x: -70,
            opacity: 0,
            duration: 1.1,
            ease: 'power4.out',
            delay: 0.2
        });
        gsap.from('.hero-image', {
            x: 70,
            opacity: 0,
            duration: 1.1,
            ease: 'power4.out',
            delay: 0.4
        });

        // ── SECTION HEADERS ───────────────────────────────────────
        gsap.utils.toArray('.section-header').forEach(el => {
            gsap.from(el, {
                scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
                y: 50,
                opacity: 0,
                duration: 0.9,
                ease: 'power3.out'
            });
        });

        // ── PRODUCT CARDS (visible on page load — no ScrollTrigger) ─────
        // These are immediately visible; animate them in with delay after page fade
        window.addEventListener('load', () => {
            const cards = document.querySelectorAll('.product-card');
            gsap.from(cards, {
                y: 50,
                opacity: 0,
                duration: 0.65,
                stagger: { amount: 0.7, from: 'start' },
                delay: 0.5,           // let the page fade-in complete first
                ease: 'power3.out',
                clearProps: 'all'     // remove inline styles after animation
            });
        });

        // ── SERVICE CARDS (alternating left/right) ───────────────
        gsap.utils.toArray('.service-card-detailed').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: { trigger: card, start: 'top bottom', toggleActions: 'play none none none' },
                x: i % 2 === 0 ? -60 : 60,
                opacity: 0,
                duration: 0.8,
                delay: i * 0.1,
                ease: 'power3.out',
                immediateRender: false
            });
        });

        // ── QUOTE STEPS ───────────────────────────────────────────
        // Safety: ensure cards are visible first (GSAP will animate from this)
        gsap.set('.quote-step-card, .quote-cta', { opacity: 1, y: 0, scale: 1, clearProps: 'all' });

        // Animate as a group when parent section enters viewport
        const quoteSection = document.querySelector('.quote-section');
        if (quoteSection) {
            ScrollTrigger.create({
                trigger: quoteSection,
                start: 'top 90%',
                onEnter: () => {
                    gsap.fromTo('.quote-step-card',
                        { opacity: 0, y: 50, scale: 0.95 },
                        { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.18, ease: 'back.out(1.3)' }
                    );
                    gsap.fromTo('.quote-cta',
                        { opacity: 0, y: 25 },
                        { opacity: 1, y: 0, duration: 0.6, delay: 0.55, ease: 'power2.out' }
                    );
                },
                once: true
            });
        }

        // ── STATS BAR ─────────────────────────────────────────────
        gsap.from('.stat-item', {
            scrollTrigger: { trigger: '.stats-bar', start: 'top bottom', toggleActions: 'play none none none' },
            y: 40,
            opacity: 0,
            duration: 0.6,
            stagger: 0.12,
            ease: 'power3.out',
            immediateRender: false
        });

        // ── ABOUT SECTION ─────────────────────────────────────────
        gsap.from('.about-text', {
            scrollTrigger: { trigger: '.about-content', start: 'top bottom', toggleActions: 'play none none none' },
            x: -60,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            immediateRender: false
        });
        gsap.from('.about-slider-container', {
            scrollTrigger: { trigger: '.about-content', start: 'top bottom', toggleActions: 'play none none none' },
            x: 60,
            opacity: 0,
            duration: 1,
            delay: 0.15,
            ease: 'power3.out',
            immediateRender: false
        });

        // ── VALUE CARDS ───────────────────────────────────────────
        gsap.from('.value-card', {
            scrollTrigger: { trigger: '.about-values', start: 'top bottom', toggleActions: 'play none none none' },
            y: 35,
            opacity: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power2.out',
            immediateRender: false
        });

        // ── BRANDS SECTION ────────────────────────────────────────
        gsap.from('.brands-section', {
            scrollTrigger: { trigger: '.brands-section', start: 'top bottom', toggleActions: 'play none none none' },
            opacity: 0,
            duration: 1,
            ease: 'power2.out',
            immediateRender: false
        });

        // ── CONTACT INFO ──────────────────────────────────────────
        gsap.from('.location-section', {
            scrollTrigger: { trigger: '.contact-info', start: 'top bottom', toggleActions: 'play none none none' },
            y: 50,
            opacity: 0,
            duration: 0.7,
            stagger: 0.2,
            ease: 'power3.out',
            immediateRender: false
        });
        gsap.from('.map-section', {
            scrollTrigger: { trigger: '.contact-content', start: 'top bottom', toggleActions: 'play none none none' },
            x: 60,
            opacity: 0,
            duration: 0.9,
            delay: 0.15,
            ease: 'power3.out'
        });

        // ── FAQ ITEMS ─────────────────────────────────────────────
        gsap.from('.faq-item', {
            scrollTrigger: { trigger: '.faq-grid', start: 'top 85%', toggleActions: 'play none none none' },
            y: 30,
            opacity: 0,
            duration: 0.55,
            stagger: 0.1,
            ease: 'power2.out'
        });

        console.log('✨ GSAP animations initialized');
    }

    initGSAP();
});


// Enhanced Scroll Tracking
let ticking = false;

function updateOnScroll() {
    updateActiveLink();
    
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    ticking = false;
}

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateOnScroll);
        ticking = true;
    }
}

window.addEventListener('scroll', requestTick);

// Brands Carousel Touch Support removed to prevent transform override


// Product Search Functionality (Enhanced)
function searchProducts(searchTerm) {
    const products = document.querySelectorAll('.product-card');
    let visibleCount = 0;
    
    products.forEach((product, i) => {
        const productName = product.querySelector('h3').textContent.toLowerCase();
        const productDesc = product.querySelector('p').textContent.toLowerCase();
        
        if (productName.includes(searchTerm.toLowerCase()) || 
            productDesc.includes(searchTerm.toLowerCase())) {
            product.classList.remove('hidden');
            product.style.setProperty('--stagger-delay', `${visibleCount * 80}ms`);
            void product.offsetWidth;
            setTimeout(() => {
                product.classList.add('fade-in');
            }, 10);
            visibleCount++;
        } else {
            product.classList.add('hidden');
            product.classList.remove('fade-in');
        }
    });
    
    // Show message if no products found
    if (visibleCount === 0 && searchTerm.trim() !== '') {
        showNotification('No se encontraron productos con ese término', 'error');
    }
}

// Enhanced WhatsApp Integration
function createWhatsAppMessage(productName = '') {
    const baseMessage = 'Hola, estoy interesado en cotizar productos de Rodrix Steel.';
    if (productName) {
        return `${baseMessage} Específicamente sobre: ${productName}`;
    }
    return baseMessage;
}

// Performance Optimization - Image Lazy Loading
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// Error Handling for Images
document.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
        e.target.style.display = 'none';
        console.warn('Image failed to load:', e.target.src);
    }
}, true);

// Accessibility Enhancements
function enhanceAccessibility() {
    // Add keyboard navigation for mobile menu
    mobileMenu.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            mobileMenu.click();
        }
    });

    // Add focus indicators
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });

    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-nav');
    });
}

// Analytics and Tracking
function trackEvent(eventName, eventData = {}) {
    console.log('Event tracked:', eventName, eventData);
    // Here you can integrate with Google Analytics, Facebook Pixel, etc.
}

// Track WhatsApp clicks
document.addEventListener('click', (e) => {
    if (e.target.closest('a[href*="wa.me"]')) {
        const productName = e.target.closest('.product-card')?.querySelector('h3')?.textContent;
        trackEvent('whatsapp_click', {
            product: productName || 'general',
            source: 'website'
        });
    }
});

// Page Visibility API for performance
document.addEventListener('visibilitychange', () => {
    if (brandsCarousel) {
        if (document.hidden) {
            brandsCarousel.style.animationPlayState = 'paused';
        } else {
            brandsCarousel.style.animationPlayState = 'running';
        }
    }
});

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    lazyLoadImages();
    enhanceAccessibility();
    
    // Initial page load animation
    setTimeout(() => {
        document.querySelectorAll('.hero-content').forEach(el => {
            el.classList.add('slide-in-left');
        });
        
        document.querySelectorAll('.hero-image').forEach(el => {
            el.classList.add('slide-in-right');
        });
    }, 200);
    
    // FAQ Accordion
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', () => {
            const expanded = button.getAttribute('aria-expanded') === 'true';
            
            // Close all other answers
            document.querySelectorAll('.faq-question').forEach(btn => {
                btn.setAttribute('aria-expanded', 'false');
                btn.nextElementSibling.classList.remove('open');
            });
            
            // Toggle current
            if (!expanded) {
                button.setAttribute('aria-expanded', 'true');
                button.nextElementSibling.classList.add('open');
            }
        });
    });

    // Stats Counter Animation
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.stat-number[data-target]');
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target'));
                    const duration = 2000;
                    const startTime = performance.now();
                    
                    function updateCounter(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        // Ease out cubic
                        const eased = 1 - Math.pow(1 - progress, 3);
                        const current = Math.round(eased * target);
                        counter.textContent = current;
                        
                        if (progress < 1) {
                            requestAnimationFrame(updateCounter);
                        }
                    }
                    
                    requestAnimationFrame(updateCounter);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const statsBar = document.querySelector('.stats-bar');
    if (statsBar) {
        statsObserver.observe(statsBar);
    }

    // Observe FAQ and stats for scroll reveal
    document.querySelectorAll('.faq-item, .stat-item, .value-card, .service-card-detailed').forEach(el => {
        el.classList.add('scroll-reveal');
        observer.observe(el);
    });

    console.log('🏗️ Rodrix Steel S.A.C - Website loaded successfully!');
});

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // You can implement a service worker for offline functionality
        console.log('Service Worker support detected');
    });
}

// About Us Image Slider
function initAboutSlider() {
    const slides = document.querySelectorAll('.about-slide');
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    
    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 4000); // Change image every 4 seconds
}

// Initialize slider
document.addEventListener('DOMContentLoaded', () => {
    initAboutSlider();
});

// Export functions for testing
window.RodrixSteel = {
    searchProducts,
    filterProducts,
    showNotification,
    validatePhone,
    validateEmail,
    trackEvent
};

