import { $$ } from '../lib/dom';

/** Click a screenshot exhibit to see it full size in a <dialog>. Esc, the Close button or the backdrop closes it. */
export function initLightbox(): void {
  const dialog = document.getElementById('lightbox');
  if (!(dialog instanceof HTMLDialogElement)) return;

  const big = dialog.querySelector('img');
  const caption = dialog.querySelector('.lb-cap');
  if (!big || !caption) return;

  for (const btn of $$<HTMLButtonElement>('.shot-zoom')) {
    btn.addEventListener('click', () => {
      const thumb = btn.querySelector('img');
      if (!thumb) return;
      big.src = thumb.currentSrc || thumb.src;
      big.alt = thumb.alt;
      caption.textContent = btn.closest('figure')?.querySelector('figcaption')?.textContent ?? '';
      dialog.showModal();
    });
  }

  // a click on the dialog itself (not its contents) lands on the padding/backdrop: close
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
  dialog.querySelector('.lb-close')?.addEventListener('click', () => dialog.close());
}
