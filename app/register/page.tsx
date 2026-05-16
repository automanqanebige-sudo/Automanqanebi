'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import AuthForm from '@/components/AuthForm'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'

function RegisterContent() {
  const { user, loading } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!loading && user) {
      const redirect = searchParams.get('redirect') || '/profile'
      router.replace(redirect.startsWith('/') ? redirect : '/profile')
    }
  }, [user, loading, router, searchParams])

  if (loading || user) {
    return (
      <div className="py-12 text-center text-muted-foreground">{t('auth.loading')}</div>
    )
  }

  return <AuthForm mode="register" />
}

export default function RegisterPage() {
  const { t } = useLanguage()

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <Suspense fallback={<div className="text-muted-foreground">{t('auth.loading')}</div>}>
        <RegisterContent />
      </Suspense>
    </div>
  )
}
