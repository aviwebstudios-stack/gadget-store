# Delux Tech Gadget

Online store for Delux Tech Gadget in Benin City: phones, laptops, cameras, speakers, headsets and consoles.

Built with Next.js 14 (App Router), Tailwind CSS, Prisma on PostgreSQL, Clerk for customer accounts, Flutterwave for payments and Vercel Blob for product photos.

## Setup

1. Copy `.env.example` to `.env` and fill in the values.
2. Install and create the database tables:

```bash
npm install
npm run db:push
```

3. Start the dev server:

```bash
npm run dev
```

4. Create the admin account once at `/admin/setup` using `ADMIN_SETUP_KEY` from `.env`. After that, sign in at `/admin/login`.

## Media

The landing page videos load from Cloudinary (see `components/HeroVideo.tsx`). The background track is `public/ambient.mp3` and the logo is `public/logo.png`.

## Themes

The site opens in dark mode. Visitors can switch to light mode with the sun/moon button in the navbar, and the choice is saved in their browser. Colours are CSS variables in `app/globals.css`, mapped to Tailwind names in `tailwind.config.ts` (`page`, `surface`, `fg`, `fg-50` to `fg-90`, `success`, `danger` and so on). Use those instead of raw colours like `text-white`.
