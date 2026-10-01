'use client'

import { Mail, Phone } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useSiteSettings } from '@/context/SiteSettingsContext'
import { SITE_CONTACT_PHONE_TEL } from '@/lib/site'

export default function SiteContactBlock({ className = '' }: { className?: string }) {
  const { t } = useLanguage()
  const { settings } = useSiteSettings()

  return (
    <div className={`rounded-xl border border-border bg-card p-4 ${className}`}>
      <p className="mb-3 text-sm font-medium text-foreground">{t('footer.contact')}</p>
      <ul className="space-y-2">
        <li>
          <a
            href={`mailto:${settings.contactEmail}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <Mail className="h-4 w-4 shrink-0" />
            {settings.contactEmail}
          </a>
        </li>
        <li>
          <a
            href={`tel:${SITE_CONTACT_PHONE_TEL}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <Phone className="h-4 w-4 shrink-0" />
            {settings.contactPhone}
          </a>
        </li>
      </ul>
    </div>
  )
}

export function SiteContactInline() {
  const { settings } = useSiteSettings()
  return (
    <span>
      {settings.contactEmail} · {settings.contactPhone}
    </span>
  )
}
