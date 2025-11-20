// Scroll animations
document.addEventListener('DOMContentLoaded', function() {
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
    const elementsToAnimate = document.querySelectorAll(
        '.scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-fade'
    );
    
    elementsToAnimate.forEach(el => observer.observe(el));

    // Re-observe when tab content changes
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            setTimeout(() => {
                const newElements = document.querySelectorAll(
                    '.tab-content.active .scroll-animate, .tab-content.active .scroll-animate-left, .tab-content.active .scroll-animate-right, .tab-content.active .scroll-animate-fade'
                );
                newElements.forEach(el => {
                    el.classList.remove('animate-in');
                    observer.observe(el);
                });
            }, 100);
        });
    });
});
