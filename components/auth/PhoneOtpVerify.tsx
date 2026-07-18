'use client'

import { useEffect, useId, useRef, useState } from 'react'
import type { ConfirmationResult, RecaptchaVerifier } from 'firebase/auth'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { saveUserProfile } from '@/lib/user-profile-firestore'
import { isFirebaseConfigured } from '@/lib/firebase'
import { formatPhoneDisplay, toE164Phone } from '@/lib/phone'

/**
 * Firebase Phone Auth OTP — requires Phone provider + reCAPTCHA in Firebase Console.
 * Uses invisible reCAPTCHA; optimized for mobile Georgian numbers (+995).
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
  const recaptchaContainerId = useId().replace(/:/g, '')
  const [phone, setPhone] = useState(defaultPhone ?? '')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'phone' | 'code' | 'done'>('phone')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const confirmationRef = useRef<ConfirmationResult | null>(null)
  const verifierRef = useRef<RecaptchaVerifier | null>(null)

  useEffect(() => {
    if (defaultPhone) setPhone(defaultPhone)
  }, [defaultPhone])

  useEffect(() => {
    return () => {
      confirmationRef.current = null
      if (verifierRef.current) {
        try {
          verifierRef.current.clear()
        } catch {
          /* ignore */
        }
        verifierRef.current = null
      }
    }
  }, [])

  const clearVerifier = () => {
    if (verifierRef.current) {
      try {
        verifierRef.current.clear()
      } catch {
        /* ignore */
      }
      verifierRef.current = null
    }
  }

  const getRecaptchaVerifier = async () => {
    const { getFirebaseAuth } = await import('@/lib/firebase')
    const { RecaptchaVerifier } = await import('firebase/auth')
    const auth = getFirebaseAuth()
    clearVerifier()

    const el = document.getElementById(recaptchaContainerId)
    if (el) el.innerHTML = ''

    const verifier = new RecaptchaVerifier(auth, recaptchaContainerId, {
      size: 'invisible',
    })
    verifierRef.current = verifier
    await verifier.render()
    return { auth, verifier }
  }

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
      const { auth, verifier } = await getRecaptchaVerifier()

      const hasNonPhoneProvider =
        Boolean(user.email) || user.providerData.some((p) => p.providerId !== 'phone')

      const confirmation = hasNonPhoneProvider
        ? await linkWithPhoneNumber(user, e164, verifier)
        : await signInWithPhoneNumber(auth, e164, verifier)

      confirmationRef.current = confirmation
      setPhone(formatPhoneDisplay(e164))
      setStep('code')
    } catch (err) {
      console.error('[PhoneOtp]', err)
      clearVerifier()
      const code = (err as { code?: string } | null)?.code
      if (code === 'auth/too-many-requests') {
        setError(t('phoneOtp.tooMany'))
      } else if (code === 'auth/invalid-phone-number') {
        setError(t('phoneOtp.invalidPhone'))
      } else if (code === 'auth/captcha-check-failed') {
        setError(t('phoneOtp.recaptchaFailed'))
      } else {
        setError(t('phoneOtp.sendError'))
      }
    } finally {
      setBusy(false)
    }
  }

  const verifyCode = async () => {
    if (!user || !confirmationRef.current) return
    setBusy(true)
    setError('')
    try {
      await confirmationRef.current.confirm(code.trim())
      const e164 = toE164Phone(phone)
      const normalized = e164 ?? phone.trim()
      await saveUserProfile(user.uid, { phone: normalized, phoneVerified: true })
      setStep('done')
      onVerified?.(normalized)
    } catch {
      setError(t('phoneOtp.verifyError'))
    } finally {
      setBusy(false)
    }
  }

  if (step === 'done') {
    return <p className="mt-2 text-sm font-medium text-primary">{t('phoneOtp.success')}</p>
  }

  return (
    <div className={`space-y-3 ${compact ? 'mt-2' : 'mt-3'}`}>
      {!compact && <p className="text-sm text-muted-foreground">{t('phoneOtp.subtitle')}</p>}
      <p className="text-xs text-muted-foreground">{t('phoneOtp.recaptchaHint')}</p>
      <div id={recaptchaContainerId} />
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
          <button
            type="button"
            disabled={busy || phone.replace(/\D/g, '').length < 9}
            onClick={sendCode}
            className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 sm:w-auto sm:py-2 sm:font-medium"
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
              disabled={busy || code.trim().length < 4}
              onClick={verifyCode}
              className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 sm:w-auto sm:py-2 sm:font-medium"
            >
              {busy ? t('auth.loading') : t('phoneOtp.verify')}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setStep('phone')
                setCode('')
                confirmationRef.current = null
                clearVerifier()
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
