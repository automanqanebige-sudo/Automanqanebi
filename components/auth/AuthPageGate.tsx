'use client'

import { Suspense, useEffect, useState, type ReactNode } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { takeGoogleRedirectPath } from '@/lib/auth'

export function AuthLoadingScreen() {
  const { t } = useLanguage()
  return (
    <div className="flex min-h-screen items-center justify-center text-gray-500">
      {t('auth.loading')}
    </div>
  )
}

export function AuthFormFallback() {
  const { t } = useLanguage()
  return <p className="py-6 text-center text-sm text-gray-500">{t('auth.loading')}</p>
}

function AuthPageGateContent({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || loading || !user) return
    const stashed = takeGoogleRedirectPath()
    const redirect = stashed || searchParams.get('redirect') || '/profile'
    router.replace(redirect.startsWith('/') ? redirect : '/profile')
  }, [mounted, user, loading, router, searchParams])

  if (!mounted || loading || user) {
    return <AuthLoadingScreen />
  }

  return <>{children}</>
}

export default function AuthPageGate({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<AuthLoadingScreen />}>
      <AuthPageGateContent>{children}</AuthPageGateContent>
    </Suspense>
  )
}
