/* ODOR Coffee — progressive enhancement and interaction helpers. */
(() => {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Keep the coffee menu at two columns on mobile and responsive on larger screens.
    const menuResponsiveStyles = document.createElement('style');
    menuResponsiveStyles.textContent = `
        .shop-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        @media (max-width: 1024px) {
            .shop-grid {
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: 1.25rem;
            }
        }

        @media (max-width: 768px) {
            .shop-section {
                padding-left: 1rem;
                padding-right: 1rem;
            }

            .shop-content {
                padding-left: 0;
                padding-right: 0;
            }

            .shop-grid {
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: .85rem;
            }

            .shop-card {
                min-width: 0;
                padding: 1.35rem .8rem;
                border-radius: 14px;
            }

            .shop-icon {
                width: 52px;
                height: 52px;
                font-size: 1.45rem;
                margin-bottom: .75rem;
            }

            .shop-card h3 {
                font-size: 1.15rem;
                line-height: 1.2;
            }

            .shop-card p {
                font-size: .82rem;
                line-height: 1.45;
                margin-bottom: 1rem;
            }

            .price {
                font-size: 1.2rem;
                margin-bottom: .75rem;
            }

            .add-btn {
                width: 100%;
                min-height: 42px;
                padding: .65rem .35rem;
                font-size: .68rem;
                letter-spacing: .04em;
            }

            .shop-header-sub {
                margin-top: 3.5rem;
            }
        }

        @media (max-width: 360px) {
            .shop-grid { gap: .6rem; }
            .shop-card { padding-left: .55rem; padding-right: .55rem; }
            .shop-card h3 { font-size: 1rem; }
            .shop-card p { font-size: .75rem; }
            .add-btn { font-size: .61rem; }
        }

        @media (prefers-reduced-motion: reduce) {
            .shop-card, .shop-icon, .add-btn {
                animation: none;
                transition: none;
            }
        }
    `;
    document.head.appendChild(menuResponsiveStyles);

    // ─── PARALLAX SCROLL ───
    const wrapper = document.querySelector('.plx-wrapper');
    const background = document.querySelector('.plx-bg');
    const content = document.querySelector('.plx-content');
    const hint = document.querySelector('.plx-scroll-hint');

    if (wrapper && !prefersReducedMotion) {
        let frameRequested = false;

        const updateParallax = () => {
            const maxScroll = Math.max(1, wrapper.offsetHeight - window.innerHeight);
            const scrolled = -wrapper.getBoundingClientRect().top;
            const progress = Math.max(0, Math.min(1, scrolled / maxScroll));

            if (background) background.style.transform = `translateY(${progress * 20}%)`;
            if (content) {
                content.style.transform = `translateX(-50%) translateY(${-progress * 100}px)`;
                content.style.opacity = String(1 - progress * 0.9);
            }
            if (hint) hint.style.opacity = String(Math.max(0, 1 - progress * 3));
            frameRequested = false;
        };

        const requestParallaxUpdate = () => {
            if (frameRequested) return;
            frameRequested = true;
            window.requestAnimationFrame(updateParallax);
        };

        window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
        window.addEventListener('resize', requestParallaxUpdate, { passive: true });
        updateParallax();
    }

    // ─── PARALLAX IMAGE CAROUSEL ───
    const leftButton = document.querySelector('.plx-arrow-left');
    const rightButton = document.querySelector('.plx-arrow-right');
    const items = [...document.querySelectorAll('.plx-item')];

    if (leftButton && rightButton && items.length) {
        let animating = false;
        const transitionDuration = prefersReducedMotion ? 0 : 950;

        const rotate = (direction) => {
            if (animating) return;
            animating = true;

            items.forEach((item) => {
                const nextClass = direction === 'next'
                    ? { 'pos-right': 'pos-center', 'pos-center': 'pos-left', 'pos-left': 'pos-right' }
                    : { 'pos-left': 'pos-center', 'pos-center': 'pos-right', 'pos-right': 'pos-left' };

                const currentPosition = Object.keys(nextClass).find((position) => item.classList.contains(position));
                if (currentPosition) item.classList.replace(currentPosition, nextClass[currentPosition]);
            });

            window.setTimeout(() => { animating = false; }, transitionDuration);
        };

        leftButton.addEventListener('click', () => rotate('previous'));
        rightButton.addEventListener('click', () => rotate('next'));
    }

    // ─── CART FEEDBACK ───
    const addButtons = document.querySelectorAll('.add-btn');
    if (addButtons.length) {
        const toast = document.createElement('div');
        toast.className = 'ui-toast';
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');
        toast.innerHTML = '<i class="fas fa-check-circle" aria-hidden="true"></i> <span></span>';
        document.body.appendChild(toast);

        let toastTimeout;
        const showToast = (message) => {
            toast.querySelector('span').textContent = message;
            toast.classList.add('show');
            window.clearTimeout(toastTimeout);
            toastTimeout = window.setTimeout(() => toast.classList.remove('show'), 3000);
        };

        addButtons.forEach((button) => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                const card = button.closest('.shop-card');
                const name = card?.querySelector('h3')?.textContent.trim() || 'Item';

                button.classList.add('is-pressed');
                window.setTimeout(() => button.classList.remove('is-pressed'), 150);
                showToast(`${name} added to cart!`);
            });
        });
    }

    // ─── ACCESSIBLE SMOOTH ANCHOR SCROLLING ───
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (event) => {
            const targetId = anchor.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const target = document.querySelector(targetId);
            if (!target) return;

            event.preventDefault();
            target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
            if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
            target.focus({ preventScroll: true });
        });
    });

    // ─── MOBILE MENU TOGGLE ───
    (() => {
        const btn = document.querySelector('.mobile-menu-btn');
        const links = document.querySelector('.nav-links');
        if (!btn || !links) return;

        const mobileQuery = window.matchMedia('(max-width: 768px)');
        let isOpen = false;

        const setMenuState = (open) => {
            isOpen = open && mobileQuery.matches;
            links.classList.toggle('open', isOpen);
            document.body.classList.toggle('menu-open', isOpen);
            btn.setAttribute('aria-expanded', String(isOpen));
            btn.textContent = isOpen ? '✕' : '☰';
        };

        btn.setAttribute('aria-expanded', 'false');
        btn.addEventListener('click', (event) => {
            event.stopPropagation();
            setMenuState(!isOpen);
        });

        links.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => setMenuState(false));
        });

        document.addEventListener('click', (event) => {
            if (!isOpen || links.contains(event.target) || btn.contains(event.target)) return;
            setMenuState(false);
        });

        const handleBreakpointChange = () => setMenuState(false);
        if (mobileQuery.addEventListener) {
            mobileQuery.addEventListener('change', handleBreakpointChange);
        } else {
            mobileQuery.addListener(handleBreakpointChange);
        }
    })();
})();
