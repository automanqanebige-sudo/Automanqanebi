'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, Mail, Smartphone } from 'lucide-react'
import PhoneOtpVerify from '@/components/auth/PhoneOtpVerify'
import { AUTH_INPUT_CLASS } from '@/components/auth/AuthLayout'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { isContactVerified } from '@/lib/contact-verified'
import { fetchUserProfile, saveUserProfile } from '@/lib/user-profile-firestore'
import { safeAppPath } from '@/lib/safe-redirect'

type Channel = 'email' | 'phone'

export default function RegisterVerifyForm() {
  const { t } = useLanguage()
  const { user, refreshUser } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = safeAppPath(searchParams.get('redirect') || '/profile')

  const [channel, setChannel] = useState<Channel>('email')
  const [code, setCode] = useState('')
  const [sentTo, setSentTo] = useState('')
  const [devCode, setDevCode] = useState('')
  const [codeSent, setCodeSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      if (!user) {
        setChecking(false)
        return
      }
      try {
        const profile = await fetchUserProfile(user.uid)
        if (cancelled) return
        if (isContactVerified(user, profile)) {
          router.replace(redirectTo)
          return
        }
      } catch {
        /* ignore */
      } finally {
        if (!cancelled) setChecking(false)
      }
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [user, redirectTo, router])

  const finishVerified = async (extra?: { phone?: string; phoneVerified?: boolean }) => {
    if (!user) return
    await saveUserProfile(user.uid, {
      emailOtpVerified: true,
      ...(extra?.phone ? { phone: extra.phone } : {}),
      ...(extra?.phoneVerified ? { phoneVerified: true } : {}),
    })
    await refreshUser().catch(() => undefined)
    router.replace(redirectTo)
  }

  const sendEmailCode = async () => {
    if (!user) return
    setError('')
    setBusy(true)
    setDevCode('')
    try {
      const idToken = await user.getIdToken()
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ channel: 'email' }),
      })
      const data = (await res.json().catch(() => null)) as {
        error?: string
        destination?: string
        stub?: boolean
        devCode?: string
      } | null

      if (!res.ok) {
        if (data?.error === 'email_missing') setError(t('auth.verify.emailMissing'))
        else setError(t('auth.verify.sendError'))
        return
      }

      setSentTo(data?.destination || '')
      setCodeSent(true)
      if (data?.devCode) setDevCode(data.devCode)
      if (data?.stub && !data?.devCode) {
        setError(t('auth.verify.stubHint'))
      }
    } catch {
      setError(t('auth.verify.sendError'))
    } finally {
      setBusy(false)
    }
  }

  const verifyEmailCode = async (e: FormEvent) => {
    e.preventDefault()
    if (!user) return
    setError('')
    setBusy(true)
    try {
      const idToken = await user.getIdToken()
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })
      const data = (await res.json().catch(() => null)) as { error?: string } | null
      if (!res.ok) {
        if (data?.error === 'code_expired') setError(t('phoneOtp.codeExpired'))
        else setError(t('phoneOtp.verifyError'))
        return
      }
      await finishVerified()
    } catch {
      setError(t('phoneOtp.verifyError'))
    } finally {
      setBusy(false)
    }
  }

  if (checking) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">{t('auth.loading')}</p>
    )
  }

  return (
    <div className="space-y-5">
      {error && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="grid grid-cols-2 gap-2" role="tablist" aria-label={t('auth.verify.channel')}>
        {(
          [
            { id: 'email' as const, label: t('auth.verify.viaEmail'), icon: Mail },
            { id: 'phone' as const, label: t('auth.verify.viaPhone'), icon: Smartphone },
          ] as const
        ).map((tab) => {
          const selected = channel === tab.id
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              disabled={busy}
              onClick={() => {
                setChannel(tab.id)
                setCodeSent(false)
                setCode('')
                setDevCode('')
                setError('')
              }}
              className={`inline-flex items-center justify-center gap-2 rounded-xl border-2 px-3 py-3 text-sm font-semibold transition-colors disabled:opacity-60 ${
                selected
                  ? 'border-primary bg-primary/10 text-foreground'
                  : 'border-border bg-card text-muted-foreground hover:border-primary/40'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {tab.label}
            </button>
          )
        })}
      </div>

      <p className="text-sm text-muted-foreground">{t('auth.verify.subtitle')}</p>

      {channel === 'email' ? (
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              {t('auth.email')}
            </label>
            <input
              type="email"
              value={user?.email || ''}
              readOnly
              className={`${AUTH_INPUT_CLASS} opacity-80`}
            />
          </div>

          {!codeSent ? (
            <button
              type="button"
              disabled={busy || !user?.email}
              onClick={() => void sendEmailCode()}
              className="btn-primary w-full rounded-xl py-3 disabled:opacity-60"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              {t('auth.verify.sendCode')}
            </button>
          ) : (
            <form onSubmit={verifyEmailCode} className="space-y-4">
              {sentTo && (
                <p className="text-sm text-muted-foreground">
                  {t('auth.verify.codeSentTo').replace('{dest}', sentTo)}
                </p>
              )}
              {devCode && (
                <p className="rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-sm text-foreground">
                  {t('auth.verify.devCode')}: <strong className="tracking-widest">{devCode}</strong>
                </p>
              )}
              <div>
                <label htmlFor="otp" className="mb-1.5 block text-sm font-medium text-foreground">
                  {t('auth.verify.codeLabel')}
                </label>
                <input
                  id="otp"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className={AUTH_INPUT_CLASS}
                  placeholder={t('phoneOtp.codePlaceholder')}
                  disabled={busy}
                />
              </div>
              <button
                type="submit"
                disabled={busy || code.length < 6}
                className="btn-primary w-full rounded-xl py-3 disabled:opacity-60"
              >
                {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                {t('auth.verify.confirm')}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void sendEmailCode()}
                className="w-full text-sm font-medium text-primary hover:underline disabled:opacity-60"
              >
                {t('phoneOtp.resend')}
              </button>
            </form>
          )}
        </div>
      ) : (
        <div>
          <p className="mb-3 text-sm text-muted-foreground">{t('auth.verify.phoneHint')}</p>
          <PhoneOtpVerify
            onVerified={(verifiedPhone) => {
              void finishVerified({ phone: verifiedPhone, phoneVerified: true })
            }}
          />
        </div>
      )}
    </div>
  )
}
