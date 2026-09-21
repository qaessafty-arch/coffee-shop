(() => {
  'use strict';

  // Load the requested display font and apply it to the hero headline.
  const heroFont = document.createElement('link');
  heroFont.rel = 'stylesheet';
  heroFont.href = 'https://fonts.googleapis.com/css2?family=Anton&family=DM+Sans:wght@400;500;600;700&display=swap';
  document.head.appendChild(heroFont);

  const heroFontStyles = document.createElement('style');
  heroFontStyles.textContent = `
    .headline {
      font-family: 'Anton', Impact, sans-serif !important;
      font-weight: 400 !important;
      letter-spacing: .015em !important;
      line-height: 1.04 !important;
      text-transform: uppercase;
    }
    .headline .highlight {
      font-family: 'Anton', Impact, sans-serif !important;
      font-style: normal !important;
      letter-spacing: .02em !important;
    }
    @media (max-width: 768px) {
      .headline { font-size: clamp(2.35rem, 12vw, 4.2rem) !important; }
    }
  `;
  document.head.appendChild(heroFontStyles);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
      btn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
      btn.textContent = isOpen ? '✕' : '☰';
    };
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Open menu');
    btn.addEventListener('click', (event) => { event.stopPropagation(); setMenuState(!isOpen); });
    links.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenuState(false)));
    document.addEventListener('click', (event) => {
      if (!isOpen || links.contains(event.target) || btn.contains(event.target)) return;
      setMenuState(false);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && isOpen) setMenuState(false);
    });
    const handleBreakpointChange = () => setMenuState(false);
    if (mobileQuery.addEventListener) mobileQuery.addEventListener('change', handleBreakpointChange);
    else mobileQuery.addListener(handleBreakpointChange);
  })();
})();
