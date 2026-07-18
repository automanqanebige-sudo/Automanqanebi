'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import ServiceCard from '@/components/ServiceCard'
import { catalogItemEmoji } from '@/lib/filter-emojis'
import { catalogItemHref } from '@/lib/service-catalog-links'
import type { ServiceSubItemMatch } from '@/lib/service-search'
import type { Service, ServiceCategory } from '@/types/service'
import { SERVICE_CATEGORY_ICONS } from '@/types/service'

type ServiceSearchResultsProps = {
  query: string
  catalogMatches: ServiceSubItemMatch[]
  userServices: Service[]
  catalogReady: boolean
  loading: boolean
  t: (key: string) => string
  baseT: (key: string) => string
  categoryLabel: (cat: ServiceCategory) => string
}

export default function ServiceSearchResults({
  query,
  catalogMatches,
  userServices,
  catalogReady,
  loading,
  t,
  baseT,
  categoryLabel,
}: ServiceSearchResultsProps) {
  const trimmed = query.trim()
  if (!trimmed) return null

  const total = catalogMatches.length + userServices.length

  return (
    <div className="border-b border-border bg-background px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="mb-4 text-sm text-muted-foreground">
          {baseT('services.searchResults').replace('{{count}}', String(total))}
        </p>

        {loading && (
          <p className="mb-3 text-sm text-muted-foreground">{baseT('car.loading')}</p>
        )}

        {!loading && total === 0 && (
          <p className="rounded-xl border border-dashed border-border bg-background px-4 py-8 text-center text-muted-foreground">
            {baseT('services.noSearchResults')}
          </p>
        )}

        {catalogReady && catalogMatches.length > 0 && (
          <section className="mb-6">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <span aria-hidden>📋</span>
              {baseT('services.specificServices')}
              <span className="font-normal text-muted-foreground">({catalogMatches.length})</span>
            </h3>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {catalogMatches.map((item) => {
                const emoji = catalogItemEmoji(item.itemId, item.icon)
                const name = t(item.nameKey)
                const href = catalogItemHref(
                  item.sectionKey,
                  item.itemId,
                  name,
                  item.defaultCategory
                )

                return (
                  <Link
                    key={`${item.sectionKey}-${item.itemId}`}
                    href={href}
                    className="group flex items-center gap-3 rounded-xl border border-border bg-background p-3 transition-all hover:border-primary/40 hover:bg-secondary/30"
                  >
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg ${item.colorClass}`}
                    >
                      <span aria-hidden>{emoji}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-foreground group-hover:text-primary">
                        {name}
                      </p>
                      <p className="line-clamp-1 text-xs text-muted-foreground">{t(item.descKey)}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" />
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {userServices.length > 0 && (
          <section>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <span aria-hidden>👤</span>
              {baseT('services.userListings')}
              <span className="font-normal text-muted-foreground">({userServices.length})</span>
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {userServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  categoryLabel={(cat) => {
                    const icon = SERVICE_CATEGORY_ICONS[cat]
                    return `${icon} ${categoryLabel(cat)}`
                  }}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
