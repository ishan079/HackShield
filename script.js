const stage = document.querySelector('#shieldStage');
const heroArt = document.querySelector('.hero-art');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (stage && heroArt && !reducedMotion.matches) {
  heroArt.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch') return;
    const bounds = heroArt.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    // Select the matching diagonal axis on each side; keep the swing capped at 12°.
    const diagonal = x < 0 ? 1 : -1;
    const angle = Math.abs(x) * 24;
    stage.style.transform = `perspective(900px) rotate3d(1, ${diagonal}, 0, ${angle}deg)`;
  });
  heroArt.addEventListener('pointerleave', () => { stage.style.transform = ''; });
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
