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
  const sphere = {
    current: { x: 0, y: 0, lightX: 31, lightY: 24, shadowX: 0, shadowY: 0, innerX: 0, innerY: 0 },
    target: { x: 0, y: 0, lightX: 31, lightY: 24, shadowX: 0, shadowY: 0, innerX: 0, innerY: 0 },
    innerVelocity: { x: 0, y: 0 },
  };
  let sphereFrame;
  let returnAfterPull = false;
  const setSphereTargetFromPointer = (event) => {
    const bounds = communityVisual.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    const distance = Math.hypot(x, y) || 1;
    const range = Math.min(1, .5 / distance);
    Object.assign(sphere.target, {
      x: x * range * 68, y: y * range * 68,
      lightX: 50 + x * 52, lightY: 50 + y * 52,
      shadowX: -x * 14, shadowY: -y * 14,
    });
  };
  const renderSphere = () => {
    let moving = false;
    Object.keys(sphere.current).forEach((key) => {
      const remaining = sphere.target[key] - sphere.current[key];
      if (key.startsWith('inner')) {
        return;
      } else {
        sphere.current[key] += remaining * .14;
        if (Math.abs(remaining) > .05) moving = true;
        else sphere.current[key] = sphere.target[key];
      }
    });
    const ringDeltaX = sphere.current.x - sphere.current.innerX;
    const ringDeltaY = sphere.current.y - sphere.current.innerY;
    const ringDistance = Math.hypot(ringDeltaX, ringDeltaY);
    if (ringDistance > 27) {
      const pressure = Math.min(ringDistance - 27, 7);
      sphere.innerVelocity.x += (ringDeltaX / ringDistance) * pressure * .065;
      sphere.innerVelocity.y += (ringDeltaY / ringDistance) * pressure * .065;
    }
    ['innerX', 'innerY'].forEach((key) => {
      const axis = key === 'innerX' ? 'x' : 'y';
      const position = sphere.current[key];
      const velocity = (sphere.innerVelocity[axis] - position * .014) * .89;
      sphere.innerVelocity[axis] = Math.max(-.72, Math.min(.72, velocity));
      sphere.current[key] += sphere.innerVelocity[axis];
      if (Math.abs(sphere.current[key]) > .05 || Math.abs(sphere.innerVelocity[axis]) > .05) moving = true;
      else {
        sphere.current[key] = 0;
        sphere.innerVelocity[axis] = 0;
      }
    });
    if (returnAfterPull && Math.hypot(sphere.target.x - sphere.current.x, sphere.target.y - sphere.current.y) < .6) {
      returnAfterPull = false;
      Object.assign(sphere.target, { x: 0, y: 0, lightX: 31, lightY: 24, shadowX: 0, shadowY: 0 });
      moving = true;
    }
    const { x, y, lightX, lightY, shadowX, shadowY, innerX, innerY } = sphere.current;
    communityVisual.style.setProperty('--sphere-x', `${x.toFixed(1)}px`);
    communityVisual.style.setProperty('--sphere-y', `${y.toFixed(1)}px`);
    communityVisual.style.setProperty('--sphere-light-x', `${lightX.toFixed(1)}%`);
    communityVisual.style.setProperty('--sphere-light-y', `${lightY.toFixed(1)}%`);
    communityVisual.style.setProperty('--sphere-shadow-x', `${shadowX.toFixed(1)}px`);
    communityVisual.style.setProperty('--sphere-shadow-y', `${shadowY.toFixed(1)}px`);
    communityVisual.style.setProperty('--inner-ring-x', `${innerX.toFixed(1)}px`);
    communityVisual.style.setProperty('--inner-ring-y', `${innerY.toFixed(1)}px`);
    communityVisual.style.setProperty('--sphere-tilt-x', `${(x * .12).toFixed(1)}deg`);
    communityVisual.style.setProperty('--sphere-tilt-y', `${(y * -.12).toFixed(1)}deg`);
    sphereFrame = moving ? requestAnimationFrame(renderSphere) : undefined;
  };
  const settleSphere = () => {
    if (!sphereFrame) sphereFrame = requestAnimationFrame(renderSphere);
  };
  communityVisual.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse') return;
    returnAfterPull = false;
    setSphereTargetFromPointer(event);
    settleSphere();
  });
  communityVisual.addEventListener('pointerleave', (event) => {
    if (event.pointerType !== 'mouse') return;
    setSphereTargetFromPointer(event);
    returnAfterPull = true;
    settleSphere();
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
