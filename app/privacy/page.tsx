'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { SiteContactInline } from '@/components/SiteContactBlock'
import { useLanguage } from '@/context/LanguageContext'

export default function PrivacyPage() {
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
      <h1 className="text-3xl font-bold text-foreground">{t('legal.privacy.title')}</h1>
      <div className="mt-6 space-y-4 text-muted-foreground">
        <p>{t('legal.privacy.p1')}</p>
        <p>{t('legal.privacy.p2')}</p>
        <p>{t('legal.privacy.p4')}</p>
        <p>{t('legal.privacy.p5')}</p>
        <p>
          {t('legal.privacy.p3')} <SiteContactInline />
        </p>
        <p className="pt-2">
          <Link href="/cookies" className="text-primary hover:underline">
            {t('legal.cookies.title')}
          </Link>
        </p>
      </div>
    </div>
  )
}
