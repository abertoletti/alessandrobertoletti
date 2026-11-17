# Alessandro Bertoletti — personal website

Bilingual personal portfolio: software development, consulting, AI agents and selected projects.

**Website:** https://alessandrobertoletti.it/

## Run locally

Requires Node.js 22 or later. No package installation is needed.

```sh
npm run dev
npm run check
npm run build
npm run preview
```

The local server uses http://127.0.0.1:4173. Stop the development server before starting the preview on the same port. The server is for local development; production is served by GitHub Pages.

## Structure

- `index.html`, `en/index.html`: Italian and English content, navigation and metadata.
- `src/style.css`: page layout and responsive styles.
- `src/main.js`, `src/portrait-framing.js`: portrait selection, framing, crossfade and direct high-resolution image rendering.
- `src/playground.js`: optional atmospheres, input, scene state and animation loop.
- `src/season-icons.js`, `src/season-renderers.js`: shared icons and canvas renderers.
- `src/playground.css`: seasonal appearance, controls and tools.
- `public/portraits/optimized/`: nine high-quality production WebP portraits, encoded at 98% quality.
- `scripts/build.mjs`: creates a clean `dist/` with only production assets.

Original generated images and retouch comparisons are retained in the repository for editing. They are excluded from the production build. The supplied original corporate photograph and CV are not included.

## Publishing

`.github/workflows/pages.yml` checks and builds each push to `main`, then deploys `dist/` to GitHub Pages. It can also be run manually from Actions. Relative asset paths support the repository subdirectory and a future custom domain. The custom domain alessandrobertoletti.it is configured with HTTPS enforced; www redirects to the apex domain.

## Content and interactions

Update both HTML pages when editing copy. The page order is introduction, approach, projects, experience, companies and contact. Contact uses email only.

Atmospheres start off. Autumn has leaves and a wind tool; winter has snowballs formed automatically anywhere and thrown with a drag gesture. Snowballs can knock down photos, headings, buttons and tags; Put things back restores affected elements, and switching seasons resets the scene; spring has growing flowers, butterflies and bees; summer has sand, a shovel and a wave that clears grooves. Escape exits a tool. Reduced-motion preferences and the footer interaction toggle are respected. Text and navigation remain available without JavaScript.

The professional portrait is always shown. In each season, a small circular window follows the pointer and reveals the playful photo underneath; dragging a finger or using arrow keys provides the same limited reveal. Neutral mode always uses the main portrait. Portraits were edited from the supplied reference through ElevenLabs, with a subsequent local under-eye correction that preserves pixels outside feathered masks.

## Sources and credits

- Project descriptions and approved brand assets: the owner's GeoPieno and Keepify repositories.
- Company logos: official FrameTECH/Longwave, Logol and Dynabit websites, retrieved 2026-11-16.
- Typography: DM Sans from Google Fonts, with system fallback.
- Interaction references: https://www.bruno-simon.com/, https://whimsy.joshwcomeau.com/ and Apple's Liquid Glass motion guidance. No source code was copied from these portfolios.

Company marks belong to their respective owners. Personal photographs are included as portfolio assets.

## Animation performance

The weather canvas is idle while atmospheres are off, pauses in hidden tabs and renders on demand with reduced motion. Snow shading is rasterized once and reused. Snowball collision bounds are shared by projectiles within a frame. The initial portrait is present in HTML with high fetch priority, including when JavaScript is unavailable.
