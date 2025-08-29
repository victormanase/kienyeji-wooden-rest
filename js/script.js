// Navigation Toggle
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Active navigation link
window.addEventListener('load', () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const currentLink = document.querySelector(`.nav-link[href="${currentPage}"]`);
    
    // Remove active class from all links
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Add active class to current page link
    if (currentLink) {
        currentLink.classList.add('active');
    } else if (currentPage === '' || currentPage === '/') {
        document.querySelector('.nav-link[href="index.html"]').classList.add('active');
    }
});

// Smooth scrolling for anchor links
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

// Form Validation
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const phone = formData.get('phone');
        const message = formData.get('message');
        const checkin = formData.get('checkin');
        const checkout = formData.get('checkout');
        
        // Validate required fields
        if (!name || !email || !phone || !message) {
            showAlert('Please fill in all required fields.', 'error');
            return;
        }
        
        // Validate email
        if (!isValidEmail(email)) {
            showAlert('Please enter a valid email address.', 'error');
            return;
        }
        
        // Validate phone
        if (!isValidPhone(phone)) {
            showAlert('Please enter a valid phone number.', 'error');
            return;
        }
        
        // Validate dates
        if (checkin && checkout) {
            const checkinDate = new Date(checkin);
            const checkoutDate = new Date(checkout);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (checkinDate < today) {
                showAlert('Check-in date cannot be in the past.', 'error');
                return;
            }
            
            if (checkoutDate <= checkinDate) {
                showAlert('Check-out date must be after check-in date.', 'error');
                return;
            }
        }
        
        // Show loading state
        setFormLoading(this, true);
        
        // Send form data to server
        fetch('send-email.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            setFormLoading(this, false);
            
            if (data.success) {
                showAlert(data.message, 'success');
                // Clear saved form data
                clearFormData(this);
                // Reset form
                this.reset();
            } else {
                showAlert(data.message || 'An error occurred while sending your message.', 'error');
            }
        })
        .catch(error => {
            setFormLoading(this, false);
            console.error('Error:', error);
            showAlert('Network error. Please check your connection and try again, or contact us directly via phone or WhatsApp.', 'error');
        });
    });
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone validation (basic)
function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[\d\s\-\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

// Alert system
function showAlert(message, type = 'info') {
    // Remove existing alerts
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Create new alert
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <div class="alert-content">
            <span class="alert-message">${message}</span>
            <button class="alert-close">&times;</button>
        </div>
    `;
    
    // Add styles
    alert.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 10000;
        max-width: 400px;
        padding: 1rem;
        border-radius: 5px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease-out;
        ${type === 'success' ? 'background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb;' : ''}
        ${type === 'error' ? 'background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;' : ''}
        ${type === 'info' ? 'background-color: #d1ecf1; color: #0c5460; border: 1px solid #bee5eb;' : ''}
    `;
    
    document.body.appendChild(alert);
    
    // Close button functionality
    const closeBtn = alert.querySelector('.alert-close');
    closeBtn.addEventListener('click', () => {
        alert.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => alert.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => alert.remove(), 300);
        }
    }, 5000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
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
    
    .alert-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .alert-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        margin-left: 1rem;
        opacity: 0.7;
    }
    
    .alert-close:hover {
        opacity: 1;
    }
