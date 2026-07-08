import {
  type FirebaseApp,
  type FirebaseOptions,
  getApp,
  getApps,
  initializeApp,
} from 'firebase/app'
import { type Auth, getAuth } from 'firebase/auth'
import { type FirebaseStorage, getStorage } from 'firebase/storage'

function envValue(primary: string | undefined, fallback?: string): string {
  const v = primary?.trim() || fallback?.trim() || ''
  return v
}

export function readFirebaseOptions(): FirebaseOptions {
  const options: FirebaseOptions = {
    apiKey: envValue(
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      process.env.FIREBASE_API_KEY
    ),
    authDomain: envValue(
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      process.env.FIREBASE_AUTH_DOMAIN
    ),
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
  if (!authInstance) {
    authInstance = getAuth(getFirebaseApp())
  }
  return authInstance
}

export function getFirebaseStorage(): FirebaseStorage {
  if (!firebaseStorage) {
    firebaseStorage = getStorage(getFirebaseApp())
  }
  return firebaseStorage
}
