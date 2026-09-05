'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { t } = useLanguage()

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center section-padding text-center">
      <h1 className="text-2xl font-bold text-foreground">{t('error.title')}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{t('error.subtitle')}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="btn-primary rounded-xl px-5 py-2.5 text-sm"
        >
          {t('error.retry')}
        </button>
        <Link href="/" className="btn-secondary rounded-xl px-5 py-2.5 text-sm">
          {t('nav.home')}
        </Link>
      </div>
    </div>
  )
}
