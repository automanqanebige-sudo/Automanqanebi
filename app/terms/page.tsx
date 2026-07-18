'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import SiteContactBlock from '@/components/SiteContactBlock'
import { useLanguage } from '@/context/LanguageContext'

export default function TermsPage() {
  const { t } = useLanguage()

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('nav.home')}
      </Link>
      <h1 className="text-3xl font-bold text-foreground">{t('legal.terms.title')}</h1>
      <div className="mt-6 space-y-4 text-muted-foreground">
        <p>{t('legal.terms.p1')}</p>
        <p>{t('legal.terms.p2')}</p>
        <p>{t('legal.terms.p3')}</p>
        <p>{t('legal.terms.p4')}</p>
      </div>
      <SiteContactBlock className="mt-8" />
    </div>
  )
}
