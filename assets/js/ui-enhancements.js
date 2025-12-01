// UI/UX Enhancements
document.addEventListener('DOMContentLoaded', function() {
    
    // Scroll to top button
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollToTopBtn);
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });
    
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Reading progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.pageYOffset / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
    
    // Lazy load images
    const images = document.querySelectorAll('img');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Form validation improvements
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            // Add floating label effect
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                if (!this.value) {
                    this.parentElement.classList.remove('focused');
                }
            });
            
            // Real-time validation
            input.addEventListener('input', function() {
                if (this.validity.valid) {
                    this.classList.remove('invalid');
                    this.classList.add('valid');
                } else {
                    this.classList.remove('valid');
                    this.classList.add('invalid');
                }
            });
        });
    });
    
    // Enhanced button loading state
    document.querySelectorAll('button[type="submit"]').forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.form && this.form.checkValidity()) {
                this.classList.add('loading');
                this.disabled = true;
                
                // Remove loading state after form submission
                setTimeout(() => {
                    this.classList.remove('loading');
                    this.disabled = false;
                }, 3000);
            }
        });
    });
    
    // Keyboard navigation improvements
    document.addEventListener('keydown', function(e) {
        // ESC to close mobile menu
        if (e.key === 'Escape') {
            const mobileNav = document.querySelector('.main-nav.active');
            if (mobileNav) {
                mobileNav.classList.remove('active');
            }
        }
        
        // Tab trap for modals (if any)
        if (e.key === 'Tab') {
            const focusableElements = document.querySelectorAll(
                'a[href], button:not([disabled]), textarea, input, select'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    });
    
    // Copy to clipboard functionality
    document.querySelectorAll('[data-copy]').forEach(element => {
        element.addEventListener('click', function() {
            const text = this.getAttribute('data-copy');
            navigator.clipboard.writeText(text).then(() => {
                // Show success feedback
                const originalText = this.textContent;
                this.textContent = 'Copied!';
                setTimeout(() => {
                    this.textContent = originalText;
                }, 2000);
            });
        });
    });
    
    // Detect if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        document.body.classList.add('reduce-motion');
    }
    
    // Add active state to current nav item
    const currentPage = window.location.pathname;
    document.querySelectorAll('.main-nav a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
    
    // Intersection Observer for fade-in animations
    const fadeElements = document.querySelectorAll('.fade-in');
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    fadeElements.forEach(el => fadeObserver.observe(el));
    
    // Prevent orphans in headings
    document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
        const words = heading.innerHTML.split(' ');
        if (words.length > 2) {
            const lastTwo = words.slice(-2).join('&nbsp;');
            const rest = words.slice(0, -2).join(' ');
            heading.innerHTML = rest + ' ' + lastTwo;
        }
    });
    
    // Add smooth reveal for sections
    const sections = document.querySelectorAll('section');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        sectionObserver.observe(section);
    });
    
    // Performance: Debounce scroll events
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
    
    // Apply debounce to scroll handlers
    const debouncedScroll = debounce(() => {
        // Your scroll logic here
    }, 100);
    
    window.addEventListener('scroll', debouncedScroll);
});
