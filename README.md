# Pat Lauron · 2026 Annual Report

My portfolio, presented as a vintage corporate annual report. Built with Vite and TypeScript, with no UI framework.

**Live: [patjeyms.dev](https://patjeyms.dev)**. Every push to `main` deploys automatically on Vercel.

## Run it

```bash
npm install
npm run dev        # local dev server with hot reload
npm run build      # type-check (tsc) + production build into dist/
npm run preview    # serve the built dist/ locally
```

## Where things live

| Path | What |
|---|---|
| `index.html` | All content: letter, highlights, projects, experience, skills, contact |
| `src/style.css` | Colours and fonts (`:root`), layout, and the motion CSS |
| `src/main.ts` | Entry point that starts each feature |
| `src/features/mosaic.ts` | Glowing tile "wafer" on the cover |
| `src/features/press.ts` | CMYK printing intro (plays once per visit, click to skip) |
| `src/features/scroll-motion.ts` | Cover closes on scroll; sections slide up like stacked sheets |
| `src/features/reveal.ts` | Scroll reveals, count-up numbers, red-pen notes trigger |
| `src/features/contents-nav.ts` | Highlights the current section in the contents bar |
| `src/features/plates.ts` | Project plates: tilt toward the cursor, click to jump |
| `src/assets/me.jpg` | Portrait (bundled and fingerprinted at build) |
| `public/resume.pdf` | Résumé, copied as-is to the site root |

All motion is switched off for visitors who set "reduce motion" on their device.

## Deploy

Build, then upload the `dist/` folder anywhere static. Or connect the repo to Vercel or Netlify: they detect Vite automatically (build command `npm run build`, output folder `dist`). `vite.config.ts` uses relative paths, so the build also works on GitHub Pages under a sub-path.
