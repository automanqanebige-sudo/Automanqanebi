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
import { safeAppPath, isSafeAppPath } from '@/lib/safe-redirect'

const GOOGLE_REDIRECT_PATH_KEY = 'am_google_auth_redirect'
/** Set only when starting a full-page Google redirect; consumed once after return. */
const GOOGLE_REDIRECT_PENDING_KEY = 'am_google_auth_pending'

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
  displayName?: string,
  accountType?: 'individual' | 'company'
) {
  const auth = requireFirebaseAuth()
  const credential = await createUserWithEmailAndPassword(auth, email.trim(), password)
  const name = displayName?.trim()
  if (name) {
    await updateProfile(credential.user, { displayName: name })
  }
  try {
    const { saveUserProfile } = await import('@/lib/user-profile-firestore')
    await saveUserProfile(credential.user.uid, {
      displayName: name || undefined,
      accountType:
        accountType === 'individual' || accountType === 'company' ? accountType : undefined,
      role: 'user',
    })
  } catch {
    /* profile write is best-effort */
  }
  try {
    await sendEmailVerification(credential.user)
  } catch {
    /* email templates may be unavailable locally */
  }
}

const REGISTER_ACCOUNT_TYPE_KEY = 'am_register_account_type'

export function stashRegisterAccountType(accountType: 'individual' | 'company'): void {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(REGISTER_ACCOUNT_TYPE_KEY, accountType)
  } catch {
    /* ignore */
  }
}

export function takeRegisterAccountType(): 'individual' | 'company' | null {
  if (typeof window === 'undefined') return null
  try {
    const value = sessionStorage.getItem(REGISTER_ACCOUNT_TYPE_KEY)
    sessionStorage.removeItem(REGISTER_ACCOUNT_TYPE_KEY)
    if (value === 'individual' || value === 'company') return value
  } catch {
    /* ignore */
  }
  return null
}

export function peekRegisterAccountType(): 'individual' | 'company' | null {
  if (typeof window === 'undefined') return null
  try {
    const value = sessionStorage.getItem(REGISTER_ACCOUNT_TYPE_KEY)
    if (value === 'individual' || value === 'company') return value
  } catch {
    /* ignore */
  }
  return null
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

const PRODUCTION_AUTH_HOSTS = new Set(['automanqanebi.ge', 'www.automanqanebi.ge'])

/**
 * Redirect is most reliable on our custom domain (same-origin /__/auth proxy).
 * Popup remains the default on localhost and Firebase preview hosts.
 */
function shouldPreferGoogleRedirect(): boolean {
  if (typeof window === 'undefined') return false
  const host = window.location.hostname
  if (PRODUCTION_AUTH_HOSTS.has(host)) return true
  const ua = navigator.userAgent || ''
  return /FBAN|FBAV|Instagram|Line\/|TikTok|Snapchat|WhatsApp|Telegram|MicroMessenger|GSA\//i.test(
    ua
  )
}

function writeGoogleRedirectPath(path: string): void {
  const safe = safeAppPath(path, '/profile')
  // Session-only — localStorage caused random jumps after later page reloads.
  try {
    sessionStorage.setItem(GOOGLE_REDIRECT_PATH_KEY, safe)
  } catch {
    /* ignore */
  }
  try {
    localStorage.removeItem(GOOGLE_REDIRECT_PATH_KEY)
  } catch {
    /* ignore */
  }
}

function readGoogleRedirectPath(): string | null {
  let path: string | null = null
  try {
    path = sessionStorage.getItem(GOOGLE_REDIRECT_PATH_KEY)
  } catch {
    /* ignore */
  }
  // Migrate / wipe legacy localStorage stash so it can never redirect again.
  try {
    const legacy = localStorage.getItem(GOOGLE_REDIRECT_PATH_KEY)
    if (legacy) localStorage.removeItem(GOOGLE_REDIRECT_PATH_KEY)
    if (!path && legacy && isSafeAppPath(legacy)) {
      // Do not resurrect legacy into session — it was the bug source.
    }
  } catch {
    /* ignore */
  }
  return isSafeAppPath(path) ? path.trim() : null
}

export function clearGoogleRedirectPath(): void {
  try {
    sessionStorage.removeItem(GOOGLE_REDIRECT_PATH_KEY)
  } catch {
    /* ignore */
  }
  try {
    localStorage.removeItem(GOOGLE_REDIRECT_PATH_KEY)
  } catch {
    /* ignore */
  }
}

export function markGoogleRedirectPending(): void {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(GOOGLE_REDIRECT_PENDING_KEY, '1')
  } catch {
    /* ignore */
  }
}

export function clearGoogleRedirectPending(): void {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.removeItem(GOOGLE_REDIRECT_PENDING_KEY)
  } catch {
    /* ignore */
  }
}

/** Returns true once if a Google redirect was in progress; clears the flag. */
export function consumeGoogleRedirectPending(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const pending = sessionStorage.getItem(GOOGLE_REDIRECT_PENDING_KEY)
    if (pending) {
      sessionStorage.removeItem(GOOGLE_REDIRECT_PENDING_KEY)
      return true
    }
  } catch {
    /* ignore */
  }
  return false
}

export function stashGoogleRedirectPath(path: string): void {
  if (typeof window === 'undefined') return
  writeGoogleRedirectPath(path)
}

export function peekGoogleRedirectPath(): string | null {
  if (typeof window === 'undefined') return null
  return readGoogleRedirectPath()
}

export function takeGoogleRedirectPath(): string | null {
  if (typeof window === 'undefined') return null
  const path = readGoogleRedirectPath()
  clearGoogleRedirectPath()
  return path
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
  const resolver = browserPopupRedirectResolver

  if (shouldPreferGoogleRedirect()) {
    await signInWithRedirect(auth, provider, resolver)
    return { method: 'redirect' }
  }

  try {
    const cred = await signInWithPopup(auth, provider, resolver)
    return { method: 'popup', user: cred.user }
  } catch (err) {
    const code = (err as { code?: string } | null)?.code
    if (code === 'auth/popup-closed-by-user') {
      throw err
    }
    if (!code || POPUP_FALLBACK_CODES.has(code)) {
      await signInWithRedirect(auth, provider, resolver)
      return { method: 'redirect' }
    }
    throw err
  }
}

/** Completes a pending Google redirect sign-in (call once on app load). */
export async function completeGoogleRedirect(): Promise<User | null> {
  if (!isFirebaseConfigured()) return null
  try {
    const result = await getRedirectResult(
      getFirebaseAuth(),
      browserPopupRedirectResolver
    )
    return result?.user ?? null
  } catch (err) {
    const code = (err as { code?: string } | null)?.code
    // No pending redirect — not an error.
    if (
      code === 'auth/no-auth-event' ||
      code === 'auth/argument-error' ||
      code === 'auth/invalid-credential'
    ) {
      return null
    }
    console.error('[auth] getRedirectResult', err)
    throw err
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
    await reauthenticateWithPopup(
      user,
      googleProvider(),
      browserPopupRedirectResolver
    )
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
