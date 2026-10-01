'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useServiceCatalogT } from '@/hooks/useServiceCatalogT'
import { DISC_SERVICE_ITEM_IDS } from '@/types/service'
import { catalogItemHref } from '@/lib/service-catalog-links'

type DiscsQuickLinksProps = {
  className?: string
}

export default function DiscsQuickLinks({ className = '' }: DiscsQuickLinksProps) {
  const { t: baseT } = useLanguage()
  const { t, ready } = useServiceCatalogT()

  return (
    <section className={`${className}`}>
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-bold text-foreground sm:text-xl">
            {baseT('services.section.discs')}
          </h2>
          <Link
            href="/services?category=discs"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            {baseT('services.viewAllDiscs')}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {DISC_SERVICE_ITEM_IDS.map((itemId) => {
            const nameKey = `services.sub.${itemId}`
            const label = ready ? t(nameKey) : baseT(nameKey)
            const href = catalogItemHref('discs', itemId, label, 'discs')

            return (
              <Link
                key={itemId}
                href={href}
                className="inline-flex shrink-0 items-center rounded-xl border border-border bg-background px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-secondary/40"
              >
                {label}
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
