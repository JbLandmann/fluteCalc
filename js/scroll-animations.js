// Scroll animations
document.addEventListener('DOMContentLoaded', function() {
    // Selectors for elements to animate
    const SCROLL_ANIMATION_SELECTOR = '.scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-fade';
    const TAB_SWITCH_DELAY_MS = 100; // Small delay to allow tab content to render
    
    // Add scroll animation classes to elements
    const animateElements = [
        { selector: '.algorithm-explanation', className: 'scroll-animate' },
        { selector: '.input-section', className: 'scroll-animate' },
        { selector: '.results-section', className: 'scroll-animate' },
        { selector: 'table', className: 'scroll-animate-fade' }
    ];

    // Add animation classes to elements
    animateElements.forEach(item => {
        const elements = document.querySelectorAll(item.selector);
        elements.forEach(el => {
            if (!el.classList.contains(item.className)) {
                el.classList.add(item.className);
            }
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe all elements with scroll animation classes
    const elementsToAnimate = document.querySelectorAll(SCROLL_ANIMATION_SELECTOR);
    
    elementsToAnimate.forEach(el => observer.observe(el));

    // Re-observe when tab content changes
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            setTimeout(() => {
                const newElements = document.querySelectorAll(
                    `.tab-content.active ${SCROLL_ANIMATION_SELECTOR}`
                );
                newElements.forEach(el => {
                    el.classList.remove('animate-in');
                    observer.observe(el);
                });
            }, TAB_SWITCH_DELAY_MS);
        });
    });
});
