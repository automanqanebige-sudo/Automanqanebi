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

function envValue(primary: string | undefined, fallback?: string): string {
  const v = primary?.trim() || fallback?.trim() || ''
  return v
}

/**
 * Same-origin authDomain prevents Google redirect/popup breakage on browsers
 * that block third-party storage (Chrome/Safari/Firefox). On production host,
 * always use automanqanebi.ge — not *.firebaseapp.com.
 */
export function resolveAuthDomain(configured: string): string {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname
    if (host === 'automanqanebi.ge' || host === 'www.automanqanebi.ge') {
      return host
    }
  }
  if (
    process.env.NODE_ENV === 'production' &&
    (!configured || configured.endsWith('.firebaseapp.com'))
  ) {
    return 'automanqanebi.ge'
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
  if (authInstance) return authInstance

  const app = getFirebaseApp()

  // Persistence + popupRedirectResolver required for Google on custom domains
  // (Safari/mobile block third-party storage across firebaseapp.com otherwise).
  if (typeof window !== 'undefined') {
    try {
      authInstance = initializeAuth(app, {
        persistence: [indexedDBLocalPersistence, browserLocalPersistence],
        popupRedirectResolver: browserPopupRedirectResolver,
      })
    } catch {
      // Already initialized (HMR / second call) — reuse.
      authInstance = getAuth(app)
    }
  } else {
    authInstance = getAuth(app)
  }

  return authInstance
}

export function getFirebaseStorage(): FirebaseStorage {
  if (!firebaseStorage) {
    firebaseStorage = getStorage(getFirebaseApp())
  }
  return firebaseStorage
}
