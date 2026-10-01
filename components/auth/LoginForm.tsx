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
import { safeAppPath } from '@/lib/safe-redirect'
import { getAuthErrorMessage } from '@/lib/auth'
import { logAnalyticsEvent } from '@/lib/analytics-firestore'

export default function LoginForm() {
  const { t } = useLanguage()
  const { configured, signInWithEmail, resetPassword } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/profile'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [showCaptcha, setShowCaptcha] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [resetMode, setResetMode] = useState(false)
  const [captchaOk, setCaptchaOk] = useState(false)
  const [captchaKey, setCaptchaKey] = useState(0)

  const resetCaptcha = () => {
    setCaptchaOk(false)
    setCaptchaKey((k) => k + 1)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setInfo(null)

    if (!configured) {
      setError(t('auth.error.notConfigured'))
      return
    }

    if (!email.trim()) {
      setError(t('auth.error.emailRequired'))
      return
    }

    if (!captchaOk) {
      setShowCaptcha(true)
      setError(t('auth.recaptchaRequired'))
      return
    }

    if (resetMode) {
      setFormLoading(true)
      try {
        await resetPassword(email)
        setInfo(t('auth.resetSent'))
        setResetMode(false)
        resetCaptcha()
      } catch (err) {
        setError(getAuthErrorMessage(err, t))
        resetCaptcha()
      } finally {
        setFormLoading(false)
      }
      return
    }

    if (password.length < 6) {
      setError(t('auth.error.weakPassword'))
      return
    }

    setFormLoading(true)
    try {
      await signInWithEmail(email, password)
      logAnalyticsEvent('user_login', { method: 'email', email: email.trim().toLowerCase() })
      router.push(safeAppPath(redirectTo))
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

  const registerHref =
    redirectTo !== '/profile'
      ? `/register?redirect=${encodeURIComponent(redirectTo)}`
      : '/register'

  return (
    <>
      {resetMode && (
        <p className="mb-4 text-sm font-medium text-foreground">{t('auth.forgotTitle')}</p>
      )}

      {error && (
        <p className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {info && (
        <p className="mb-4 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-primary">
          {info}
        </p>
      )}

      {!resetMode && (
        <SocialLogin
          mode="login"
          position="top"
          loading={googleLoading}
          onLoadingChange={setGoogleLoading}
          onError={setError}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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

        {!resetMode && (
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">
              {t('auth.password')}
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
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
        )}

        {showCaptcha && (
          <AuthRecaptcha key={captchaKey} onChange={setCaptchaOk} disabled={formLoading} />
        )}

        {!resetMode ? (
          <button
            type="button"
            onClick={() => {
              setResetMode(true)
              setShowCaptcha(true)
              setError(null)
              resetCaptcha()
            }}
            className="text-sm text-primary hover:underline"
          >
            {t('auth.forgotPassword')}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setResetMode(false)
              setError(null)
              resetCaptcha()
            }}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {t('auth.backToLogin')}
          </button>
        )}

        <button
          type="submit"
          disabled={formLoading || !configured || (showCaptcha && !captchaOk)}
          className="btn-primary w-full rounded-xl py-3 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {formLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {resetMode ? t('auth.submit.reset') : t('auth.submit.login')}
        </button>
      </form>

      {!resetMode && (
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {t('auth.noAccount')}{' '}
          <Link href={registerHref} className="font-medium text-primary hover:underline">
            {t('auth.submit.register')}
          </Link>
        </p>
      )}
    </>
  )
}
