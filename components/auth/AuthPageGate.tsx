'use client'

import { Suspense, useEffect, useRef, useState, type ReactNode } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { safeAppPath } from '@/lib/safe-redirect'

export function AuthLoadingScreen() {
  const { t } = useLanguage()
  return (
    <div className="flex min-h-screen items-center justify-center text-muted-foreground">
      {t('auth.loading')}
    </div>
  )
}

export function AuthFormFallback() {
  const { t } = useLanguage()
  return <p className="py-6 text-center text-sm text-muted-foreground">{t('auth.loading')}</p>
}

function AuthPageGateContent({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectParam = searchParams.get('redirect')
  const redirected = useRef(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || loading || !user || redirected.current) return
    redirected.current = true
    // Do not consume Google stash here — GoogleAuthRedirectHandler owns that.
    const redirect = safeAppPath(redirectParam || '/profile')
    router.replace(redirect)
  }, [mounted, user, loading, router, redirectParam])

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
