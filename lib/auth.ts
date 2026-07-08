import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { getFirebaseAuth, isFirebaseConfigured } from '@/lib/firebase'

export function requireFirebaseAuth() {
  if (!isFirebaseConfigured()) {
    throw new Error('FIREBASE_NOT_CONFIGURED')
  }
  return getFirebaseAuth()
}

export async function signInWithEmail(email: string, password: string) {
  await signInWithEmailAndPassword(requireFirebaseAuth(), email.trim(), password)
}

export async function registerWithEmail(
  email: string,
  password: string,
  displayName?: string
) {
  const auth = requireFirebaseAuth()
  const credential = await createUserWithEmailAndPassword(auth, email.trim(), password)
  const name = displayName?.trim()
  if (name) {
    await updateProfile(credential.user, { displayName: name })
  }
}

export async function signInWithGoogle() {
  await signInWithPopup(requireFirebaseAuth(), new GoogleAuthProvider())
}

export async function resetPassword(email: string) {
  await sendPasswordResetEmail(requireFirebaseAuth(), email.trim())
}

export async function logout() {
  if (!isFirebaseConfigured()) return
  await signOut(getFirebaseAuth())
}

export function authErrorKey(code: string): string {
  switch (code) {
    case 'auth/invalid-email':
      return 'auth.error.invalidEmail'
    case 'auth/user-disabled':
      return 'auth.error.userDisabled'
    case 'auth/user-not-found':
    case 'auth/invalid-credential':
      return 'auth.error.wrongCredentials'
    case 'auth/wrong-password':
      return 'auth.error.wrongPassword'
    case 'auth/email-already-in-use':
      return 'auth.error.emailInUse'
    case 'auth/weak-password':
      return 'auth.error.weakPassword'
    case 'auth/too-many-requests':
      return 'auth.error.tooManyRequests'
    case 'auth/popup-closed-by-user':
      return 'auth.error.popupClosed'
    case 'auth/network-request-failed':
      return 'auth.error.network'
    case 'auth/operation-not-allowed':
      return 'auth.error.operationNotAllowed'
    case 'auth/unauthorized-domain':
      return 'auth.error.unauthorizedDomain'
    default:
      return 'auth.error.generic'
  }
}

export function getAuthErrorMessage(error: unknown, t: (key: string) => string): string {
  if (error && typeof error === 'object' && 'code' in error) {
    return t(authErrorKey(String((error as { code: string }).code)))
  }
  return t('auth.error.generic')
}
