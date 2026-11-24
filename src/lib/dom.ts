/** Small, typed DOM helpers shared by every feature module. */

export const prefersReducedMotion: boolean = matchMedia('(prefers-reduced-motion: reduce)').matches;

export const hasFinePointer: boolean = matchMedia('(hover: hover) and (pointer: fine)').matches;

/** querySelector that fails loudly, so a renamed class in the HTML is caught right away. */
export function $<T extends Element = HTMLElement>(selector: string, root: ParentNode = document): T {
  const el = root.querySelector<T>(selector);
  if (!el) throw new Error(`Missing element: ${selector}`);
  return el;
}

export function $$<T extends Element = HTMLElement>(selector: string, root: ParentNode = document): T[] {
  return [...root.querySelectorAll<T>(selector)];
}

export const clamp = (n: number, min = 0, max = 1): number => Math.min(max, Math.max(min, n));

export const easeOutCubic = (p: number): number => 1 - (1 - p) ** 3;
