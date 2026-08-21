import {
  EmailAuthProvider,
  GoogleAuthProvider,
  browserPopupRedirectResolver,
  createUserWithEmailAndPassword,
  getRedirectResult,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  reload,
  sendPasswordResetEmail,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  updatePassword,
  updateProfile,
  verifyBeforeUpdateEmail,
  type User,
} from 'firebase/auth'
import { getFirebaseAuth, isFirebaseConfigured } from '@/lib/firebase'

const GOOGLE_REDIRECT_PATH_KEY = 'am_google_auth_redirect'

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
  try {
    await sendEmailVerification(credential.user)
  } catch {
    /* email templates may be unavailable locally */
  }
}

/** Popup failures that are safe to retry with a full-page redirect flow. */
const POPUP_FALLBACK_CODES = new Set([
  'auth/popup-blocked',
  'auth/cancelled-popup-request',
  'auth/operation-not-supported-in-this-environment',
  'auth/web-storage-unsupported',
  'auth/network-request-failed',
  'auth/internal-error',
])

function shouldPreferGoogleRedirect(): boolean {
  if (typeof window === 'undefined') return true
  const ua = navigator.userAgent || ''
  const isIOS = /iPad|iPhone|iPod/.test(ua)
  const isInApp = /FBAN|FBAV|Instagram|Line\/|TikTok|Snapchat/i.test(ua)
  const isSafari = /Safari/i.test(ua) && !/Chrome|CriOS|Edg|OPR|Firefox/i.test(ua)
  return isIOS || isInApp || isSafari
}

export function stashGoogleRedirectPath(path: string): void {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(GOOGLE_REDIRECT_PATH_KEY, path.startsWith('/') ? path : '/profile')
  } catch {
    /* ignore */
  }
}

export function takeGoogleRedirectPath(): string | null {
  if (typeof window === 'undefined') return null
  try {
    const path = sessionStorage.getItem(GOOGLE_REDIRECT_PATH_KEY)
    sessionStorage.removeItem(GOOGLE_REDIRECT_PATH_KEY)
    return path && path.startsWith('/') ? path : null
  } catch {
    return null
  }
}

function googleProvider() {
  const provider = new GoogleAuthProvider()
  provider.addScope('profile')
  provider.addScope('email')
  provider.setCustomParameters({ prompt: 'select_account' })
  return provider
}

export type GoogleSignInResult = {
  method: 'popup' | 'redirect'
  user?: User
}

export async function signInWithGoogle(): Promise<GoogleSignInResult> {
  const auth = requireFirebaseAuth()
  const provider = googleProvider()

  if (shouldPreferGoogleRedirect()) {
    await signInWithRedirect(auth, provider, browserPopupRedirectResolver)
    return { method: 'redirect' }
  }

  try {
    const cred = await signInWithPopup(auth, provider, browserPopupRedirectResolver)
    return { method: 'popup', user: cred.user }
  } catch (err) {
    const code = (err as { code?: string } | null)?.code
    // User closed the popup — do not force redirect.
    if (code === 'auth/popup-closed-by-user') {
      throw err
    }
    if (code && POPUP_FALLBACK_CODES.has(code)) {
      await signInWithRedirect(auth, provider, browserPopupRedirectResolver)
      return { method: 'redirect' }
    }
    throw err
  }
}

/** Completes a pending Google redirect sign-in (call once on app load). */
export async function completeGoogleRedirect(): Promise<User | null> {
  if (!isFirebaseConfigured()) return null
  try {
    const result = await getRedirectResult(getFirebaseAuth(), browserPopupRedirectResolver)
    return result?.user ?? null
  } catch {
    return null
  }
}

export async function resetPassword(email: string) {
  await sendPasswordResetEmail(requireFirebaseAuth(), email.trim())
}

export function hasPasswordProvider(): boolean {
  const user = getFirebaseAuth().currentUser
  return Boolean(user?.providerData.some((p) => p.providerId === 'password'))
}

async function reauthenticate(currentPassword?: string) {
  const auth = requireFirebaseAuth()
  const user = auth.currentUser
  if (!user) throw new Error('NO_USER')

  const hasPassword = user.providerData.some((p) => p.providerId === 'password')
  if (hasPassword && user.email) {
    const cred = EmailAuthProvider.credential(user.email, currentPassword ?? '')
    await reauthenticateWithCredential(user, cred)
  } else {
    await reauthenticateWithPopup(user, googleProvider(), browserPopupRedirectResolver)
  }
  return user
}

export async function updateDisplayName(displayName: string) {
  const auth = requireFirebaseAuth()
  const user = auth.currentUser
  if (!user) throw new Error('NO_USER')
  await updateProfile(user, { displayName: displayName.trim() })
  await reload(user)
}

export async function updateProfilePhoto(photoURL: string) {
  const auth = requireFirebaseAuth()
  const user = auth.currentUser
  if (!user) throw new Error('NO_USER')
  await updateProfile(user, { photoURL: photoURL.trim() })
  await reload(user)
}

export async function removeProfilePhoto() {
  const auth = requireFirebaseAuth()
  const user = auth.currentUser
  if (!user) throw new Error('NO_USER')
  await updateProfile(user, { photoURL: null })
  await reload(user)
}

export async function changeUserPassword(currentPassword: string, newPassword: string) {
  const user = await reauthenticate(currentPassword)
  await updatePassword(user, newPassword)
}

export async function changeUserEmail(currentPassword: string, newEmail: string) {
  const user = await reauthenticate(currentPassword)
  await verifyBeforeUpdateEmail(user, newEmail.trim())
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
    case 'auth/popup-blocked':
      return 'auth.error.popupBlocked'
    case 'auth/network-request-failed':
      return 'auth.error.network'
    case 'auth/operation-not-allowed':
      return 'auth.error.operationNotAllowed'
    case 'auth/unauthorized-domain':
      return 'auth.error.unauthorizedDomain'
    case 'auth/account-exists-with-different-credential':
      return 'auth.error.accountExists'
    case 'auth/requires-recent-login':
      return 'auth.error.recentLogin'
    case 'auth/missing-password':
      return 'auth.error.wrongPassword'
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
