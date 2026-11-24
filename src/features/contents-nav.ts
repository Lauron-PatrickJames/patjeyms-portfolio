import { $$ } from '../lib/dom';

/** Highlight the contents-bar link for whichever section sits in the middle of the screen. */
export function initContentsNav(): void {
  const links = $$<HTMLAnchorElement>('.contents a.sec');

  const spy = new IntersectionObserver(
    entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const hash = `#${entry.target.id}`;
        links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === hash));
      }
    },
    { rootMargin: '-45% 0px -50% 0px' },
  );

  $$('main section[id]').forEach(section => spy.observe(section));
}
