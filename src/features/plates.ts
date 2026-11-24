import { $, $$, hasFinePointer, prefersReducedMotion } from '../lib/dom';

/** Project plates: click jumps to the write-up; with a mouse, they tilt toward the cursor. */

const MAX_TILT_X_DEG = 14;
const MAX_TILT_Y_DEG = 16;
const FLASH_MS = 1400;

function jumpToEntry(btn: HTMLButtonElement): void {
  const id = btn.dataset.target;
  const entry = id ? document.getElementById(id) : null;
  if (!entry) return;

  entry.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'center' });
  entry.classList.add('flash');
  setTimeout(() => entry.classList.remove('flash'), FLASH_MS);
}

function enableTilt(btn: HTMLButtonElement): void {
  const art = $('.art', btn);
  const glare = document.createElement('i');
  glare.className = 'glare';
  art.appendChild(glare);

  btn.addEventListener('pointermove', (e: PointerEvent) => {
    // measure the (untransformed) button, not the tilting plate, to avoid jitter
    const b = btn.getBoundingClientRect();
    const x = (e.clientX - b.left) / b.width;
    const y = Math.min(1, (e.clientY - b.top) / art.offsetHeight);
    const rx = (0.5 - y) * MAX_TILT_X_DEG;
    const ry = (x - 0.5) * MAX_TILT_Y_DEG;
    art.style.transform = `perspective(700px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-6px)`;
    art.style.setProperty('--gx', `${(x * 100).toFixed(1)}%`);
    art.style.setProperty('--gy', `${(y * 100).toFixed(1)}%`);
  });

  btn.addEventListener('pointerleave', () => { art.style.transform = ''; });
}

export function initPlates(): void {
  const buttons = $$<HTMLButtonElement>('.panels button');
  const tilt = hasFinePointer && !prefersReducedMotion;

  for (const btn of buttons) {
    btn.addEventListener('click', () => jumpToEntry(btn));
    if (tilt) enableTilt(btn);
  }
}
