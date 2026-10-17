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

if (communityVisual && !reducedMotion.matches) {
  const resetSphereLight = () => {
    communityVisual.style.removeProperty('--sphere-x');
    communityVisual.style.removeProperty('--sphere-y');
    communityVisual.style.removeProperty('--sphere-light-x');
    communityVisual.style.removeProperty('--sphere-light-y');
    communityVisual.style.removeProperty('--sphere-shadow-x');
    communityVisual.style.removeProperty('--sphere-shadow-y');
    communityVisual.style.removeProperty('--sphere-tilt-x');
    communityVisual.style.removeProperty('--sphere-tilt-y');
  };
  communityVisual.addEventListener('pointerenter', (event) => {
    if (event.pointerType !== 'mouse') return;
  });
  communityVisual.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse') return;
    const bounds = communityVisual.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    const distance = Math.hypot(x, y) || 1;
    const range = Math.min(1, .42 / distance);
    const sphereX = x * range * 68;
    const sphereY = y * range * 68;
    communityVisual.style.setProperty('--sphere-x', `${sphereX.toFixed(1)}px`);
    communityVisual.style.setProperty('--sphere-y', `${sphereY.toFixed(1)}px`);
    communityVisual.style.setProperty('--sphere-light-x', `${(50 + x * 52).toFixed(1)}%`);
    communityVisual.style.setProperty('--sphere-light-y', `${(50 + y * 52).toFixed(1)}%`);
    communityVisual.style.setProperty('--sphere-shadow-x', `${(-x * 14).toFixed(1)}px`);
    communityVisual.style.setProperty('--sphere-shadow-y', `${(-y * 14).toFixed(1)}px`);
    communityVisual.style.setProperty('--sphere-tilt-x', `${(sphereX * .12).toFixed(1)}deg`);
    communityVisual.style.setProperty('--sphere-tilt-y', `${(sphereY * -.12).toFixed(1)}deg`);
  });
  communityVisual.addEventListener('pointerleave', () => {
    resetSphereLight();
  });
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
