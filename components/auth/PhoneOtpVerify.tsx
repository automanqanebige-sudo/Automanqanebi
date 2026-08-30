'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { RecaptchaVerifier } from 'firebase/auth'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { saveUserProfile } from '@/lib/user-profile-firestore'
import { isFirebaseConfigured } from '@/lib/firebase'
import { formatPhoneDisplay, toE164Phone } from '@/lib/phone'
import {
  clearPendingPhoneOtp,
  getPendingPhoneOtp,
  setPendingPhoneOtp,
} from '@/lib/phone-otp-session'
import {
  clearRecaptchaVerifier,
  createRecaptchaVerifier,
  phoneAuthErrorLocaleKey,
} from '@/lib/firebase-recaptcha'

/**
 * Firebase Phone Auth OTP with visible Google reCAPTCHA.
 * Optimized for Georgian numbers (+995).
 */
export default function PhoneOtpVerify({
  onVerified,
  compact,
  defaultPhone,
}: {
  onVerified?: (phone: string) => void
  compact?: boolean
  defaultPhone?: string
} = {}) {
  const { t } = useLanguage()
  const { user } = useAuth()
  const containerRef = useRef<HTMLDivElement>(null)
  const pending = typeof window !== 'undefined' ? getPendingPhoneOtp() : null
  const [phone, setPhone] = useState(
    () => (pending ? formatPhoneDisplay(pending.e164) : defaultPhone) ?? ''
  )
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'phone' | 'code' | 'done'>(() =>
    pending ? 'code' : 'phone'
  )
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [captchaReady, setCaptchaReady] = useState(false)
  const verifierRef = useRef<RecaptchaVerifier | null>(null)

  useEffect(() => {
    if (defaultPhone && step === 'phone') setPhone(defaultPhone)
  }, [defaultPhone, step])

  const destroyVerifier = useCallback(() => {
    clearRecaptchaVerifier(verifierRef.current)
    verifierRef.current = null
    setCaptchaReady(false)
  }, [])

  const ensureVerifier = useCallback(async () => {
    if (!isFirebaseConfigured() || !containerRef.current) {
      throw new Error('recaptcha-container-missing')
    }

    const { getFirebaseAuth } = await import('@/lib/firebase')
    const auth = getFirebaseAuth()

    if (verifierRef.current) {
      return { auth, verifier: verifierRef.current }
    }

    const verifier = await createRecaptchaVerifier(auth, containerRef.current, 'normal')
    verifierRef.current = verifier
    setCaptchaReady(true)
    return { auth, verifier }
  }, [])

  const resetCaptcha = useCallback(async () => {
    destroyVerifier()
    if (containerRef.current) containerRef.current.innerHTML = ''
    await new Promise((r) => setTimeout(r, 50))
    try {
      await ensureVerifier()
    } catch (err) {
      console.error('[PhoneOtp] recaptcha init', err)
      setError(t('phoneOtp.recaptchaFailed'))
    }
  }, [destroyVerifier, ensureVerifier, t])

  useEffect(() => {
    return () => {
      destroyVerifier()
      // Do not clear pending OTP session — auth re-renders remount this component
    }
  }, [destroyVerifier])

  useEffect(() => {
    if (step !== 'phone') return
    let cancelled = false

    const init = async () => {
      setError('')
      try {
        await ensureVerifier()
      } catch (err) {
        if (!cancelled) {
          console.error('[PhoneOtp] recaptcha init', err)
          setError(t('phoneOtp.recaptchaFailed'))
        }
      }
    }

    void init()

    return () => {
      cancelled = true
      destroyVerifier()
    }
  }, [step, ensureVerifier, destroyVerifier, t])

  const sendCode = async () => {
    if (!user) {
      setError(t('report.loginRequired'))
      return
    }
    if (!isFirebaseConfigured()) {
      setError(t('phoneOtp.notConfigured'))
      return
    }
    const e164 = toE164Phone(phone)
    if (!e164) {
      setError(t('phoneOtp.invalidPhone'))
      return
    }

    setBusy(true)
    setError('')
    try {
      const { linkWithPhoneNumber, signInWithPhoneNumber } = await import('firebase/auth')
      const { auth, verifier } = await ensureVerifier()

      const hasNonPhoneProvider =
        Boolean(user.email) || user.providerData.some((p) => p.providerId !== 'phone')

      const confirmation = hasNonPhoneProvider
        ? await linkWithPhoneNumber(user, e164, verifier)
        : await signInWithPhoneNumber(auth, e164, verifier)

      setPendingPhoneOtp(confirmation, e164)
      setPhone(formatPhoneDisplay(e164))
      setStep('code')
      destroyVerifier()
    } catch (err) {
      console.error('[PhoneOtp]', err)
      setError(t(phoneAuthErrorLocaleKey(err)))
      await resetCaptcha()
    } finally {
      setBusy(false)
    }
  }

  const verifyCode = async () => {
    if (!user) {
      setError(t('report.loginRequired'))
      return
    }
    const pendingOtp = getPendingPhoneOtp()
    if (!pendingOtp) {
      setError(t('phoneOtp.codeExpired'))
      setCode('')
      setStep('phone')
      return
    }
    const otp = code.trim()
    if (otp.length < 6) {
      setError(t('phoneOtp.verifyError'))
      return
    }

    setBusy(true)
    setError('')
    try {
      await pendingOtp.confirmation.confirm(otp)
      const normalized = pendingOtp.e164
      await saveUserProfile(user.uid, { phone: normalized, phoneVerified: true })
      clearPendingPhoneOtp()
      setStep('done')
      onVerified?.(normalized)
    } catch (err) {
      console.error('[PhoneOtp] verify', err)
      const key = phoneAuthErrorLocaleKey(err)
      setError(t(key === 'phoneOtp.sendError' ? 'phoneOtp.verifyError' : key))
    } finally {
      setBusy(false)
    }
  }

  if (step === 'done') {
    return <p className="mt-2 text-sm font-medium text-primary">{t('phoneOtp.success')}</p>
  }

  return (
    <div className={`space-y-3 ${compact ? 'mt-2' : 'mt-3'}`}>
      {!compact && step === 'phone' && (
        <p className="text-sm text-muted-foreground">{t('phoneOtp.subtitle')}</p>
      )}
      {step === 'phone' && (
        <p className="text-xs text-muted-foreground">{t('phoneOtp.recaptchaHint')}</p>
      )}

      {step === 'phone' ? (
        <>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+995 5XX XX XX XX"
            autoComplete="tel"
            inputMode="tel"
            enterKeyHint="send"
            className="w-full rounded-xl border border-input bg-background px-3 py-3 text-base sm:text-sm"
          />

          <div
            ref={containerRef}
            className="flex min-h-[78px] justify-center overflow-x-auto rounded-xl border border-border/60 bg-background px-2 py-2"
            aria-label="reCAPTCHA"
          />
          {!captchaReady && !error && (
            <p className="text-xs text-muted-foreground">{t('auth.loading')}</p>
          )}

          <button
            type="button"
            disabled={busy || !captchaReady || phone.replace(/\D/g, '').length < 9}
            onClick={() => void sendCode()}
            className="btn-primary w-full rounded-xl px-4 py-3 text-sm disabled:opacity-50 sm:w-auto sm:py-2"
          >
            {busy ? t('auth.loading') : t('phoneOtp.send')}
          </button>
        </>
      ) : (
        <>
          <p className="text-sm text-foreground">
            {t('phoneOtp.codeSentTo')} <span className="font-medium">{phone}</span>
          </p>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder={t('phoneOtp.codePlaceholder')}
            inputMode="numeric"
            autoComplete="one-time-code"
            enterKeyHint="done"
            className="w-full rounded-xl border border-input bg-background px-3 py-3 text-center text-lg tracking-[0.3em] sm:text-sm sm:tracking-normal"
          />
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              disabled={busy || code.trim().length < 6}
              onClick={() => void verifyCode()}
              className="btn-primary w-full rounded-xl px-4 py-3 text-sm disabled:opacity-50 sm:w-auto sm:py-2"
            >
              {busy ? t('auth.loading') : t('phoneOtp.verify')}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                clearPendingPhoneOtp()
                setCode('')
                setError('')
                setStep('phone')
              }}
              className="w-full rounded-xl border border-border px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary disabled:opacity-50 sm:w-auto sm:py-2"
            >
              {t('phoneOtp.resend')}
            </button>
          </div>
        </>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
