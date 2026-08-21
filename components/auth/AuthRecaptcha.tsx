'use client'

import { useEffect, useRef, useState } from 'react'
import type { RecaptchaVerifier } from 'firebase/auth'
import { useLanguage } from '@/context/LanguageContext'
import { isFirebaseConfigured } from '@/lib/firebase'
import { clearRecaptchaVerifier } from '@/lib/firebase-recaptcha'

type AuthRecaptchaProps = {
  /** Called when user solves or expires the challenge */
  onChange: (verified: boolean) => void
  disabled?: boolean
}

/**
 * Visible Firebase reCAPTCHA (checkbox) for login / register bot protection.
 */
export default function AuthRecaptcha({ onChange, disabled }: AuthRecaptchaProps) {
  const { t } = useLanguage()
  const containerRef = useRef<HTMLDivElement>(null)
  const verifierRef = useRef<RecaptchaVerifier | null>(null)
  const onChangeRef = useRef(onChange)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  onChangeRef.current = onChange

  useEffect(() => {
    if (!isFirebaseConfigured() || disabled) {
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError('')
    onChangeRef.current(false)

    const init = async () => {
      try {
        const { getFirebaseAuth } = await import('@/lib/firebase')
        const { RecaptchaVerifier } = await import('firebase/auth')
        const auth = getFirebaseAuth()
        const el = containerRef.current
        if (!el) throw new Error('recaptcha-container-missing')
        el.innerHTML = ''

        const verifier = new RecaptchaVerifier(auth, el, {
          size: 'normal',
          callback: () => {
            if (!cancelled) onChangeRef.current(true)
          },
          'expired-callback': () => {
            if (!cancelled) onChangeRef.current(false)
          },
          'error-callback': () => {
            if (!cancelled) {
              onChangeRef.current(false)
              setError(t('auth.recaptchaError'))
            }
          },
        })

        if (cancelled) {
          clearRecaptchaVerifier(verifier)
          return
        }

        verifierRef.current = verifier
        await verifier.render()
        if (!cancelled) setLoading(false)
      } catch (err) {
        console.error('[AuthRecaptcha]', err)
        if (!cancelled) {
          setError(t('auth.recaptchaError'))
          setLoading(false)
        }
      }
    }

    void init()

    return () => {
      cancelled = true
      clearRecaptchaVerifier(verifierRef.current)
      verifierRef.current = null
      onChangeRef.current(false)
    }
  }, [disabled, t])

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-foreground">{t('auth.recaptcha')}</p>
      {loading && !error && (
        <p className="text-xs text-muted-foreground">{t('auth.loading')}</p>
      )}
      <div ref={containerRef} className="flex min-h-[78px] justify-center overflow-x-auto" />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
