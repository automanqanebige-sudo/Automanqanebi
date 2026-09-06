'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, Mail, Smartphone } from 'lucide-react'
import PhoneOtpVerify from '@/components/auth/PhoneOtpVerify'
import { AUTH_INPUT_CLASS } from '@/components/auth/AuthLayout'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { getAuthErrorMessage, sendVerificationEmail } from '@/lib/auth'
import { isContactVerified } from '@/lib/contact-verified'
import { getFirebaseAuth } from '@/lib/firebase'
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
  const [linkSent, setLinkSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [checking, setChecking] = useState(true)
  const [waitingVerify, setWaitingVerify] = useState(false)

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

  const checkEmailVerified = async (): Promise<boolean> => {
    if (!user) return false
    await refreshUser().catch(() => undefined)
    const fresh = getFirebaseAuth().currentUser
    if (fresh?.emailVerified) {
      await finishVerified()
      return true
    }
    return false
  }

  // After the user opens the Firebase link in Gmail, poll until emailVerified flips.
  useEffect(() => {
    if (!waitingVerify || channel !== 'email' || !user) return
    let cancelled = false
    const tick = async () => {
      if (cancelled) return
      try {
        const ok = await checkEmailVerified()
        if (ok) cancelled = true
      } catch {
        /* keep polling */
      }
    }
    void tick()
    const id = window.setInterval(() => void tick(), 3500)
    return () => {
      cancelled = true
      window.clearInterval(id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional poll while waiting
  }, [waitingVerify, channel, user?.uid])

  const sendEmailLink = async () => {
    if (!user) return
    if (!user.email?.trim()) {
      setError(t('auth.verify.emailMissing'))
      return
    }
    setError('')
    setBusy(true)
    try {
      await sendVerificationEmail(
        user,
        `/verify?redirect=${encodeURIComponent(redirectTo)}`
      )
      setLinkSent(true)
      setWaitingVerify(true)
    } catch (err) {
      setError(getAuthErrorMessage(err, t))
    } finally {
      setBusy(false)
    }
  }

  const confirmEmailClicked = async () => {
    if (!user) return
    setError('')
    setBusy(true)
    try {
      const ok = await checkEmailVerified()
      if (!ok) setError(t('auth.verify.emailNotYet'))
    } catch (err) {
      setError(getAuthErrorMessage(err, t))
    } finally {
      setBusy(false)
    }
  }

  if (checking) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return (
      <p className="text-center text-sm text-muted-foreground">{t('auth.verify.sendError')}</p>
    )
  }

  return (
    <div className="space-y-5">
      {error && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
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
                setLinkSent(false)
                setWaitingVerify(false)
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
              value={user.email || ''}
              readOnly
              className={`${AUTH_INPUT_CLASS} opacity-80`}
            />
          </div>

          {!linkSent ? (
            <button
              type="button"
              disabled={busy || !user.email}
              onClick={() => void sendEmailLink()}
              className="btn-primary w-full rounded-xl py-3 disabled:opacity-60"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              {t('auth.verify.sendLink')}
            </button>
          ) : (
            <div className="space-y-4">
              <p className="rounded-lg border border-primary/25 bg-primary/5 px-3 py-3 text-sm text-foreground">
                {t('auth.verify.linkSentHint').replace('{email}', user.email || '')}
              </p>
              {waitingVerify && (
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                  {t('auth.verify.waitingClick')}
                </p>
              )}
              <button
                type="button"
                disabled={busy}
                onClick={() => void confirmEmailClicked()}
                className="btn-primary w-full rounded-xl py-3 disabled:opacity-60"
              >
                {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                {t('auth.verify.confirmLink')}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void sendEmailLink()}
                className="w-full text-sm font-medium text-primary hover:underline disabled:opacity-60"
              >
                {t('phoneOtp.resend')}
              </button>
            </div>
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
