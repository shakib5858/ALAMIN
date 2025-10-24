// FSPTEAM - Digital Marketing Agency Website JavaScript
// Main functionality for responsive menu, smooth scroll, testimonials, and form validation

document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            
            // Update ARIA attributes for accessibility
            const isExpanded = navLinks.classList.contains('active');
            mobileMenuToggle.setAttribute('aria-expanded', isExpanded);
        });
        
        // Close mobile menu when clicking on a link
        const navLinkItems = navLinks.querySelectorAll('a');
        navLinkItems.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenuToggle.contains(event.target) && !navLinks.contains(event.target)) {
                navLinks.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
    
    // Smooth Scroll for Anchor Links
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Active Navigation Link Highlighting
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id], main[id]');
        const navLinks = document.querySelectorAll('.nav-links a');
        
        let current = '';
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
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
    
    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
    
    // Testimonial Slider
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.dot');
    let currentTestimonial = 0;
    let testimonialInterval;
    
    function showTestimonial(index) {
        // Hide all testimonials
        testimonials.forEach(testimonial => {
            testimonial.classList.remove('active');
        });
        
        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show current testimonial and activate corresponding dot
        if (testimonials[index]) {
            testimonials[index].classList.add('active');
        }
        if (dots[index]) {
            dots[index].classList.add('active');
        }
    }
    
    function nextTestimonial() {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }
    
    function startTestimonialSlider() {
        if (testimonials.length > 1) {
            testimonialInterval = setInterval(nextTestimonial, 5000); // Change every 5 seconds
        }
    }
    
    function stopTestimonialSlider() {
        if (testimonialInterval) {
            clearInterval(testimonialInterval);
        }
    }
    
    // Initialize testimonial slider
    if (testimonials.length > 0) {
        showTestimonial(0);
        startTestimonialSlider();
        
        // Add click handlers to dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentTestimonial = index;
                showTestimonial(currentTestimonial);
                stopTestimonialSlider();
                startTestimonialSlider(); // Restart the timer
            });
        });
        
        // Pause slider on hover
        const testimonialSlider = document.querySelector('.testimonial-slider');
        if (testimonialSlider) {
            testimonialSlider.addEventListener('mouseenter', stopTestimonialSlider);
            testimonialSlider.addEventListener('mouseleave', startTestimonialSlider);
        }
    }
    
    // Enhanced Contact Form Validation
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        // Character counter for message field
        const messageField = document.getElementById('message');
        const charCount = document.getElementById('char-count');
        
        if (messageField && charCount) {
            messageField.addEventListener('input', function() {
                const currentLength = this.value.length;
                charCount.textContent = currentLength;
                
                // Change color based on character count
                if (currentLength > 450) {
                    charCount.style.color = '#e74c3c';
                } else if (currentLength > 350) {
                    charCount.style.color = '#f39c12';
                } else {
                    charCount.style.color = '#999';
                }
            });
        }
        
        // Enhanced form submission
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form elements
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const phone = document.getElementById('phone');
            const company = document.getElementById('company');
            const service = document.getElementById('service');
            const budget = document.getElementById('budget');
            const message = document.getElementById('message');
            const submitBtn = contactForm.querySelector('.enhanced-submit-btn');
            
            // Reset previous errors
            clearFormErrors();
            
            let isValid = true;
            
            // Validate name
            if (!name.value.trim()) {
                showFormError('name', 'Name is required');
                isValid = false;
            } else if (name.value.trim().length < 2) {
                showFormError('name', 'Name must be at least 2 characters long');
                isValid = false;
            }
            
            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email.value.trim()) {
                showFormError('email', 'Email is required');
                isValid = false;
            } else if (!emailRegex.test(email.value.trim())) {
                showFormError('email', 'Please enter a valid email address');
                isValid = false;
            }
            
            // Validate phone (optional but format check if provided)
            if (phone.value.trim() && phone.value.trim().length < 10) {
                showFormError('phone', 'Please enter a valid phone number');
                isValid = false;
            }
            
            // Validate message
            if (!message.value.trim()) {
                showFormError('message', 'Message is required');
                isValid = false;
            } else if (message.value.trim().length < 10) {
                showFormError('message', 'Message must be at least 10 characters long');
                isValid = false;
            } else if (message.value.trim().length > 500) {
                showFormError('message', 'Message must be less than 500 characters');
                isValid = false;
            }
            
            // If form is valid, show loading state and submit
            if (isValid) {
                // Show loading state
                submitBtn.classList.add('loading');
                submitBtn.disabled = true;
                
                // Simulate form submission delay
                setTimeout(() => {
                    // Hide loading state
                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;
                    
                    // Show success message
                    showFormSuccess();
                    contactForm.reset();
                    
                    // Reset character counter
                    if (charCount) {
                        charCount.textContent = '0';
                        charCount.style.color = '#999';
                    }
                    
                    // Log form submission for tracking (simulate pixel tracking)
                    console.log('Enhanced contact form submitted:', {
                        name: name.value.trim(),
                        email: email.value.trim(),
                        phone: phone.value.trim(),
                        company: company.value.trim(),
                        service: service.value,
                        budget: budget.value,
                        message: message.value.trim(),
                        timestamp: new Date().toISOString(),
                        userAgent: navigator.userAgent,
                        pageUrl: window.location.href
                    });
                    
                    // Here you would typically send the data to your server
                    // Example: fetch('/submit-form', { method: 'POST', body: formData })
                    
                }, 1500); // Simulate 1.5 second processing time
            } else {
                // Scroll to first error
                const firstError = contactForm.querySelector('.form-error[style*="block"]');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
        
        // Enhanced input interactions
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            // Add focus/blur animations
            input.addEventListener('focus', function() {
                this.parentNode.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                if (!this.value) {
                    this.parentNode.classList.remove('focused');
                }
            });
            
            // Real-time validation feedback
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    this.classList.remove('error');
                    this.style.borderColor = '#e1e8ed';
                    const errorElement = this.parentNode.parentNode.querySelector('.form-error');
                    if (errorElement) {
                        errorElement.style.display = 'none';
                    }
                }
            });
        });
    }
    
    // Form validation helper functions
    function showFormError(fieldName, message) {
        const field = document.getElementById(fieldName);
        const errorElement = field.parentNode.querySelector('.form-error');
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
        
        field.classList.add('error');
        field.style.borderColor = '#e74c3c';
    }
    
    function clearFormErrors() {
        const errorElements = document.querySelectorAll('.form-error');
        const formFields = document.querySelectorAll('.form-group input, .form-group textarea');
        
        errorElements.forEach(error => {
            error.style.display = 'none';
        });
        
        formFields.forEach(field => {
            field.classList.remove('error');
            field.style.borderColor = '#e1e8ed';
        });
        
        // Hide success message
        const successElement = document.querySelector('.form-success');
        if (successElement) {
            successElement.style.display = 'none';
        }
    }
    
    function showFormSuccess() {
        const successElement = document.querySelector('.form-success, .enhanced-success');
        if (successElement) {
            successElement.style.display = 'block';
            successElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Add celebration effect
            setTimeout(() => {
                successElement.style.animation = 'successSlide 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            }, 100);
        }
    }
    
    // Enhanced form interaction effects
    function addFormEnhancements() {
        // Add floating label effect
        const inputWrappers = document.querySelectorAll('.input-wrapper, .select-wrapper');
        inputWrappers.forEach(wrapper => {
            const input = wrapper.querySelector('input, select');
            if (input && input.value) {
                wrapper.classList.add('has-value');
            }
            
            if (input) {
                input.addEventListener('input', function() {
                    if (this.value) {
                        wrapper.classList.add('has-value');
                    } else {
                        wrapper.classList.remove('has-value');
                    }
                });
            }
        });
        
        // Add ripple effect to buttons
        const buttons = document.querySelectorAll('.enhanced-submit-btn');
        buttons.forEach(button => {
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
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }
    
    // Initialize form enhancements
    addFormEnhancements();
    
    // "Book a Call" Button Click Tracking
    const bookCallButtons = document.querySelectorAll('.btn[href*="call"], .btn[onclick*="call"], .book-call-btn');
    bookCallButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Log the click for tracking purposes (simulate pixel tracking)
            console.log('Book a Call button clicked:', {
                buttonText: this.textContent.trim(),
                buttonLocation: getButtonLocation(this),
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                pageUrl: window.location.href
            });
            
            // Here you would typically fire your Facebook Pixel or Google Analytics event
            // Example: fbq('track', 'Lead');
            // Example: gtag('event', 'generate_lead', { 'currency': 'USD', 'value': 0.00 });
        });
    });
    
    // Get Free Audit Button Click Tracking
    const auditButtons = document.querySelectorAll('.btn[href*="audit"], .btn[onclick*="audit"], .get-audit-btn');
    auditButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Log the click for tracking purposes
            console.log('Get Free Audit button clicked:', {
                buttonText: this.textContent.trim(),
                buttonLocation: getButtonLocation(this),
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                pageUrl: window.location.href
            });
            
            // Here you would typically fire your tracking pixels
            // Example: fbq('track', 'Lead');
        });
    });
    
    // Helper function to determine button location on page
    function getButtonLocation(button) {
        const rect = button.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        return {
            x: rect.left,
            y: rect.top + scrollTop,
            section: getClosestSection(button)
        };
    }
    
    function getClosestSection(element) {
        let current = element;
        while (current && current !== document.body) {
            if (current.tagName === 'SECTION' || current.classList.contains('hero') || current.classList.contains('section')) {
                return current.id || current.className;
            }
            current = current.parentElement;
        }
        return 'unknown';
    }
    
    // Scroll animations (fade in elements when they come into view)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    const animateElements = document.querySelectorAll('.service-card, .team-member, .testimonial-slider');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Header scroll effect
    const header = document.querySelector('header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = '#fff';
            header.style.backdropFilter = 'none';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Enhanced contact page functionality
    if (window.location.pathname.includes('contact.html')) {
        // Progressive form reveal animation
        const formGroups = document.querySelectorAll('.form-group');
        formGroups.forEach((group, index) => {
            group.style.opacity = '0';
            group.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                group.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                group.style.opacity = '1';
                group.style.transform = 'translateY(0)';
            }, index * 100);
        });
        
        // Enhanced contact card animations
        const contactCards = document.querySelectorAll('.compact-contact-card, .map-info-card');
        contactCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
                this.style.boxShadow = '0 15px 50px rgba(0,0,0,0.15)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 8px 30px rgba(0,0,0,0.1)';
            });
        });
        
        // Contact method hover effects
        const contactMethods = document.querySelectorAll('.contact-method');
        contactMethods.forEach(method => {
            method.addEventListener('mouseenter', function() {
                const icon = this.querySelector('.method-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.1)';
                    icon.style.background = 'linear-gradient(135deg, #0b66ff, #00c48c)';
                    icon.style.color = 'white';
                }
            });
            
            method.addEventListener('mouseleave', function() {
                const icon = this.querySelector('.method-icon');
                if (icon) {
                    icon.style.transform = 'scale(1)';
                    icon.style.background = 'rgba(11, 102, 255, 0.1)';
                    icon.style.color = '#0b66ff';
                }
            });
        });
        
        // FAQ item interactions
        const faqItems = document.querySelectorAll('.compact-faq-item');
        faqItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                const icon = this.querySelector('.faq-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.1) rotate(5deg)';
                }
            });
            
            item.addEventListener('mouseleave', function() {
                const icon = this.querySelector('.faq-icon');
                if (icon) {
                    icon.style.transform = 'scale(1) rotate(0deg)';
                }
            });
        });
        
        // Compact stats hover effects
        const compactStats = document.querySelectorAll('.compact-stat');
        compactStats.forEach(stat => {
            stat.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-3px) scale(1.02)';
            });
            
            stat.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
        
        // Map placeholder interaction
        const mapPlaceholder = document.querySelector('.compact-map-placeholder');
        if (mapPlaceholder) {
            mapPlaceholder.addEventListener('click', function() {
                // Add a subtle pulse effect when clicked
                const icon = this.querySelector('.map-placeholder-icon');
                if (icon) {
                    icon.style.animation = 'none';
                    setTimeout(() => {
                        icon.style.animation = 'floating 3s ease-in-out infinite, pulse 0.6s ease-out';
                    }, 10);
                }
            });
        }
        
        // Office hours highlight current day
        const now = new Date();
        const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const hoursItems = document.querySelectorAll('.hours-item');
        
        hoursItems.forEach((item, index) => {
            // Highlight current day (assuming Mon-Fri is first item, Saturday is second)
            if ((currentDay >= 1 && currentDay <= 5 && index === 0) || 
                (currentDay === 6 && index === 1)) {
                item.style.background = 'rgba(11, 102, 255, 0.05)';
                item.style.borderRadius = '6px';
                item.style.padding = '0.8rem 1rem';
                item.style.margin = '0 -1rem';
                
                const label = item.querySelector('.hours-label');
                const value = item.querySelector('.hours-value');
                if (label) label.style.color = '#0b66ff';
                if (value) value.style.color = '#0b66ff';
            }
        });
        
        // Add copy to clipboard functionality for contact info
        const methodValues = document.querySelectorAll('.method-value');
        methodValues.forEach(value => {
            value.style.cursor = 'pointer';
            value.title = 'Click to copy';
            
            value.addEventListener('click', function() {
                const text = this.textContent.trim();
                navigator.clipboard.writeText(text).then(() => {
                    // Show temporary feedback
                    const originalText = this.textContent;
                    this.textContent = 'Copied!';
                    this.style.color = '#00c48c';
                    
                    setTimeout(() => {
                        this.textContent = originalText;
                        this.style.color = '#2c3e50';
                    }, 1500);
                }).catch(() => {
                    console.log('Copy to clipboard not supported');
                });
            });
        });
    }
    
    // Add scroll-triggered animations for all pages
    const globalObserverOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const globalObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, globalObserverOptions);
    
    // Observe elements for scroll animations
    const globalAnimateElements = document.querySelectorAll('.compact-service-card, .compact-team-card, .compact-value-card, .compact-faq-item, .compact-mission-card');
    globalAnimateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        globalObserver.observe(el);
    });
    
    // Initialize page
    console.log('FSPTEAM website initialized successfully with enhanced features and animations');
    
    // Add event listener for page visibility changes (for analytics)
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            console.log('Page hidden - user switched tabs or minimized');
        } else {
            console.log('Page visible - user returned to tab');
        }
    });
    
});

