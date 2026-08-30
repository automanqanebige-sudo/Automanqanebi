'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import SiteContactBlock from '@/components/SiteContactBlock'
import { useLanguage } from '@/context/LanguageContext'

export default function AboutPage() {
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
      <h1 className="text-3xl font-bold text-foreground">{t('legal.about.title')}</h1>
      <div className="prose prose-neutral mt-6 max-w-none text-muted-foreground dark:prose-invert">
        <p>{t('legal.about.p1')}</p>
        <p>{t('legal.about.p2')}</p>
      </div>
      <SiteContactBlock className="mt-8" />
    </div>
  )
}
