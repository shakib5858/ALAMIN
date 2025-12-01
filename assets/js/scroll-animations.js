// Scroll Animation Observer
document.addEventListener('DOMContentLoaded', function() {
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                // Trigger any child animations
                const children = entry.target.querySelectorAll('.animate-on-scroll');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('animate-in');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);

    // Elements to animate on scroll
    const animateElements = document.querySelectorAll(
        '.hero-content, .hero-image, .hero-features li, .hero-buttons .btn, ' +
        '.companies-wrapper, .companies-logos img, ' +
        '.section-label, .services-section h2, .service-card, ' +
        '.about-image, .about-text, .about-text h2, .about-text p, .feature-item, ' +
        '.whitelabel-section h2, .whitelabel-section p, .stat-item, ' +
        '.website-image, .website-text, .stat-box, ' +
        '.testimonials-section h2, .trustpilot-badge, .testimonial-card, ' +
        '.cta-text, .cta-form, .footer-column'
    );

    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });

    // Stagger animations for various elements
    const staggerGroups = [
        { selector: '.hero-features li', delay: 0.1 },
        { selector: '.companies-logos img', delay: 0.08 },
        { selector: '.feature-item', delay: 0.2 },
        { selector: '.service-card', delay: 0.15 },
        { selector: '.testimonial-card', delay: 0.15 },
        { selector: '.stat-item', delay: 0.2 },
        { selector: '.stat-box', delay: 0.15 },
        { selector: '.footer-column', delay: 0.1 }
    ];

    staggerGroups.forEach(group => {
        const elements = document.querySelectorAll(group.selector);
        elements.forEach((el, index) => {
            el.style.transitionDelay = `${index * group.delay}s`;
        });
    });

    // Counter animation for numbers
    const counters = document.querySelectorAll('.stat-number, .badge-number');
    
    const animateCounter = (element) => {
        const target = parseInt(element.textContent.replace(/\D/g, ''));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        const suffix = element.textContent.replace(/[0-9]/g, '');

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current) + suffix;
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + suffix;
            }
        };

        updateCounter();
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    // Add specific animation classes for different effects
    document.querySelectorAll('.hero-content, .about-text, .website-text, .cta-text').forEach(el => {
        el.classList.add('slide-right');
    });

    document.querySelectorAll('.hero-image, .website-image').forEach(el => {
        el.classList.add('slide-left');
    });

    // Special animation for about-image with zoom effect
    document.querySelectorAll('.about-image').forEach(el => {
        el.classList.add('zoom-slide');
    });

    document.querySelectorAll('.service-card, .testimonial-card').forEach(el => {
        el.classList.add('scale-up');
    });

    document.querySelectorAll('.companies-logos img').forEach(el => {
        el.classList.add('fade-in');
    });

    document.querySelectorAll('.stat-item, .stat-box').forEach(el => {
        el.classList.add('bounce-in');
    });
});


// Parallax effect for hero section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const heroSection = document.querySelector('.hero-section');
    const heroImage = document.querySelector('.hero-image');
    
    if (heroSection && scrolled < heroSection.offsetHeight) {
        if (heroImage) {
            heroImage.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Add hover animation to cards
const cards = document.querySelectorAll('.service-card, .testimonial-card, .feature-item');
cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});


// Background parallax effects for sections
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    
    // Hero section parallax
    const heroSection = document.querySelector('.hero-section');
    if (heroSection && scrolled < heroSection.offsetHeight) {
        const heroImage = document.querySelector('.hero-image');
        if (heroImage) {
            heroImage.style.transform = `translateY(${scrolled * 0.2}px)`;
        }
        
        // Parallax for hero decorative shapes
        const heroBefore = heroSection;
        if (heroBefore) {
            heroBefore.style.setProperty('--scroll-offset', `${scrolled * 0.1}px`);
        }
    }
    
    // About section parallax
    const aboutSection = document.querySelector('.about-section');
    if (aboutSection) {
        const rect = aboutSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            const aboutImage = document.querySelector('.about-image');
            if (aboutImage) {
                const offset = (window.innerHeight - rect.top) * 0.05;
                aboutImage.style.transform = `translateY(${offset}px)`;
            }
        }
    }
    
    // Services section cards parallax
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            const offset = (window.innerHeight - rect.top) * 0.02;
            card.style.transform = `translateY(${offset}px)`;
        }
    });
});

// Add entrance animations for section backgrounds
const sections = document.querySelectorAll('.services-section, .about-section, .whitelabel-section, .website-section, .testimonials-section, .cta-section');
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('section-visible');
        }
    });
}, { threshold: 0.1 });

sections.forEach(section => sectionObserver.observe(section));

// Animate numbers on scroll
function animateValue(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    const suffix = element.textContent.replace(/[0-9]/g, '');
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            element.textContent = end + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, 16);
}

// Enhanced hover effects
document.querySelectorAll('.service-card, .testimonial-card, .stat-box').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-12px) scale(1.02)';
        this.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Smooth reveal for images
const images = document.querySelectorAll('img');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'scale(1)';
        }
    });
}, { threshold: 0.1 });

images.forEach(img => {
    img.style.opacity = '0';
    img.style.transform = 'scale(0.95)';
    img.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    imageObserver.observe(img);
});

// Add ripple effect on button clicks
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});
