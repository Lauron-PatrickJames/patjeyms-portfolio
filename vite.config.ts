import { defineConfig } from 'vite';

export default defineConfig({
  // relative asset paths, so the built site works at a domain root
  // or in a sub-folder (e.g. GitHub Pages project sites)
  base: './',
  build: {
    rollupOptions: {
      // one entry per page: the annual report, plus each case-study supplement
      input: {
        main: 'index.html',
        aniskolar: 'projects/aniskolar.html',
      },
    },
  },
});
