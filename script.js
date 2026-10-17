const stage = document.querySelector('#shieldStage');
const heroArt = document.querySelector('.hero-art');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// Preserve the phase of the layered diagram while it is outside the viewport.
const communityVisual = document.querySelector('.community-visual');
if (communityVisual && 'IntersectionObserver' in window) {
  const communityVisibility = new IntersectionObserver(([entry]) => {
    communityVisual.classList.toggle('is-motion-paused', !entry.isIntersecting);
  });
  communityVisibility.observe(communityVisual);
}

if (stage && heroArt && !reducedMotion.matches) {
  heroArt.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch') return;
    const bounds = heroArt.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    // Follow the pointer in both directions so each corner can lean toward it.
    stage.style.transform = `perspective(900px) rotateX(${y * 17}deg) rotateY(${x * -17}deg)`;
    const tilt = Math.min(1, Math.hypot(x, y) / Math.SQRT1_2);
    heroArt.style.setProperty('--shadow-scale', (1 + tilt * 0.18).toFixed(3));
  });
  heroArt.addEventListener('pointerleave', () => {
    stage.style.transform = '';
    heroArt.style.removeProperty('--shadow-scale');
  });
}

const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-header nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    nav.classList.toggle('is-open', !isOpen);
  });
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
    nav.classList.remove('is-open');
  }));
}

const aliasSwitch = document.querySelector('.alias-switch');
const mobileAliasViewport = window.matchMedia('(max-width: 720px)');
if (aliasSwitch) {
  aliasSwitch.addEventListener('click', () => {
    if (!mobileAliasViewport.matches) return;
    const isToggled = aliasSwitch.classList.toggle('is-toggled');
    aliasSwitch.setAttribute('aria-pressed', String(isToggled));
  });
  mobileAliasViewport.addEventListener('change', (event) => {
    if (event.matches) return;
    aliasSwitch.classList.remove('is-toggled');
    aliasSwitch.setAttribute('aria-pressed', 'false');
  });
}