`;
document.head.appendChild(style);

// WhatsApp Integration
function openWhatsApp(message = '') {
    const phoneNumber = '255757618619'; // WhatsApp number for Kienyeji Wooden Rest
    const defaultMessage = message || 'Hello! I would like to inquire about booking at Kienyeji Wooden Rest.';
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;
    window.open(whatsappURL, '_blank');
}

// Add WhatsApp click handlers
document.addEventListener('DOMContentLoaded', function() {
    const whatsappButtons = document.querySelectorAll('.btn-whatsapp, .whatsapp-btn');
    whatsappButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            openWhatsApp();
        });
    });
});

// Gallery Modal (if gallery exists)
const galleryItems = document.querySelectorAll('.gallery-item');
if (galleryItems.length > 0) {
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            // This would open a modal with the full-size image
            // For now, just showing an alert
            showAlert('Image gallery functionality would be implemented here.', 'info');
        });
    });
}

// Scroll to top functionality
let scrollToTopBtn;

function createScrollToTopButton() {
    scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background-color: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        justify-content: center;
        align-items: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 1000;
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(scrollToTopBtn);
    
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Show/hide scroll to top button
window.addEventListener('scroll', () => {
    if (!scrollToTopBtn) {
        createScrollToTopButton();
    }
    
    if (window.pageYOffset > 300) {
        scrollToTopBtn.style.display = 'flex';
    } else {
        scrollToTopBtn.style.display = 'none';
    }
});

// Loading state for forms
function setFormLoading(form, isLoading) {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        if (isLoading) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="loading"></span> Sending...';
        } else {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Send Booking Request';
        }
    }
}

// Date picker setup
document.addEventListener('DOMContentLoaded', function() {
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        input.setAttribute('min', today);
    });
});

// Form auto-save (localStorage)
const formInputs = document.querySelectorAll('input, textarea, select');
formInputs.forEach(input => {
    const savedValue = localStorage.getItem(`form_${input.name}`);
    if (savedValue && input.type !== 'submit') {
        input.value = savedValue;
    }
    
    input.addEventListener('input', function() {
        if (this.type !== 'submit') {
            localStorage.setItem(`form_${this.name}`, this.value);
        }
    });
});

// Clear form data after successful submission
function clearFormData(form) {
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        if (input.name) {
            localStorage.removeItem(`form_${input.name}`);
        }
    });
}

// Booking quick actions
function quickBook(roomType) {
    const message = `Hello! I would like to book a ${roomType} at Kienyeji Wooden Rest. Please provide me with availability and booking details.`;
    openWhatsApp(message);
}

// Add quick book buttons functionality
document.addEventListener('DOMContentLoaded', function() {
    const quickBookButtons = document.querySelectorAll('[data-room-type]');
    quickBookButtons.forEach(button => {
        button.addEventListener('click', function() {
            const roomType = this.getAttribute('data-room-type');
            quickBook(roomType);
        });
    });
});

// Intersection Observer for animations
if ('IntersectionObserver' in window) {
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
    
    // Observe elements for animation
    document.addEventListener('DOMContentLoaded', function() {
        const animateElements = document.querySelectorAll('.feature-card, .rate-card, .package-card, .accommodation-item');
        animateElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    });
}

// Performance optimization: Lazy loading for images
document.addEventListener('DOMContentLoaded', function() {
    if ('IntersectionObserver' in window) {
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
        
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
});

// Hero Slideshow Functionality
class HeroSlideshow {
    constructor() {
        this.slides = document.querySelectorAll('.hero-slide');
        this.navDots = document.querySelectorAll('.nav-dot');
        this.currentSlide = 0;
        this.slideInterval = null;
        this.autoPlayInterval = 5000; // 5 seconds
        
        this.init();
    }
    
    init() {
        if (this.slides.length === 0) return;
        
        // Set up navigation dots
        this.navDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToSlide(index);
                this.pauseAutoPlay();
                this.resumeAutoPlay();
            });
        });
        
        // Start autoplay
        this.startAutoPlay();
        
        // Pause on hover
        const heroSection = document.querySelector('.hero-modern');
        if (heroSection) {
            heroSection.addEventListener('mouseenter', () => this.pauseAutoPlay());
            heroSection.addEventListener('mouseleave', () => this.resumeAutoPlay());
        }
        
        // Pause when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAutoPlay();
            } else {
                this.resumeAutoPlay();
            }
        });
    }
    
    goToSlide(index) {
        // Remove active class from current slide and dot
        this.slides[this.currentSlide].classList.remove('active');
        this.navDots[this.currentSlide].classList.remove('active');
        
        // Update current slide index
        this.currentSlide = index;
        
        // Add active class to new slide and dot
        this.slides[this.currentSlide].classList.add('active');
        this.navDots[this.currentSlide].classList.add('active');
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }
    
    startAutoPlay() {
        this.slideInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayInterval);
    }
    
    pauseAutoPlay() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
            this.slideInterval = null;
        }
    }
    
    resumeAutoPlay() {
        if (!this.slideInterval) {
            this.startAutoPlay();
        }
    }
}

// Initialize hero slideshow when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new HeroSlideshow();
});

// Smooth scroll for hero scroll indicator
document.addEventListener('DOMContentLoaded', function() {
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const heroSection = document.querySelector('.hero-modern');
            if (heroSection) {
                const nextSection = heroSection.nextElementSibling;
                if (nextSection) {
                    nextSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    }
});

// Add parallax effect to hero background (optional)
function addParallaxEffect() {
    const heroSection = document.querySelector('.hero-modern');
    if (!heroSection) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        
        if (scrolled < window.innerHeight) {
            const yPos = scrolled * parallaxSpeed;
            heroSection.style.transform = `translateY(${yPos}px)`;
        }
    });
}

// Initialize parallax effect
document.addEventListener('DOMContentLoaded', addParallaxEffect);

// Console welcome message
console.log('%c🏡 Welcome to Kienyeji Wooden Rest Website!', 'color: #8B4513; font-size: 16px; font-weight: bold;');
console.log('Your wooden escape in Arusha awaits...');
console.log('%c✨ Modern hero slideshow activated!', 'color: #CD853F; font-size: 12px;');
