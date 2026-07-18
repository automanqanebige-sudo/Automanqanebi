'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useServiceCatalogT } from '@/hooks/useServiceCatalogT'
import { MOBILE_SERVICE_ITEM_IDS } from '@/types/service'
import { catalogItemHref } from '@/lib/service-catalog-links'

const MOBILE_ITEM_EMOJI: Record<(typeof MOBILE_SERVICE_ITEM_IDS)[number], string> = {
  mobileVulcanization: '🛞',
  mobileDoorOpen: '🔓',
  mobileJumpStart: '🔋',
  mobileMechanic: '🔧',
  mobileWash: '🚿',
  mobileTires: '⭕',
  mobileFuel: '⛽',
}

type MobileServicesQuickLinksProps = {
  className?: string
}

export default function MobileServicesQuickLinks({ className = '' }: MobileServicesQuickLinksProps) {
  const { t: baseT } = useLanguage()
  const { t, ready } = useServiceCatalogT()

  return (
    <section className={`px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="mx-auto max-w-7xl rounded-2xl border border-sky-500/20 bg-gradient-to-br from-sky-500/5 via-card to-card p-4 shadow-sm sm:p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xl" aria-hidden>
              🚐
            </span>
            <h2 className="text-lg font-bold text-foreground sm:text-xl">
              {baseT('services.section.mobile')}
            </h2>
          </div>
          <Link
            href="/services?category=mobile"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            {baseT('services.viewAllMobile')}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {MOBILE_SERVICE_ITEM_IDS.map((itemId) => {
            const nameKey = `services.sub.${itemId}`
            const label = ready ? t(nameKey) : baseT(nameKey)
            const href = catalogItemHref('mobile', itemId, label, 'mobile')

            return (
              <Link
                key={itemId}
                href={href}
                className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-sky-500/40 hover:bg-sky-500/5"
              >
                <span aria-hidden>{MOBILE_ITEM_EMOJI[itemId]}</span>
                {label}
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
