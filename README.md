# Gadget Store — Landing Page

Dark, cinematic landing page for a gadget store (phones, laptops, cameras,
speakers, headsets, consoles) — full-bleed looping video background, centered
logo + nav, ambient sound toggle, live Lagos clock.

## Before running: drop in your media files

Place these in the `public/` folder (exact filenames matter):
- `logo.png` — your logo
- `hero1.mp4` — desktop/tablet background video (≥500px width)
- `hero2.mp4` — mobile background video (<500px width)
- `ambient.mp3` — background music track

## Run it

```bash
npm install
npm run dev
```

Open the printed localhost URL.

## What's built
- `components/HeroVideo.tsx` — swaps between `hero1.mp4` and `hero2.mp4` at
  exactly the 500px breakpoint, reloads the video element on swap
- `components/SoundToggle.tsx` — toggle switch (not a hamburger — removed
  per spec since the nav is already fully visible) that plays/pauses
  `ambient.mp3` on loop
- `components/LiveClock.tsx` — ticks every second, Lagos timezone
- `components/NavLinks.tsx` — Shop / New Arrivals / Contact / Track Order /
  FAQ, each already routed to a page path (pages not built yet — placeholders)
- `app/page.tsx` — assembles it all

## Not yet built (next steps)
- The actual Shop / New Arrivals / Contact / Track Order / FAQ pages
- Product catalog, cart, checkout — this is planned as full-stack, so once
  the landing page is approved we'll add a backend (DB + API) for products,
  orders, etc., same pattern as the previous projects
- Autoplay note: browsers block audio autoplay without user interaction —
  the toggle starts in "paused" state by design, user taps to start it
