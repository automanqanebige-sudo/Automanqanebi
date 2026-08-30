'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import SocialLogin from '@/components/auth/SocialLogin'
import AuthRecaptcha from '@/components/auth/AuthRecaptcha'
import { AUTH_INPUT_CLASS } from '@/components/auth/AuthLayout'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { safeAppPath, appendQueryParam } from '@/lib/safe-redirect'
import { getAuthErrorMessage } from '@/lib/auth'
import { logAnalyticsEvent } from '@/lib/analytics-firestore'

export default function RegisterForm() {
  const { t } = useLanguage()
  const { configured, registerWithEmail } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/profile'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [showCaptcha, setShowCaptcha] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [captchaOk, setCaptchaOk] = useState(false)
  const [captchaKey, setCaptchaKey] = useState(0)

  const resetCaptcha = () => {
    setCaptchaOk(false)
    setCaptchaKey((k) => k + 1)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!configured) {
      setError(t('auth.error.notConfigured'))
      return
    }

    if (!email.trim()) {
      setError(t('auth.error.emailRequired'))
      return
    }

    if (password.length < 6) {
      setError(t('auth.error.weakPassword'))
      return
    }

    if (password !== confirmPassword) {
      setError(t('auth.error.passwordMismatch'))
      return
    }

    if (!captchaOk) {
      setShowCaptcha(true)
      setError(t('auth.recaptchaRequired'))
      return
    }

    setFormLoading(true)
    try {
      await registerWithEmail(email, password, displayName)
      logAnalyticsEvent('user_register', { email: email.trim().toLowerCase() })
      router.push(appendQueryParam(safeAppPath(redirectTo), 'verifyEmail', '1'))
    } catch (err) {
      if (err instanceof Error && err.message === 'FIREBASE_NOT_CONFIGURED') {
        setError(t('auth.error.notConfigured'))
      } else {
        setError(getAuthErrorMessage(err, t))
      }
      resetCaptcha()
    } finally {
      setFormLoading(false)
    }
  }

  const busy = formLoading || googleLoading

  const loginHref =
    redirectTo !== '/profile'
      ? `/login?redirect=${encodeURIComponent(redirectTo)}`
      : '/login'

  return (
    <>
      {error && (
        <p className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <SocialLogin
        mode="register"
        position="top"
        loading={googleLoading}
        onLoadingChange={setGoogleLoading}
        onError={setError}
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="displayName" className="mb-1.5 block text-sm font-medium text-foreground">
            {t('auth.displayName')}
          </label>
          <input
            id="displayName"
            type="text"
            autoComplete="name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className={AUTH_INPUT_CLASS}
            placeholder={t('auth.displayNamePlaceholder')}
            disabled={busy}
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
            {t('auth.email')}
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setShowCaptcha(true)}
            className={AUTH_INPUT_CLASS}
            placeholder="name@example.com"
            disabled={busy}
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">
            {t('auth.password')}
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setShowCaptcha(true)}
              className={`${AUTH_INPUT_CLASS} pr-10`}
              disabled={busy}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            {t('auth.confirmPassword')}
          </label>
          <input
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={AUTH_INPUT_CLASS}
            disabled={busy}
          />
        </div>

        {showCaptcha && (
          <AuthRecaptcha key={captchaKey} onChange={setCaptchaOk} disabled={formLoading} />
        )}

        <button
          type="submit"
          disabled={formLoading || !configured || (showCaptcha && !captchaOk)}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {formLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {t('auth.submit.register')}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {t('auth.hasAccount')}{' '}
        <Link href={loginHref} className="font-medium text-primary hover:underline">
          {t('auth.submit.login')}
        </Link>
      </p>
    </>
  )
}
