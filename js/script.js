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
        this.autoPlayInterval = 60000; // 60 seconds (1 minute)
        
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

// Review System
class ReviewSystem {
    constructor() {
        this.reviews = [];
        this.storageKey = 'kienyeji-reviews';
        this.currentReviewIndex = 0;
        this.autoRotateInterval = null;
        this.autoRotateDelay = 8000; // 8 seconds per review
        this.progressInterval = null;
        this.init();
    }

    async init() {
        await this.loadReviews();
        this.displayReviews();
        this.setupForm();
    }

    async loadReviews() {
        try {
            // Try to load from localStorage first
            const localReviews = localStorage.getItem(this.storageKey);
            if (localReviews) {
                this.reviews = JSON.parse(localReviews);
                // Filter out test reviews
                this.reviews = this.filterValidReviews(this.reviews);
                return;
            }

            // If no local reviews, load from JSON file
            const response = await fetch('data/reviews.json');
            if (response.ok) {
                this.reviews = await response.json();
                // Filter out test reviews
                this.reviews = this.filterValidReviews(this.reviews);
                // Save to localStorage for future use
                this.saveReviewsToStorage();
            } else {
                console.warn('Could not load reviews data');
                this.reviews = [];
            }
        } catch (error) {
            console.error('Error loading reviews:', error);
            this.reviews = [];
        }
    }

    filterValidReviews(reviews) {
        // Filter out test reviews and reviews by Victor or similar test names
        const excludeNames = ['victor', 'test', 'admin', 'demo'];
        return reviews.filter(review => {
            const name = review.name.toLowerCase().trim();
            return !excludeNames.some(excludeName => name.includes(excludeName));
        });
    }

