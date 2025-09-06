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
        
        // Reset classes first
        product.classList.remove('hidden', 'fade-in');
        
        if (category === 'all' || productCategory === category) {
            // Show the product
            product.style.display = 'block';
            setTimeout(() => {
                product.classList.add('fade-in');
            }, visibleIndex * 100); // Stagger animation
            visibleIndex++;
        } else {
            // Hide the product
            product.style.display = 'none';
        }
    });
    
    // Debug log
    console.log(`Filtered by category: ${category}, visible products: ${visibleIndex}`);
}

// Smooth scrolling for anchor links with GSAP-like functionality
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            return;
        }
        
        const target = document.querySelector(targetId);
        if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
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

// Brands Carousel Enhanced Interaction
if (brandsCarousel) {
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationSpeed = 1;

    // Mouse events for carousel
    brandsCarousel.addEventListener('mousedown', (e) => {
        isDragging = true;
        startPos = e.clientX;
        brandsCarousel.style.cursor = 'grabbing';
        brandsCarousel.style.animationPlayState = 'paused';
        e.preventDefault();
    });

    brandsCarousel.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const currentPosition = e.clientX;
            currentTranslate = prevTranslate + (currentPosition - startPos) * 0.5;
            brandsCarousel.style.transform = `translateX(${currentTranslate}px)`;
        }
    });

    brandsCarousel.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            brandsCarousel.style.cursor = 'grab';
            prevTranslate = currentTranslate;
            brandsCarousel.style.animationPlayState = 'running';
        }
    });

    brandsCarousel.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
            brandsCarousel.style.cursor = 'grab';
            brandsCarousel.style.animationPlayState = 'running';
        }
    });

    // Pause animation on hover
    brandsCarousel.addEventListener('mouseenter', () => {
        if (!isDragging) {
            brandsCarousel.style.animationPlayState = 'paused';
        }
    });

    brandsCarousel.addEventListener('mouseleave', () => {
        if (!isDragging) {
            brandsCarousel.style.animationPlayState = 'running';
        }
    });
}

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
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            
            // Special animations for different elements
            if (entry.target.classList.contains('hero-content')) {
                entry.target.classList.add('slide-in-left');
            } else if (entry.target.classList.contains('hero-image')) {
                entry.target.classList.add('slide-in-right');
            }
        }
    });
}, observerOptions);

// Enhanced Button Interactions
document.addEventListener('click', (e) => {
    if (e.target.closest('.btn-cart')) {
        e.preventDefault();
        const productCard = e.target.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;
        
        // Create ripple effect
        const btn = e.target.closest('.btn-cart');
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            background: rgba(255,255,255,0.6);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
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
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
        
        // Navigate to WhatsApp after animation
        setTimeout(() => {
            window.open(e.target.closest('.btn-cart').href, '_blank');
        }, 200);
        
        showNotification(`Redirigiendo para cotizar: ${productName}`, 'success');
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

// Page Load Animations
document.addEventListener('DOMContentLoaded', () => {
    // Initialize animations
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);

    // Observe elements for animation
    document.querySelectorAll('.product-card, .service-card, .hero-content, .hero-image, .about-text, .about-image').forEach(element => {
        observer.observe(element);
    });

    // Enhance WhatsApp links
    enhanceWhatsAppLinks();

    // Add loading class to body
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    window.addEventListener('load', () => {
        document.body.style.opacity = '1';
    });
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

// Brands Carousel Touch Support
if (brandsCarousel) {
    let startTouchX = 0;
    let currentX = 0;
    
    brandsCarousel.addEventListener('touchstart', (e) => {
        startTouchX = e.touches[0].clientX;
        brandsCarousel.style.animationPlayState = 'paused';
    }, { passive: true });
    
    brandsCarousel.addEventListener('touchmove', (e) => {
        currentX = e.touches[0].clientX;
        const diff = currentX - startTouchX;
        brandsCarousel.style.transform = `translateX(${diff * 0.5}px)`;
    }, { passive: true });
    
    brandsCarousel.addEventListener('touchend', () => {
        brandsCarousel.style.animationPlayState = 'running';
        brandsCarousel.style.transform = 'translateX(0)';
    });
}

// Product Search Functionality (Enhanced)
function searchProducts(searchTerm) {
    const products = document.querySelectorAll('.product-card');
    let visibleCount = 0;
    
    products.forEach(product => {
        const productName = product.querySelector('h3').textContent.toLowerCase();
        const productDesc = product.querySelector('p').textContent.toLowerCase();
        
        if (productName.includes(searchTerm.toLowerCase()) || 
            productDesc.includes(searchTerm.toLowerCase())) {
            product.classList.remove('hidden');
            setTimeout(() => {
                product.classList.add('fade-in');
            }, visibleCount * 100);
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
    
    console.log('🏗️ Rodrix Steel S.A.C - Website loaded successfully!');
});

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // You can implement a service worker for offline functionality
        console.log('Service Worker support detected');
    });
}

// Export functions for testing
window.RodrixSteel = {
    searchProducts,
    filterProducts,
    showNotification,
    validatePhone,
    validateEmail,
    trackEvent
};
