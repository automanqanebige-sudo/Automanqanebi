import type { Auth, RecaptchaVerifier } from 'firebase/auth'

type RecaptchaSize = 'invisible' | 'normal'

/**
 * Create a Firebase RecaptchaVerifier bound to a DOM element.
 * Prefer `normal` (visible checkbox) for Phone Auth — more reliable than invisible.
 */
export async function createRecaptchaVerifier(
  auth: Auth,
  container: HTMLElement | string,
  size: RecaptchaSize = 'normal'
): Promise<RecaptchaVerifier> {
  const { RecaptchaVerifier } = await import('firebase/auth')

  if (typeof container === 'string') {
    const el = document.getElementById(container)
    if (el) el.innerHTML = ''
  } else {
    container.innerHTML = ''
  }

  const verifier = new RecaptchaVerifier(auth, container, {
    size,
    callback: () => {
      /* solved */
    },
    'expired-callback': () => {
      /* user must solve again */
    },
  })

  await verifier.render()
  return verifier
}

export function clearRecaptchaVerifier(verifier: RecaptchaVerifier | null | undefined): void {
  if (!verifier) return
  try {
    verifier.clear()
  } catch {
    /* ignore */
  }
}

/** Map Firebase Auth phone/recaptcha errors to locale keys. */
export function phoneAuthErrorLocaleKey(err: unknown): string {
  const code = (err as { code?: string } | null)?.code || ''
  switch (code) {
    case 'auth/too-many-requests':
      return 'phoneOtp.tooMany'
    case 'auth/invalid-phone-number':
      return 'phoneOtp.invalidPhone'
    case 'auth/captcha-check-failed':
    case 'auth/invalid-app-credential':
    case 'auth/argument-error':
      return 'phoneOtp.recaptchaFailed'
    case 'auth/credential-already-in-use':
    case 'auth/provider-already-linked':
    case 'auth/account-exists-with-different-credential':
      return 'phoneOtp.alreadyLinked'
    case 'auth/code-expired':
      return 'phoneOtp.codeExpired'
    case 'auth/invalid-verification-code':
      return 'phoneOtp.verifyError'
    case 'auth/missing-phone-number':
      return 'phoneOtp.invalidPhone'
    default:
      return 'phoneOtp.sendError'
  }
}