    saveReviewsToStorage() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.reviews));
        } catch (error) {
            console.error('Error saving reviews to localStorage:', error);
        }
    }

    displayReviews() {
        const reviewsList = document.getElementById('reviews-list');
        if (!reviewsList) return;

        if (this.reviews.length === 0) {
            reviewsList.innerHTML = `
                <div class="review-card">
                    <div class="no-reviews">
                        <p>No reviews yet. Be the first to share your experience!</p>
                    </div>
                </div>
            `;
            return;
        }

        // Sort reviews by date (newest first)
        const sortedReviews = [...this.reviews].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Display all reviews for carousel
        reviewsList.innerHTML = sortedReviews.map(review => this.createReviewCard(review)).join('');
        
        // Setup carousel functionality
        this.setupCarousel();
        this.startAutoRotation();
    }

    createReviewCard(review) {
        const stars = this.generateStars(review.rating);
        const formattedDate = this.formatDate(review.date);
        
        return `
            <div class="review-card">
                <div class="review-header">
                    <div class="reviewer-info">
                        <h4>${this.escapeHtml(review.name)}</h4>
                        <div class="review-date">${formattedDate}</div>
                    </div>
                    <div class="review-rating">
                        ${stars}
                    </div>
                </div>
                <p class="review-comment">"${this.escapeHtml(review.comment)}"</p>
                ${review.verified ? '<span class="review-verified"><i class="fas fa-check-circle"></i> Verified Stay</span>' : ''}
            </div>
        `;
    }

    generateStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            stars += `<span class="star ${i <= rating ? '' : 'empty'}">★</span>`;
        }
        return stars;
    }

    formatDate(dateString) {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            return dateString;
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    setupForm() {
        const reviewForm = document.getElementById('review-form');
        if (!reviewForm) return;

        reviewForm.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Add real-time validation
        const inputs = reviewForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    this.validateField(input);
                }
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove existing error classes
        field.classList.remove('error');
        this.removeFieldError(field);

        // Validate based on field type
        switch (field.type) {
            case 'text':
                if (field.name === 'name' && (!value || value.length < 2)) {
                    isValid = false;
                    errorMessage = 'Please enter your full name (at least 2 characters)';
                }
                break;
            case 'email':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Email is required';
                } else if (!this.isValidEmail(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;
            default:
                if (field.hasAttribute('required') && !value) {
                    isValid = false;
                    errorMessage = `${field.previousElementSibling.textContent} is required`;
                }
        }

        // Special validation for textarea
        if (field.tagName === 'TEXTAREA' && field.name === 'comment') {
            if (!value) {
                isValid = false;
                errorMessage = 'Please write your review';
            } else if (value.length < 10) {
                isValid = false;
                errorMessage = 'Please write at least 10 characters for your review';
            } else if (value.length > 500) {
                isValid = false;
                errorMessage = 'Review must be less than 500 characters';
            }
        }

        if (!isValid) {
            field.classList.add('error');
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    showFieldError(field, message) {
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.style.cssText = `
                color: #dc3545;
                font-size: 0.85rem;
                margin-top: 0.25rem;
                display: block;
            `;
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    removeFieldError(field) {
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        
        // Validate all fields
        const inputs = form.querySelectorAll('input, select, textarea');
        let isFormValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            showAlert('Please correct the errors in the form before submitting.', 'error');
            return;
        }

        // Check if this is a test review
        const name = formData.get('name').trim().toLowerCase();
        const excludeNames = ['victor', 'test', 'admin', 'demo'];
        if (excludeNames.some(excludeName => name.includes(excludeName))) {
            showAlert('Test reviews are not allowed. Please use your real name.', 'error');
            return;
        }

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading"></span> Submitting...';

        try {
            // Create new review object
            const newReview = {
                id: Date.now().toString(),
                name: formData.get('name').trim(),
                email: formData.get('email').trim(),
                rating: parseInt(formData.get('rating')),
                comment: formData.get('comment').trim(),
                date: new Date().toISOString().split('T')[0],
                verified: false // New reviews are not verified by default
            };

            // Add to reviews array
            this.reviews.unshift(newReview);
            
            // Apply filtering to ensure no test reviews are included
            this.reviews = this.filterValidReviews(this.reviews);
            
            // Save to localStorage
            this.saveReviewsToStorage();
            
            // Refresh display
            this.displayReviews();
            
            // Show success message
            showAlert('Thank you for your review! It has been submitted successfully and will appear on our home page.', 'success');
            
            // Reset form
            form.reset();
            
            // If we're on home page, scroll to reviews, otherwise suggest visiting home page
            const reviewsList = document.getElementById('reviews-list');
            if (reviewsList) {
                setTimeout(() => {
                    reviewsList.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 1000);
            } else {
                // We're on about page, show a message suggesting to visit home page
                setTimeout(() => {
                    showAlert('Visit our <a href="index.html#reviews" style="color: var(--primary-color); text-decoration: underline;">home page</a> to see your review along with others!', 'info');
                }, 2000);
            }
            
        } catch (error) {
            console.error('Error submitting review:', error);
            showAlert('There was an error submitting your review. Please try again.', 'error');
        } finally {
            // Restore button state
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    setupCarousel() {
        if (this.reviews.length <= 1) return;

        // Create navigation dots
        const navigation = document.getElementById('reviews-navigation');
        if (navigation) {
            navigation.innerHTML = this.reviews.map((_, index) => 
                `<div class="reviews-nav-dot ${index === 0 ? 'active' : ''}" data-index="${index}"></div>`
            ).join('');

            // Add click handlers for dots
            navigation.addEventListener('click', (e) => {
                if (e.target.classList.contains('reviews-nav-dot')) {
                    const index = parseInt(e.target.dataset.index);
                    this.goToReview(index);
                    this.resetAutoRotation();
                }
            });
        }

        // Setup prev/next buttons
        const prevBtn = document.getElementById('reviews-prev');
        const nextBtn = document.getElementById('reviews-next');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.previousReview();
                this.resetAutoRotation();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.nextReview();
                this.resetAutoRotation();
            });
        }

        // Pause on hover
        const carousel = document.getElementById('reviews-carousel-container');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => this.pauseAutoRotation());
            carousel.addEventListener('mouseleave', () => this.resumeAutoRotation());
        }
    }

    goToReview(index) {
        this.currentReviewIndex = index;
        const carousel = document.getElementById('reviews-list');
        const navigation = document.getElementById('reviews-navigation');
        
        if (carousel) {
            carousel.style.transform = `translateX(-${index * 100}%)`;
        }

        // Update navigation dots
        if (navigation) {
            const dots = navigation.querySelectorAll('.reviews-nav-dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        }
    }

    nextReview() {
        const nextIndex = (this.currentReviewIndex + 1) % this.reviews.length;
        this.goToReview(nextIndex);
    }

    previousReview() {
        const prevIndex = this.currentReviewIndex === 0 ? this.reviews.length - 1 : this.currentReviewIndex - 1;
        this.goToReview(prevIndex);
    }

    startAutoRotation() {
        if (this.reviews.length <= 1) return;

        this.autoRotateInterval = setInterval(() => {
            this.nextReview();
        }, this.autoRotateDelay);

        this.startProgressAnimation();
    }

    pauseAutoRotation() {
        if (this.autoRotateInterval) {
            clearInterval(this.autoRotateInterval);
            this.autoRotateInterval = null;
        }
        this.stopProgressAnimation();
    }

    resumeAutoRotation() {
        if (!this.autoRotateInterval && this.reviews.length > 1) {
            this.startAutoRotation();
        }
    }

    resetAutoRotation() {
        this.pauseAutoRotation();
        setTimeout(() => {
            this.resumeAutoRotation();
        }, 1000); // Wait 1 second before resuming
    }

    startProgressAnimation() {
        const progressBar = document.getElementById('reviews-progress');
        if (!progressBar) return;

        progressBar.style.width = '0%';
        progressBar.style.transition = 'none';
        
        setTimeout(() => {
            progressBar.style.transition = `width ${this.autoRotateDelay}ms linear`;
            progressBar.style.width = '100%';
        }, 50);
    }

    stopProgressAnimation() {
        const progressBar = document.getElementById('reviews-progress');
        if (progressBar) {
            progressBar.style.width = '0%';
            progressBar.style.transition = 'none';
        }
    }

    // Public method to get review statistics
    getStats() {
        if (this.reviews.length === 0) {
            return { totalReviews: 0, averageRating: 0 };
        }

        const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = (totalRating / this.reviews.length).toFixed(1);
        
        return {
            totalReviews: this.reviews.length,
            averageRating: parseFloat(averageRating)
        };
    }
}

// Initialize review system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize on home page (has reviews display)
    if (document.getElementById('reviews')) {
        window.reviewSystem = new ReviewSystem();
    }
    // Initialize on about page (has share experience form)
    else if (document.getElementById('share-experience')) {
        window.reviewSystem = new ReviewSystem();
    }
});

// Console welcome message
console.log('%c🏡 Welcome to Kienyeji Wooden Rest Website!', 'color: #8B4513; font-size: 16px; font-weight: bold;');
console.log('Your wooden escape in Arusha awaits...');
console.log('%c✨ Modern hero slideshow activated!', 'color: #CD853F; font-size: 12px;');
console.log('%c⭐ Reviews carousel system loaded!', 'color: #CD853F; font-size: 12px;');
