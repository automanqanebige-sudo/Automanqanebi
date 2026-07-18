'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import type { RecaptchaVerifier } from 'firebase/auth'
import { useLanguage } from '@/context/LanguageContext'
import { isFirebaseConfigured } from '@/lib/firebase'

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
  const containerId = `auth-recaptcha-${useId().replace(/:/g, '')}`
  const verifierRef = useRef<RecaptchaVerifier | null>(null)
  const onChangeRef = useRef(onChange)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  onChangeRef.current = onChange

  const clearVerifier = useCallback(() => {
    if (verifierRef.current) {
      try {
        verifierRef.current.clear()
      } catch {
        /* ignore */
      }
      verifierRef.current = null
    }
  }, [])

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

        const el = document.getElementById(containerId)
        if (el) el.innerHTML = ''

        const verifier = new RecaptchaVerifier(auth, containerId, {
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
          try {
            verifier.clear()
          } catch {
            /* ignore */
          }
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
      clearVerifier()
      onChangeRef.current(false)
    }
  }, [containerId, disabled, clearVerifier, t])

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-foreground">{t('auth.recaptcha')}</p>
      {loading && !error && (
        <p className="text-xs text-muted-foreground">{t('auth.loading')}</p>
      )}
      <div id={containerId} className="flex min-h-[78px] justify-center overflow-x-auto" />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
