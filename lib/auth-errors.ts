/** Maps Firebase Auth error codes to i18n keys (auth.error.*). */
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
    default:
      return 'auth.error.generic'
  }
}

export function getAuthErrorMessage(
  error: unknown,
  t: (key: string) => string
): string {
  if (error && typeof error === 'object' && 'code' in error) {
    const code = String((error as { code: string }).code)
    return t(authErrorKey(code))
  }
  return t('auth.error.generic')
}
