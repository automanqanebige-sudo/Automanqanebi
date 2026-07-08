'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import SocialLogin from '@/components/auth/SocialLogin'
import { AUTH_INPUT_CLASS } from '@/components/auth/AuthLayout'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { getAuthErrorMessage } from '@/lib/auth'

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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

    setLoading(true)
    try {
      await registerWithEmail(email, password, displayName)
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
            disabled={loading}
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
            className={AUTH_INPUT_CLASS}
            placeholder="name@example.com"
            disabled={loading}
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
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !configured}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {t('auth.submit.register')}
        </button>
      </form>

      <SocialLogin loading={loading} onLoadingChange={setLoading} onError={setError} />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {t('auth.hasAccount')}{' '}
        <Link href={loginHref} className="font-medium text-primary hover:underline">
          {t('auth.submit.login')}
        </Link>
      </p>
    </>
  )
}
