'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import VehicleToolsCalculators from '@/components/calculators/VehicleToolsCalculators'
import { useLanguage } from '@/context/LanguageContext'

export default function ToolsPage() {
  const { t } = useLanguage()

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('nav.home')}
      </Link>
      <h1 className="mb-2 text-3xl font-bold text-foreground">{t('tools.title')}</h1>
      <p className="mb-8 text-muted-foreground">{t('tools.subtitle')}</p>
      <VehicleToolsCalculators />
    </div>
  )
}
