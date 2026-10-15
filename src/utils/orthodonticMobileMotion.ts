export function bindOrthodonticMobileMotion() {
  const header = document.querySelector<HTMLElement>('.ortho-landing-main > .landing-header');
  if (!header || header.dataset.mobileMotionBound) return;
  header.dataset.mobileMotionBound = 'true';

  const mobileViewport = window.matchMedia('(max-width: 720px)');
  let lastScrollY = Math.max(0, window.scrollY);
  let scrollFrame = 0;

  const revealHeader = () => {
    header.classList.remove('is-scroll-hidden');
    lastScrollY = Math.max(0, window.scrollY);
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

    // Ignore small touch movements, while revealing the header as soon as scrolling reverses.
    if (Math.abs(delta) >= 6) {
      header.classList.toggle('is-scroll-hidden', delta > 0 && scrollY > header.offsetHeight + 16);
      lastScrollY = scrollY;
    }
  };

  window.addEventListener('scroll', () => {
    if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateHeader);
  }, { passive: true });
  window.addEventListener('resize', revealHeader);
  window.addEventListener('pageshow', revealHeader);
  mobileViewport.addEventListener('change', revealHeader);
  header.addEventListener('focusin', revealHeader);
}
