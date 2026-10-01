'use client'

import { Suspense } from 'react'
import AuthLayout from '@/components/auth/AuthLayout'
import RegisterForm from '@/components/auth/RegisterForm'
import AuthPageGate, { AuthFormFallback } from '@/components/auth/AuthPageGate'
import { useLanguage } from '@/context/LanguageContext'

export default function RegisterPage() {
  const { t } = useLanguage()

  return (
    <AuthPageGate>
      <AuthLayout title={t('auth.register.title')} subtitle={t('auth.register.subtitle')}>
        <Suspense fallback={<AuthFormFallback />}>
          <RegisterForm />
        </Suspense>
      </AuthLayout>
    </AuthPageGate>
  )
}
