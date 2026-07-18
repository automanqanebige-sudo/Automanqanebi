import {
  EmailAuthProvider,
  GoogleAuthProvider,
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
  try {
    await sendEmailVerification(credential.user)
  } catch {
    /* email templates may be unavailable locally */
  }
}

/** Popup failures that are safe to retry with a full-page redirect flow. */
const POPUP_FALLBACK_CODES = new Set([
  'auth/popup-blocked',
  'auth/popup-closed-by-user',
  'auth/cancelled-popup-request',
  'auth/operation-not-supported-in-this-environment',
  'auth/web-storage-unsupported',
  'auth/network-request-failed',
])

export async function signInWithGoogle() {
  const auth = requireFirebaseAuth()
  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({ prompt: 'select_account' })

  try {
    await signInWithPopup(auth, provider)
  } catch (err) {
    const code = (err as { code?: string } | null)?.code
    if (code && POPUP_FALLBACK_CODES.has(code)) {
      // Popup was blocked / unsupported — fall back to full-page redirect.
      await signInWithRedirect(auth, provider)
      return
    }
    throw err
  }
}

/** Completes a pending Google redirect sign-in (call once on app load). */
export async function completeGoogleRedirect() {
  if (!isFirebaseConfigured()) return
  try {
    await getRedirectResult(getFirebaseAuth())
  } catch {
    // onAuthStateChanged is the source of truth; ignore transient redirect errors.
  }
}

export async function resetPassword(email: string) {
  await sendPasswordResetEmail(requireFirebaseAuth(), email.trim())
}

/** Whether the signed-in user has an email/password credential. */
export function hasPasswordProvider(): boolean {
  const user = getFirebaseAuth().currentUser
  return Boolean(user?.providerData.some((p) => p.providerId === 'password'))
}

/**
 * Re-authenticates the current user. Uses the supplied password when the account
 * has a password credential, otherwise falls back to a Google popup.
 */
async function reauthenticate(currentPassword?: string) {
  const auth = requireFirebaseAuth()
  const user = auth.currentUser
  if (!user) throw new Error('NO_USER')

  const hasPassword = user.providerData.some((p) => p.providerId === 'password')
  if (hasPassword && user.email) {
    const cred = EmailAuthProvider.credential(user.email, currentPassword ?? '')
    await reauthenticateWithCredential(user, cred)
  } else {
    await reauthenticateWithPopup(user, new GoogleAuthProvider())
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
  // Sends a confirmation link to the new address; email updates after the user confirms.
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
