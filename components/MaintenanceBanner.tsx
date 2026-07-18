'use client'

import { AlertTriangle } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useSiteSettings } from '@/context/SiteSettingsContext'

export default function MaintenanceBanner() {
  const { language } = useLanguage()
  const { settings, loading } = useSiteSettings()

  if (loading || !settings.maintenanceMode) return null

  const message =
    language === 'ru'
      ? settings.maintenanceMessageRu
      : language === 'en'
        ? settings.maintenanceMessageEn
        : settings.maintenanceMessageKa

  return (
    <div className="border-b border-amber-500/30 bg-amber-500/10 px-4 py-2.5">
      <p className="mx-auto flex max-w-7xl items-center justify-center gap-2 text-center text-sm font-medium text-amber-800 dark:text-amber-200">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        {message}
      </p>
    </div>
  )
}
