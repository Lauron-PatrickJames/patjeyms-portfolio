/**
 * Entry point for the case-study pages ("supplements" to the annual report).
 * Reuses the home page's reveal, contents-bar and page-turn modules.
 */
import { initReveal } from './features/reveal';
import { initContentsNav } from './features/contents-nav';
import { initScrollMotion } from './features/scroll-motion';
import { initReadingProgress } from './features/reading-progress';
import { initLightbox } from './features/lightbox';
import { initBackToTop } from './features/back-to-top';

initReveal();
initContentsNav();
initScrollMotion();
initReadingProgress();
initLightbox();
initBackToTop();
