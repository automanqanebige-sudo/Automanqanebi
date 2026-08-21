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
  const [loading, setLoading] = useState(false)
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
      setError(t('auth.recaptchaRequired'))
      return
    }

    if (resetMode) {
      setLoading(true)
      try {
        await resetPassword(email)
        setInfo(t('auth.resetSent'))
        setResetMode(false)
        resetCaptcha()
      } catch (err) {
        setError(getAuthErrorMessage(err, t))
        resetCaptcha()
      } finally {
        setLoading(false)
      }
      return
    }

    if (password.length < 6) {
      setError(t('auth.error.weakPassword'))
      return
    }

    setLoading(true)
    try {
      await signInWithEmail(email, password)
      logAnalyticsEvent('user_login', { method: 'email', email: email.trim().toLowerCase() })
      router.push(redirectTo.startsWith('/') ? redirectTo : '/profile')
    } catch (err) {
      if (err instanceof Error && err.message === 'FIREBASE_NOT_CONFIGURED') {
        setError(t('auth.error.notConfigured'))
      } else {
        setError(getAuthErrorMessage(err, t))
      }
      resetCaptcha()
    } finally {
      setLoading(false)
    }
  }

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
          loading={loading}
          onLoadingChange={setLoading}
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
            className={AUTH_INPUT_CLASS}
            placeholder="name@example.com"
            disabled={loading}
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
                className={`${AUTH_INPUT_CLASS} pr-10`}
                disabled={loading}
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

        <AuthRecaptcha key={captchaKey} onChange={setCaptchaOk} disabled={loading} />

        {!resetMode ? (
          <button
            type="button"
            onClick={() => {
              setResetMode(true)
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
          disabled={loading || !configured || !captchaOk}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
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
