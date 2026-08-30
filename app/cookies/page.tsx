'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

export default function CookiesPage() {
  const { t } = useLanguage()

  return (
    <div className="mx-auto max-w-3xl section-padding">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('nav.home')}
      </Link>
      <h1 className="text-3xl font-bold text-foreground">{t('legal.cookies.title')}</h1>
      <div className="mt-6 space-y-4 text-muted-foreground">
        <p>{t('legal.cookies.p1')}</p>
        <p>{t('legal.cookies.p2')}</p>
      </div>
    </div>
  )
}
