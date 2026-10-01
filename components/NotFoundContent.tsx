'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

export default function NotFoundContent() {
  const { t } = useLanguage()

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center section-padding text-center">
      <p className="text-6xl font-bold text-primary">404</p>
      <h1 className="mt-4 text-xl font-semibold text-foreground">{t('notFound.title')}</h1>
      <p className="mt-2 text-muted-foreground">{t('notFound.desc')}</p>
      <Link href="/" className="btn-primary mt-8 rounded-xl px-6 py-2.5">
        {t('notFound.home')}
      </Link>
    </div>
  )
}
