import { captureAttribution } from './attribution';

export function bindOrthodonticLanding() {
  const landingHeader = document.querySelector<HTMLElement>('.landing-header');
  if (!landingHeader || landingHeader.dataset.orthoBound) return;
  landingHeader.dataset.orthoBound = 'true';
  captureAttribution();
  const updateHeaderBorder = () => landingHeader?.classList.toggle('is-scrolled', window.scrollY > 0);
  updateHeaderBorder();
  window.addEventListener('scroll', updateHeaderBorder, { passive: true });
  window.addEventListener('pageshow', updateHeaderBorder);

  // L’offset segue l’altezza reale dell’header, anche al cambio di viewport.
  const updateAnchorOffset = () => {
    document.documentElement.style.setProperty('--ortho-anchor-offset', `${(landingHeader?.offsetHeight || 68) + 16}px`);
  };
  updateAnchorOffset();
  if (landingHeader) new ResizeObserver(updateAnchorOffset).observe(landingHeader);

  // Riserva lo spazio reale della barra, anche quando il titolo va a capo.
  const stickyCta = document.querySelector<HTMLElement>('[data-treatment-sticky-cta]');
  const updateStickySpacing = () => {
    document.documentElement.style.setProperty('--ortho-sticky-height', `${Math.ceil(stickyCta?.getBoundingClientRect().height || 0)}px`);
  };
  updateStickySpacing();
  if (stickyCta) new ResizeObserver(updateStickySpacing).observe(stickyCta);

  const navigation = document.querySelector<HTMLElement>('.ortho-header-nav');
  const menuToggle = document.querySelector<HTMLButtonElement>('.ortho-menu-toggle');
  const treatmentsMenu = document.querySelector<HTMLDetailsElement>('.ortho-treatment-menu');
  const compactHeader = window.matchMedia('(max-width: 1024px)');

  const closeNavigation = (returnFocus = false) => {
    landingHeader?.removeAttribute('data-menu-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Apri menu di navigazione');
    if (treatmentsMenu) treatmentsMenu.open = false;
    if (returnFocus) menuToggle?.focus();
  };

  menuToggle?.addEventListener('click', () => {
    if (landingHeader?.hasAttribute('data-menu-open')) {
      closeNavigation();
    } else {
      landingHeader?.setAttribute('data-menu-open', '');
      menuToggle.setAttribute('aria-expanded', 'true');
      menuToggle.setAttribute('aria-label', 'Chiudi menu di navigazione');
    }
  });

  document.addEventListener('click', (event) => {
    if (event.target instanceof Node && !landingHeader?.contains(event.target)) closeNavigation();
  });
  landingHeader?.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (treatmentsMenu?.open) {
      treatmentsMenu.open = false;
      treatmentsMenu.querySelector('summary')?.focus();
    } else if (landingHeader.hasAttribute('data-menu-open')) {
      closeNavigation(true);
    }
  });
  landingHeader?.addEventListener('focusout', (event) => {
    if (event.relatedTarget instanceof Node && !landingHeader.contains(event.relatedTarget)) closeNavigation();
  });
  navigation?.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('a')) closeNavigation();
  });
  document.querySelector('.landing-header-cta')?.addEventListener('click', () => closeNavigation());
  compactHeader.addEventListener('change', () => {
    const focusWasInMenu = navigation?.contains(document.activeElement);
    closeNavigation();
    if (compactHeader.matches && focusWasInMenu) menuToggle?.focus();
  });
}
