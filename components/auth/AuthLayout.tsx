'use client'

import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'

export const AUTH_INPUT_CLASS = 'input-premium'

interface Props {
  title: string
  subtitle: string
  children: React.ReactNode
}

export default function AuthLayout({ title, subtitle, children }: Props) {
  const { t } = useLanguage()

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background section-padding">
      <div className="w-full max-w-lg animate-scale-in rounded-2xl border border-border bg-card p-8 shadow-card sm:p-10">
        <Link
          href="/"
          className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          ← {t('nav.home')}
        </Link>

        <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>

        <p className="mt-2 mb-8 text-muted-foreground">{subtitle}</p>

        {children}
      </div>
    </div>
  )
}
