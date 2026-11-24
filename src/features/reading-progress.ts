import { clamp } from '../lib/dom';

/** A thin red rule across the top of the page that fills as you read (case-study pages). */
export function initReadingProgress(): void {
  const bar = document.getElementById('progress');
  if (!bar) return;

  let queued = false;
  const update = (): void => {
    queued = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? clamp(scrollY / max).toFixed(4) : '0'})`;
  };
  const request = (): void => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  };

  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', request);
  update();
}
