'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { getAuthErrorMessage } from '@/lib/auth-errors'

type AuthMode = 'login' | 'register'

type AuthFormProps = {
  mode: AuthMode
}

export default function AuthForm({ mode }: AuthFormProps) {
  const { t } = useLanguage()
  const { configured, signInWithEmail, registerWithEmail, signInWithGoogle, resetPassword } =
    useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/profile'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [resetMode, setResetMode] = useState(false)

  const isRegister = mode === 'register'

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

    if (resetMode) {
      setLoading(true)
      try {
        await resetPassword(email)
        setInfo(t('auth.resetSent'))
        setResetMode(false)
      } catch (err) {
        setError(getAuthErrorMessage(err, t))
      } finally {
        setLoading(false)
      }
      return
    }

    if (password.length < 6) {
      setError(t('auth.error.weakPassword'))
      return
    }

    if (isRegister && password !== confirmPassword) {
      setError(t('auth.error.passwordMismatch'))
      return
    }

    setLoading(true)
    try {
      if (isRegister) {
        await registerWithEmail(email, password, displayName)
      } else {
        await signInWithEmail(email, password)
      }
      router.push(redirectTo.startsWith('/') ? redirectTo : '/profile')
    } catch (err) {
      if (err instanceof Error && err.message === 'FIREBASE_NOT_CONFIGURED') {
        setError(t('auth.error.notConfigured'))
      } else {
        setError(getAuthErrorMessage(err, t))
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setError(null)
    setInfo(null)
    if (!configured) {
      setError(t('auth.error.notConfigured'))
      return
    }
    setLoading(true)
    try {
      await signInWithGoogle()
      router.push(redirectTo.startsWith('/') ? redirectTo : '/profile')
    } catch (err) {
      setError(getAuthErrorMessage(err, t))
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full rounded-lg border border-input bg-background px-3 py-2.5 text-foreground outline-none transition-shadow focus:ring-2 focus:ring-primary/30'

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold text-foreground">
          {resetMode
            ? t('auth.forgotTitle')
            : isRegister
              ? t('auth.register.title')
              : t('auth.login.title')}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {resetMode ? t('auth.forgotSubtitle') : t('auth.subtitle')}
        </p>

        {!configured && (
          <p className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-800 dark:text-amber-200">
            {t('auth.configHint')}
          </p>
        )}

        {error && (
          <p className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}
        {info && (
          <p className="mt-4 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-primary">
            {info}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
              className={inputClass}
              placeholder="name@example.com"
              disabled={loading}
            />
          </div>

          {!resetMode && isRegister && (
            <div>
              <label
                htmlFor="displayName"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                {t('auth.displayName')}
              </label>
              <input
                id="displayName"
                type="text"
                autoComplete="name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className={inputClass}
                placeholder={t('auth.displayNamePlaceholder')}
                disabled={loading}
              />
            </div>
          )}

          {!resetMode && (
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                {t('auth.password')}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputClass} pr-10`}
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

          {!resetMode && isRegister && (
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
                className={inputClass}
                disabled={loading}
              />
            </div>
          )}

          {!resetMode && !isRegister && (
            <button
              type="button"
              onClick={() => {
                setResetMode(true)
                setError(null)
              }}
              className="text-sm text-primary hover:underline"
            >
              {t('auth.forgotPassword')}
            </button>
          )}

          {resetMode && (
            <button
              type="button"
              onClick={() => {
                setResetMode(false)
                setError(null)
              }}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {t('auth.backToLogin')}
            </button>
          )}

          <button
            type="submit"
            disabled={loading || !configured}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {resetMode
              ? t('auth.submit.reset')
              : isRegister
                ? t('auth.submit.register')
                : t('auth.submit.login')}
          </button>
        </form>

        {!resetMode && (
          <>
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">{t('auth.or')}</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <button
              type="button"
              onClick={handleGoogle}
              disabled={loading || !configured}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background py-3 font-medium text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {t('auth.google')}
            </button>
          </>
        )}

        {!resetMode && (
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isRegister ? t('auth.hasAccount') : t('auth.noAccount')}{' '}
            <Link
              href={
                isRegister
                  ? `/login${redirectTo !== '/profile' ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`
                  : `/register${redirectTo !== '/profile' ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`
              }
              className="font-medium text-primary hover:underline"
            >
              {isRegister ? t('auth.submit.login') : t('auth.submit.register')}
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}
