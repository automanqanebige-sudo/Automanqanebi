'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Loader2, Mail } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { getAuthErrorMessage, sendVerificationEmail } from '@/lib/auth'

/** Shown on profile when Firebase emailVerified is still false. */
export default function ProfileEmailVerifyBanner() {
  const { t } = useLanguage()
  const { user, refreshUser } = useAuth()
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  if (!user?.email || user.emailVerified) return null

  const resend = async () => {
    setError('')
    setBusy(true)
    try {
      await sendVerificationEmail(user, '/verify?redirect=/profile')
      setSent(true)
      await refreshUser().catch(() => undefined)
    } catch (err) {
      setSent(false)
      setError(getAuthErrorMessage(err, t))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mt-3 space-y-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-3 text-left text-sm text-amber-900 dark:text-amber-100">
      <p className="flex items-start gap-2 font-medium">
        <Mail className="mt-0.5 h-4 w-4 shrink-0" />
        <span>{t('auth.verifyEmailNeeded')}</span>
      </p>
      <p className="text-amber-800/90 dark:text-amber-200/90">{t('auth.verifyEmailSpamHint')}</p>
      {sent && !error && (
        <p className="font-medium text-emerald-700 dark:text-emerald-300">
          {t('auth.verifyEmailResent')}
        </p>
      )}
      {error && <p className="text-destructive">{error}</p>}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <button
          type="button"
          disabled={busy}
          onClick={() => void resend()}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-600 px-3 py-2 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-60"
        >
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          {t('auth.verifyEmailResend')}
        </button>
        <Link
          href="/verify?redirect=/profile"
          className="inline-flex items-center justify-center rounded-lg border border-amber-600/40 bg-white/60 px-3 py-2 text-sm font-semibold text-amber-950 hover:bg-white dark:bg-black/20 dark:text-amber-50"
        >
          {t('auth.verifyEmailOpenPage')}
        </Link>
      </div>
    </div>
  )
}