// Utility function to simulate loading states
function showLoading(element) {
    element.style.opacity = '0.6';
    element.style.pointerEvents = 'none';
}

function hideLoading(element) {
    element.style.opacity = '1';
    element.style.pointerEvents = 'auto';
}

// Function to handle external link clicks (for tracking)
function trackExternalLink(url, linkText) {
    console.log('External link clicked:', {
        url: url,
        linkText: linkText,
        timestamp: new Date().toISOString()
    });
    
    // Here you would fire your tracking pixels for external link clicks
    // Example: gtag('event', 'click', { 'event_category': 'outbound', 'event_label': url });
}

// Add click tracking to external links
document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (link && link.hostname !== window.location.hostname) {
        trackExternalLink(link.href, link.textContent.trim());
    }
});

/* 
 * TRACKING PIXEL INTEGRATION POINTS
 * 
 * Facebook Pixel Integration:
 * Add this code to the <head> section of each HTML file:
 * 
 * <!-- Facebook Pixel Code -->
 * <script>
 *   !function(f,b,e,v,n,t,s)
 *   {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
 *   n.callMethod.apply(n,arguments):n.queue.push(arguments)};
 *   if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
 *   n.queue=[];t=b.createElement(e);t.async=!0;
 *   t.src=v;s=b.getElementsByTagName(e)[0];
 *   s.parentNode.insertBefore(t,s)}(window, document,'script',
 *   'https://connect.facebook.net/en_US/fbevents.js');
 *   fbq('init', 'YOUR_PIXEL_ID');
 *   fbq('track', 'PageView');
 * </script>
 * <noscript><img height="1" width="1" style="display:none"
 *   src="https://www.facebook.com/tr?id=YOUR_PIXEL_ID&ev=PageView&noscript=1"
 * /></noscript>
 * <!-- End Facebook Pixel Code -->
 * 
 * Google Analytics 4 Integration:
 * Add this code to the <head> section of each HTML file:
 * 
 * <!-- Google tag (gtag.js) -->
 * <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
 * <script>
 *   window.dataLayer = window.dataLayer || [];
 *   function gtag(){dataLayer.push(arguments);}
 *   gtag('js', new Date());
 *   gtag('config', 'GA_MEASUREMENT_ID');
 * </script>
 * 
 * Google Tag Manager Integration:
 * Add this code to the <head> section:
 * 
 * <!-- Google Tag Manager -->
 * <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
 * new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
 * j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
 * 'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
 * })(window,document,'script','dataLayer','GTM-XXXXXXX');</script>
 * <!-- End Google Tag Manager -->
 * 
 * And this code immediately after the opening <body> tag:
 * 
 * <!-- Google Tag Manager (noscript) -->
 * <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
 * height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
 * <!-- End Google Tag Manager (noscript) -->
 */
