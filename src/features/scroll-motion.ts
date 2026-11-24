import { $, $$, clamp, easeOutCubic, prefersReducedMotion } from '../lib/dom';

/**
 * Scroll-linked motion:
 *  - the cover "closes" (CSS reads --cp, 0 → 1, to tilt and dim the mosaic)
 *  - each section slides up over the previous one like the next sheet in a stack
 */

/** How far (px) a sheet starts below its resting place, and how much it is rotated (deg). */
const SHEET_OFFSET_PX = 90;
const SHEET_TILT_DEG = -0.8;
/** Fraction of the viewport over which a sheet settles into place. */
const SETTLE_DISTANCE = 0.65;

export function initScrollMotion(): void {
  if (prefersReducedMotion) return;

  const cover = $('.cover');
  const sheets = $$('main > .page');
  let queued = false;

  const update = (): void => {
    queued = false;
    const vh = innerHeight;
    const y = scrollY;

    cover.style.setProperty('--cp', clamp(y / cover.offsetHeight).toFixed(3));

    for (const sheet of sheets) {
      // offsetTop ignores transforms, so moving a sheet never feeds back into its own progress
      const top = sheet.offsetTop - y;
      const k = easeOutCubic(clamp((vh - top) / (vh * SETTLE_DISTANCE)));
      sheet.style.transform = k >= 1
        ? ''
        : `translateY(${((1 - k) * SHEET_OFFSET_PX).toFixed(1)}px) rotate(${((1 - k) * SHEET_TILT_DEG).toFixed(3)}deg)`;
    }
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
