# AUTOMANQANEBI1.GE

Next.js marketplace project (this repo targets **automanqanebi1.ge** — separate from any older **automanqanebi.ge** deployment).

**Intended production URL:** https://automanqanebi1.ge  

სანამ დომენს და ჰოსტინგს (მაგ. Vercel + DNS) არ მიაბამ, საიტი ამ მისამართზე ინტერნეტში არ გამოჩნდება. ლოკალურად: `npm run dev` → http://localhost:3000

## Run locally

1. Install Node.js (LTS).
2. Install a package manager (`npm`, `pnpm`, or `yarn`).
3. Install dependencies:
   - `npm install` (same as Vercel; generate `package-lock.json` if you want locked versions)
4. Start development server:
   - `npm run dev` or `pnpm dev`

## Project structure

- `app/` - Next.js App Router pages and API routes
- `components/` - UI components
- `context/` - React context providers
- `data/` - static data and seed-like files
- `lib/` - shared helper utilities
