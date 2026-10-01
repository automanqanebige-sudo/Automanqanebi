'use client'

import { Suspense } from 'react'
import AuthLayout from '@/components/auth/AuthLayout'
import LoginForm from '@/components/auth/LoginForm'
import AuthPageGate, { AuthFormFallback } from '@/components/auth/AuthPageGate'
import { useLanguage } from '@/context/LanguageContext'

export default function LoginPage() {
  const { t } = useLanguage()

  return (
    <AuthPageGate>
      <AuthLayout title={t('auth.login.title')} subtitle={t('auth.login.subtitle')}>
        <Suspense fallback={<AuthFormFallback />}>
          <LoginForm />
        </Suspense>
      </AuthLayout>
    </AuthPageGate>
  )
}
