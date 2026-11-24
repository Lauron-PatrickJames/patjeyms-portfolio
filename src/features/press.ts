import { $ } from '../lib/dom';

/**
 * Printing intro: four ink passes (C, M, Y, K), then the sheet lifts away.
 * The animation itself is pure CSS; this only keeps the label in sync and handles skip/cleanup.
 * Whether it plays at all is decided by the tiny inline script in <head> (adds `html.pressing`).
 */

type InkPass = 'c' | 'm' | 'y' | 'k';

const PASS_LABELS: Record<InkPass, string> = {
  c: 'Pass 1 of 4 · Cyan',
  m: 'Pass 2 of 4 · Magenta',
  y: 'Pass 3 of 4 · Yellow',
  k: 'Pass 4 of 4 · Black',
};

const isInkPass = (name: string): name is InkPass => name in PASS_LABELS;

export function initPress(): void {
  const press = document.getElementById('press');
  if (!press) return;

  const root = document.documentElement;
  if (!root.classList.contains('pressing')) {
    press.remove();
    return;
  }

  try {
    sessionStorage.setItem('printed', '1');
  } catch {
    // storage can be blocked (private mode); the intro will just play again next time
  }

  const label = $('#pressPass', press);
  const passOf = (e: AnimationEvent): string => (e.target instanceof Element ? e.target.className : '');

  // follow the real animations, so the label never runs ahead of the ink
  press.addEventListener('animationstart', (e: AnimationEvent) => {
    const pass = passOf(e);
    if (isInkPass(pass)) label.textContent = PASS_LABELS[pass];
  });

  press.addEventListener('animationend', (e: AnimationEvent) => {
    if (passOf(e) === 'k') label.textContent = 'Ready for distribution';
    if (e.animationName === 'press-out') {
      press.remove();
      root.classList.remove('pressing');
    }
  });

  press.addEventListener('click', () => press.classList.add('skip'));
}
