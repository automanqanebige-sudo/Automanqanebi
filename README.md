# AUTOMANQANEBI.GE

Next.js marketplace project for **automanqanebi.ge**.

**Intended production URL:** https://automanqanebi.ge  

სანამ დომენს და ჰოსტინგს (მაგ. Vercel + DNS) არ მიაბამ, საიტი ამ მისამართზე ინტერნეტში არ გამოჩნდება. ლოკალურად: `npm run dev` → http://localhost:3000

## Run locally

1. Install Node.js (LTS).
2. Install a package manager (`npm`, `pnpm`, or `yarn`).
3. Install dependencies:
   - `npm install` (same as Vercel; generate `package-lock.json` if you want locked versions)
4. Start development server:
   - `npm run dev` or `pnpm dev`

## Deploy to production (Vercel)

1. Fix Vercel billing if needed (account must have valid payment method).
2. Set environment variables on Vercel (same as `.env.local`):
   - All `NEXT_PUBLIC_FIREBASE_*` keys
   - `NEXT_PUBLIC_USE_SAMPLE_DATA=false`
   - `NEXT_PUBLIC_ADMIN_EMAILS=your@email.com`
3. Deploy:
   ```bash
   npx vercel deploy --prod
   ```
4. Point domain `automanqanebi.ge` DNS to Vercel.
5. Firebase Console → Authentication → add `automanqanebi.ge` and `*.vercel.app` to authorized domains.
6. Deploy Firestore/Storage rules:
   ```bash
   npx firebase login
   npx firebase deploy --only firestore:rules,storage
   ```
7. For admin delete in Firestore, add document `admins/{your-firebase-uid}` in Firestore.


- `app/` - Next.js App Router pages and API routes
- `components/` - UI components
- `context/` - React context providers
- `data/` - static data and seed-like files
- `lib/` - shared helper utilities
