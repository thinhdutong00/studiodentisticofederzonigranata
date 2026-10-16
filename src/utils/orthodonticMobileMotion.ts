export function bindOrthodonticMobileMotion() {
  const header = document.querySelector<HTMLElement>('.ortho-landing-main > .landing-header');
  if (!header || header.dataset.mobileMotionBound) return;
  header.dataset.mobileMotionBound = 'true';

  const mobileViewport = window.matchMedia('(max-width: 720px)');
  const upwardRevealDistance = 100;
  let lastScrollY = Math.max(0, window.scrollY);
  let upwardScrollDistance = 0;
  let viewportWidth = window.innerWidth;
  let scrollFrame = 0;

  const revealHeader = () => {
    header.classList.remove('is-scroll-hidden');
    lastScrollY = Math.max(0, window.scrollY);
    upwardScrollDistance = 0;
  };

  const updateHeader = () => {
    scrollFrame = 0;
    const scrollY = Math.max(0, window.scrollY);
    const delta = scrollY - lastScrollY;
    const keepVisible = header.hasAttribute('data-menu-open') || Boolean(header.querySelector(':focus-visible'));

    if (!mobileViewport.matches || scrollY <= 4 || keepVisible) {
      revealHeader();
      return;
    }

    // Ignore small touch movements and require a longer upward scroll to reveal the header.
    if (Math.abs(delta) >= 6) {
      lastScrollY = scrollY;
      if (delta > 0) {
        upwardScrollDistance = 0;
        header.classList.toggle('is-scroll-hidden', scrollY > header.offsetHeight + 16);
      } else if (header.classList.contains('is-scroll-hidden')) {
        upwardScrollDistance -= delta;
        if (upwardScrollDistance >= upwardRevealDistance) revealHeader();
      }
    }
  };

  window.addEventListener('scroll', () => {
    if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateHeader);
  }, { passive: true });
  window.addEventListener('resize', () => {
    // Mobile browser bars can change the viewport height during a scroll.
    if (window.innerWidth !== viewportWidth) {
      viewportWidth = window.innerWidth;
      revealHeader();
    }
  });
  window.addEventListener('pageshow', revealHeader);
  mobileViewport.addEventListener('change', revealHeader);
  header.addEventListener('focusin', revealHeader);
}
