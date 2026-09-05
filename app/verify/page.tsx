'use client'

import { Suspense } from 'react'
import AuthLayout from '@/components/auth/AuthLayout'
import RegisterVerifyForm from '@/components/auth/RegisterVerifyForm'
import RequireAuth from '@/components/RequireAuth'
import { AuthFormFallback } from '@/components/auth/AuthPageGate'
import { useLanguage } from '@/context/LanguageContext'

export default function VerifyPage() {
  const { t } = useLanguage()

  return (
    <RequireAuth>
      <AuthLayout title={t('auth.verify.title')} subtitle={t('auth.verify.pageSubtitle')}>
        <Suspense fallback={<AuthFormFallback />}>
          <RegisterVerifyForm />
        </Suspense>
      </AuthLayout>
    </RequireAuth>
  )
}
