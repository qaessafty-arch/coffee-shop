// ─── PARALLAX SCROLL ───
(function() {
    const wrapper = document.querySelector('.plx-wrapper');
    const bg      = document.querySelector('.plx-bg');
    const content = document.querySelector('.plx-content');
    const hint    = document.querySelector('.plx-scroll-hint');

    if (!wrapper) return;

    function updateParallax() {
        const rect = wrapper.getBoundingClientRect();
        const maxScroll = wrapper.offsetHeight - window.innerHeight;
        const scrolled = -rect.top;

        if (scrolled < -window.innerHeight || scrolled > maxScroll + window.innerHeight) return;

        const progress = Math.max(0, Math.min(1, scrolled / maxScroll));

        // Background slides down (parallax drift, no zoom)
        if (bg) {
            const y = progress * 20;   // % of movement — tweak to taste
            bg.style.transform = `translateY(${y}%)`;
        }

        // Text drifts up and fades
        if (content) {
            content.style.transform = `translateX(-50%) translateY(${-progress * 100}px)`;
            content.style.opacity   = (1 - progress * 0.9).toFixed(2);
        }

        // Hide scroll hint after user starts scrolling
        if (hint) {
            hint.style.opacity = Math.max(0, 1 - progress * 3).toFixed(2);
        }
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateParallax();
                ticking = false;
            });
            ticking = true;
        }
    });

    window.addEventListener('resize', updateParallax);
    updateParallax();
})();

// ─── IMAGE CAROUSEL ───
(function() {
    const leftBtn  = document.querySelector('.plx-arrow-left');
    const rightBtn = document.querySelector('.plx-arrow-right');
    const items    = document.querySelectorAll('.plx-item');

    if (!leftBtn || !rightBtn || !items.length) return;

    let animating = false;

    function rotate(direction) {
        if (animating) return;
        animating = true;

        items.forEach(item => {
            if (direction === 'next') {
                // Right arrow: right→center, center→left, left→right
                if (item.classList.contains('pos-right')) {
                    item.classList.replace('pos-right', 'pos-center');
                } else if (item.classList.contains('pos-center')) {
                    item.classList.replace('pos-center', 'pos-left');
                } else if (item.classList.contains('pos-left')) {
                    item.classList.replace('pos-left', 'pos-right');
                }
            } else {
                // Left arrow: left→center, center→right, right→left
                if (item.classList.contains('pos-left')) {
                    item.classList.replace('pos-left', 'pos-center');
                } else if (item.classList.contains('pos-center')) {
                    item.classList.replace('pos-center', 'pos-right');
                } else if (item.classList.contains('pos-right')) {
                    item.classList.replace('pos-right', 'pos-left');
                }
            }
        });

        // release the lock after transition ends
        setTimeout(() => { animating = false; }, 950);
    }

    leftBtn.addEventListener('click', () => rotate('prev'));
    rightBtn.addEventListener('click', () => rotate('next'));
})();




