/**
 * Pat Lauron · 2026 Annual Report
 * Entry point: each feature lives in its own module under ./features.
 */
import { initPress } from './features/press';
import { initMosaic, initContactStrip } from './features/mosaic';
import { initScrollMotion } from './features/scroll-motion';
import { initReveal } from './features/reveal';
import { initContentsNav } from './features/contents-nav';
import { initPlates } from './features/plates';
import { initBackToTop } from './features/back-to-top';

initPress();
initMosaic();
initContactStrip();
initScrollMotion();
initReveal();
initContentsNav();
initPlates();
initBackToTop();
