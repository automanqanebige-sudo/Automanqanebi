# AUTOMANQANEBI.GE

Next.js car marketplace for **automanqanebi.ge**, hosted entirely on **Firebase**.

**Intended production URL:** https://automanqanebi.ge

Backend services (all Firebase):
- **Authentication** — email/password + Google
- **Firestore** — cars, services, chat, favorites
- **Storage** — car images
- **App Hosting** — Next.js SSR hosting

Locally: `npm run dev` → http://localhost:3000

## Run locally

1. Install Node.js (LTS).
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local` and fill in the Firebase web config.
4. Start dev server: `npm run dev`

## Deploy to production (Firebase App Hosting)

Firebase App Hosting requires the **Blaze** plan.
Upgrade: https://console.firebase.google.com/project/automanqanebi1/overview?purchaseBillingPlan=metered

### Option A — Git push to deploy (recommended)

1. Firebase Console → **App Hosting** → **Create backend**.
2. Connect GitHub repo `automanqanebige-sudo/Automanqanebi` and choose the deploy branch.
3. Firebase builds automatically on every push and gives a `*.web.app` URL.
4. Add a custom domain (`automanqanebi.ge`) in App Hosting → Custom domain.

### Option B — Deploy from CLI

```bash
npx firebase login
npx firebase deploy
```

### After first deploy

- Firebase Console → Authentication → Authorized domains: add your App Hosting URL and `automanqanebi.ge`.
- Deploy security rules (if not already): `npx firebase deploy --only firestore:rules,storage`
- For the admin panel delete permission, add a Firestore document `admins/{your-firebase-uid}`.

Environment flags (already set in `apphosting.yaml`):
- `NEXT_PUBLIC_USE_SAMPLE_DATA=false` — hides demo listings in production
- `NEXT_PUBLIC_ADMIN_EMAILS` — comma-separated admin emails for `/admin`

## Project structure

- `app/` - Next.js App Router pages and API routes
- `components/` - UI components
- `context/` - React context providers
- `data/` - static data and seed-like files
- `lib/` - shared helper utilities
- `apphosting.yaml` - Firebase App Hosting config
- `firestore.rules` / `storage.rules` - security rules
