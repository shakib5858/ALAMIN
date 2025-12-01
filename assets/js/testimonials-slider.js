// Testimonials Slider
document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.testimonials-track');
    const slides = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.slider-btn-prev');
    const nextBtn = document.querySelector('.slider-btn-next');
    const dotsContainer = document.querySelector('.slider-dots');
    
    if (!track || slides.length === 0) return;
    
    let currentIndex = 0;
    const totalSlides = slides.length;
    let slidesToShow = 3;
    let slideWidth = 33.333;
    
    // Responsive slides to show
    function updateSlidesToShow() {
        if (window.innerWidth <= 768) {
            slidesToShow = 1;
            slideWidth = 100;
        } else if (window.innerWidth <= 1024) {
            slidesToShow = 2;
            slideWidth = 50;
        } else {
            slidesToShow = 3;
            slideWidth = 33.333;
        }
    }
    
    updateSlidesToShow();
    window.addEventListener('resize', () => {
        updateSlidesToShow();
        updateSlider();
    });
    
    const maxIndex = Math.max(0, totalSlides - slidesToShow);
    
    // Create dots based on number of pages
    const totalPages = Math.ceil(totalSlides / slidesToShow);
    for (let i = 0; i < totalPages; i++) {
        const dot = document.createElement('button');
        dot.classList.add('slider-dot');
        dot.setAttribute('aria-label', `Go to page ${i + 1}`);
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }
    
    const dots = document.querySelectorAll('.slider-dot');
    
    // Update slider position
    function updateSlider() {
        const maxIdx = Math.max(0, totalSlides - slidesToShow);
        const actualIndex = Math.min(currentIndex, maxIdx);
        track.style.transform = `translateX(-${actualIndex * slideWidth}%)`;
        
        // Update dots
        const currentPage = Math.floor(actualIndex / slidesToShow);
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentPage);
        });
        
        // Update button states
        prevBtn.style.opacity = actualIndex === 0 ? '0.5' : '1';
        prevBtn.style.cursor = actualIndex === 0 ? 'not-allowed' : 'pointer';
        nextBtn.style.opacity = actualIndex >= maxIdx ? '0.5' : '1';
        nextBtn.style.cursor = actualIndex >= maxIdx ? 'not-allowed' : 'pointer';
    }
    
    // Go to specific slide
    function goToSlide(index) {
        currentIndex = index;
        updateSlider();
    }
    
    // Next slide
    function nextSlide() {
        const maxIdx = Math.max(0, totalSlides - slidesToShow);
        if (currentIndex < maxIdx) {
            currentIndex++;
            updateSlider();
        }
    }
    
    // Previous slide
    function prevSlide() {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    }
    
    // Event listeners
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });
    
    // Touch/Swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }
    
    // Auto-play (optional)
    let autoplayInterval;
    const autoplayDelay = 5000; // 5 seconds
    
    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            const maxIdx = Math.max(0, totalSlides - slidesToShow);
            if (currentIndex < maxIdx) {
                nextSlide();
            } else {
                goToSlide(0);
            }
        }, autoplayDelay);
    }
    
    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }
    
    // Start autoplay
    startAutoplay();
    
    // Pause autoplay on hover
    const sliderWrapper = document.querySelector('.testimonials-slider-wrapper');
    sliderWrapper.addEventListener('mouseenter', stopAutoplay);
    sliderWrapper.addEventListener('mouseleave', startAutoplay);
    
    // Initial update
    updateSlider();
});
