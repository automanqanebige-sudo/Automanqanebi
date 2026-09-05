import {
  type FirebaseApp,
  type FirebaseOptions,
  getApp,
  getApps,
  initializeApp,
} from 'firebase/app'
import {
  type Auth,
  browserLocalPersistence,
  browserPopupRedirectResolver,
  getAuth,
  indexedDBLocalPersistence,
  initializeAuth,
} from 'firebase/auth'
import { type FirebaseStorage, getStorage } from 'firebase/storage'

const FIREBASE_AUTH_HOST = 'automanqanebi1.firebaseapp.com'
const PRODUCTION_AUTH_HOST = 'automanqanebi.ge'

function envValue(primary: string | undefined, fallback?: string): string {
  const v = primary?.trim() || fallback?.trim() || ''
  return v
}

/**
 * authDomain must match the page origin for redirect, and must NEVER point at the
 * custom domain while developing on localhost (breaks Google OAuth).
 *
 * Production custom domain keeps same-origin auth helpers via /__/auth rewrite.
 * Localhost always uses *.firebaseapp.com.
 */
export function resolveAuthDomain(configured: string): string {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname
    if (host === 'localhost' || host === '127.0.0.1') {
      return FIREBASE_AUTH_HOST
    }
    if (host === 'automanqanebi.ge' || host === 'www.automanqanebi.ge') {
      return PRODUCTION_AUTH_HOST
    }
    if (host.endsWith('.web.app') || host.endsWith('.firebaseapp.com')) {
      return host
    }
  }

  if (configured === 'localhost' || !configured) {
    return FIREBASE_AUTH_HOST
  }

  if (
    process.env.NODE_ENV === 'production' &&
    configured.endsWith('.firebaseapp.com')
  ) {
    return PRODUCTION_AUTH_HOST
  }

  return configured
}

export function readFirebaseOptions(): FirebaseOptions {
  const configuredAuthDomain = envValue(
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    process.env.FIREBASE_AUTH_DOMAIN
  )
  const options: FirebaseOptions = {
    apiKey: envValue(
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      process.env.FIREBASE_API_KEY
    ),
    authDomain: resolveAuthDomain(configuredAuthDomain),
    projectId: envValue(
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      process.env.FIREBASE_PROJECT_ID
    ),
    storageBucket: envValue(
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      process.env.FIREBASE_STORAGE_BUCKET
    ),
    messagingSenderId: envValue(
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      process.env.FIREBASE_MESSAGING_SENDER_ID
    ),
    appId: envValue(process.env.NEXT_PUBLIC_FIREBASE_APP_ID, process.env.FIREBASE_APP_ID),
  }

  const measurementId = envValue(
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    process.env.FIREBASE_MEASUREMENT_ID
  )
  if (measurementId) {
    options.measurementId = measurementId
  }

  return options
}

export function isFirebaseConfigured(): boolean {
  const o = readFirebaseOptions()
  return Boolean(
    o.apiKey &&
      o.authDomain &&
      o.projectId &&
      o.storageBucket &&
      o.messagingSenderId &&
      o.appId
  )
}

let cachedApp: FirebaseApp | undefined
let authInstance: Auth | undefined
let firebaseStorage: FirebaseStorage | undefined

function createBrowserAuth(app: FirebaseApp): Auth {
  try {
    return initializeAuth(app, {
      persistence: [indexedDBLocalPersistence, browserLocalPersistence],
      popupRedirectResolver: browserPopupRedirectResolver,
    })
  } catch {
    // HMR / duplicate init — reuse existing instance.
    return getAuth(app)
  }
}

export function getFirebaseApp(): FirebaseApp {
  if (cachedApp) return cachedApp

  if (getApps().length > 0) {
    cachedApp = getApp()
    return cachedApp
  }

  const options = readFirebaseOptions()
  if (!isFirebaseConfigured()) {
    throw new Error(
      'Firebase არ არის სრულად კონფიგურირებული. დაამატე NEXT_PUBLIC_FIREBASE_* ცვლადები .env.local-ში.'
    )
  }

  cachedApp = initializeApp(options)
  return cachedApp
}

export function getFirebaseAuth(): Auth {
  const app = getFirebaseApp()

  // Never reuse a server-created Auth instance in the browser — it lacks
  // popupRedirectResolver and breaks Google sign-in after SSR hydration.
  if (typeof window !== 'undefined') {
    if (!authInstance) {
      authInstance = createBrowserAuth(app)
    }
    return authInstance
  }

  return getAuth(app)
}

export function getFirebaseStorage(): FirebaseStorage {
  if (!firebaseStorage) {
    firebaseStorage = getStorage(getFirebaseApp())
  }
  return firebaseStorage
}
