import { $$, easeOutCubic, prefersReducedMotion } from '../lib/dom';

/**
 * Elements marked `.reveal` get `.in` the first time they scroll into view.
 * CSS hangs everything off `.in`: fade-up, ink-stamp headings, red-pen notes.
 * Numbers marked `data-to` count up to their value.
 */

const COUNT_MS = 1400;

const formatNumber = (n: number, decimals: number): string =>
  n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

function countUp(el: HTMLElement): void {
  const target = el.dataset.to;
  if (!target || prefersReducedMotion) return;

  const to = Number(target);
  const decimals = target.split('.')[1]?.length ?? 0;
  const start = performance.now();

  const step = (now: number): void => {
    const p = Math.min(1, (now - start) / COUNT_MS);
    el.textContent = formatNumber(to * easeOutCubic(p), decimals);
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

export function initReveal(): void {
  const io = new IntersectionObserver(
    entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('in');
        $$('[data-to]', entry.target).forEach(countUp);
        io.unobserve(entry.target);
      }
    },
    { threshold: 0.15 },
  );

  $$('.reveal').forEach(el => io.observe(el));
}
