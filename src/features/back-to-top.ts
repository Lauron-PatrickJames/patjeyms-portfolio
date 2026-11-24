import { clamp, prefersReducedMotion } from '../lib/dom';

/**
 * A round "seal" in the bottom-right corner that scrolls back to the top.
 * It appears once the reader is past the first screen, and its red ring fills
 * with reading progress. Built here so every page gets it without extra HTML.
 */

/** Show the button after scrolling this fraction of a screen. */
const SHOW_AFTER = 0.9;

export function initBackToTop(): void {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'to-top';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = `
    <svg viewBox="0 0 52 52" aria-hidden="true">
      <circle class="track" cx="26" cy="26" r="23"/>
      <circle class="ring" cx="26" cy="26" r="23" pathLength="1"/>
    </svg>
    <span class="arrow" aria-hidden="true">↑</span>
    <span class="lbl" aria-hidden="true">Top</span>`;
  document.body.appendChild(btn);

  let queued = false;
  const update = (): void => {
    queued = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    btn.classList.toggle('show', scrollY > innerHeight * SHOW_AFTER);
    btn.style.setProperty('--p', (max > 0 ? clamp(scrollY / max) : 0).toFixed(4));
  };
  const request = (): void => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  };

  btn.addEventListener('click', () => {
    scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    // move keyboard focus back to the top too, without a second jump
    const top = document.getElementById('top');
    if (top) {
      top.tabIndex = -1;
      top.focus({ preventScroll: true });
    }
  });

  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', request);
  update();
}
