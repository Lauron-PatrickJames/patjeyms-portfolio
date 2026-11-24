import { $, prefersReducedMotion } from '../lib/dom';

/** Cover art: a stepped "wafer" of tiles lit by drifting colour lights, like the glow on a silicon wafer. */

type RGB = readonly [r: number, g: number, b: number];

interface Tile {
  el: HTMLDivElement;
  /** position in the grid, 0 → 1 */
  x: number;
  y: number;
  /** opacity, fading toward the left edge and the bottom */
  fade: number;
}

interface Light {
  rgb: RGB;
  x: number;
  y: number;
  /** drift speeds and phase */
  sx: number;
  sy: number;
  phase: number;
}

const LIGHTS: readonly Light[] = [
  { rgb: [255, 70, 140], x: 0.35, y: 0.15, sx: 0.00031, sy: 0.00023, phase: 0 },
  { rgb: [255, 150, 50], x: 0.65, y: 0.05, sx: 0.00027, sy: 0.00019, phase: 1.7 },
  { rgb: [255, 220, 70], x: 0.55, y: 0.25, sx: 0.00022, sy: 0.00029, phase: 3.1 },
  { rgb: [50, 230, 140], x: 0.85, y: 0.45, sx: 0.00019, sy: 0.00025, phase: 4.4 },
  { rgb: [40, 190, 240], x: 0.5, y: 0.6, sx: 0.00025, sy: 0.00017, phase: 2.2 },
  { rgb: [90, 80, 255], x: 0.2, y: 0.75, sx: 0.00021, sy: 0.00027, phase: 5.3 },
];

/** Frame budget: repaint at most every 40 ms (~25 fps), plenty for a slow drift. */
const FRAME_MS = 40;

export function initMosaic(): void {
  const mosaic = $('#mosaic');
  const cover = $('.cover');

  const narrow = innerWidth < 700;
  const cols = narrow ? 10 : 16;
  const rows = narrow ? 12 : 11;
  // columns cut from the left on each row → stepped outline
  const cut = narrow ? [5, 3, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0] : [7, 5, 4, 3, 2, 1, 1, 0, 0, 0, 0];
  mosaic.style.setProperty('--cols', String(cols));

  const tiles: Tile[] = [];
  for (let r = 0; r < rows; r++) {
    const cutHere = cut[r] ?? 0;
    for (let c = 0; c < cols; c++) {
      const el = document.createElement('div');
      el.className = 'tile';
      if (c < cutHere || (r === 0 && c === cols - 1)) el.classList.add('off');
      mosaic.appendChild(el);
      const fade = Math.min(1, 0.35 + (c - cutHere) / 4) * Math.min(1, 1.35 - r / rows);
      el.style.setProperty('--o', fade.toFixed(2));
      tiles.push({ el, x: c / (cols - 1), y: r / (rows - 1), fade });
    }
  }

  const mouse = { x: -9, y: -9, on: false };
  cover.addEventListener('pointermove', (e: PointerEvent) => {
    const b = mosaic.getBoundingClientRect();
    mouse.x = (e.clientX - b.left) / b.width;
    mouse.y = (e.clientY - b.top) / b.height;
    mouse.on = true;
  });
  cover.addEventListener('pointerleave', () => { mouse.on = false; });

  const paint = (t: number): void => {
    const lights = LIGHTS.map(l => ({
      rgb: l.rgb,
      x: l.x + Math.sin(t * l.sx + l.phase) * 0.22,
      y: l.y + Math.cos(t * l.sy + l.phase) * 0.18,
    }));

    for (const tile of tiles) {
      // hue = weighted mix of nearby lights (stays saturated); brightness = how close the lights are
      let r = 0, g = 0, b = 0, w = 0;
      for (const l of lights) {
        const d = (tile.x - l.x) ** 2 + (tile.y - l.y) ** 2;
        const k = Math.exp(-d / 0.03) ** 2 + 1e-4;
        r += l.rgb[0] * k; g += l.rgb[1] * k; b += l.rgb[2] * k; w += k;
      }
      const lum = Math.min(1, 0.35 + Math.sqrt(w) * 0.9);
      r = (r / w) * lum + 14 * (1 - lum);
      g = (g / w) * lum + 12 * (1 - lum);
      b = (b / w) * lum + 30 * (1 - lum);

      if (mouse.on) {
        const k = Math.exp(-((tile.x - mouse.x) ** 2 + (tile.y - mouse.y) ** 2) / 0.012) * 0.7;
        r += (255 - r) * k; g += (255 - g) * k; b += (255 - b) * k;
      }
      tile.el.style.setProperty('--c', `rgb(${r | 0},${g | 0},${b | 0})`);
    }
  };

  paint(0);
  if (prefersReducedMotion) return;

  let last = 0;
  const loop = (t: number): void => {
    if (t - last > FRAME_MS) { paint(t); last = t; }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

/** The little row of lit tiles in the corner of the contact page. */
export function initContactStrip(): void {
  const strip = $('#strip');
  const colours = ['#ff4f8b', '#ff9a3d', '#ffd447', '#39e092', '#2fc6ea', '#5b6cff', '#8f4dff', '#5b6cff'];
  for (const c of colours) {
    const i = document.createElement('i');
    i.style.backgroundColor = c;
    i.style.boxShadow = `0 0 24px -4px ${c}`;
    strip.appendChild(i);
  }
}
