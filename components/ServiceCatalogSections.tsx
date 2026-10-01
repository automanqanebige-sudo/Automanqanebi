'use client'

import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { ServiceSectionKey } from '@/data/auto-service-catalog'
import { SERVICE_SUB_SECTIONS } from '@/types/service'
import { catalogItemHref } from '@/lib/service-catalog-links'

type ServiceCatalogSectionsProps = {
  sections: typeof SERVICE_SUB_SECTIONS
  hasSearch: boolean
  t: (key: string) => string
  defaultExpanded?: ServiceSectionKey | null
}

export default function ServiceCatalogSections({
  sections,
  hasSearch,
  t,
  defaultExpanded = null,
}: ServiceCatalogSectionsProps) {
  const [expanded, setExpanded] = useState<ServiceSectionKey | 'all' | null>(
    hasSearch ? 'all' : defaultExpanded
  )

  useEffect(() => {
    setExpanded(hasSearch ? 'all' : defaultExpanded)
  }, [hasSearch, defaultExpanded, sections])

  if (sections.length === 0) return null

  return (
    <div className="space-y-3">
      {sections.map((section) => {
        const isOpen = hasSearch || expanded === 'all' || expanded === section.key
        const itemCount = section.items.length

        return (
          <div key={section.key} className="overflow-hidden rounded-2xl border border-border bg-card">
            <button
              type="button"
              onClick={() =>
                setExpanded((prev) =>
                  prev === section.key ? null : (section.key as ServiceSectionKey)
                )
              }
              className="flex w-full items-center justify-between gap-3 p-5 text-left transition-colors hover:bg-secondary/40"
            >
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    {t(`services.section.${section.key}`)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {itemCount} {t('services.catalogItems')}
                  </p>
                </div>
              </div>
              {!hasSearch && (
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              )}
            </button>

            {isOpen && (
              <div className="grid gap-3 border-t border-border p-4 sm:grid-cols-2 lg:grid-cols-3">
                {section.items.map((item) => {
                  const name = t(item.nameKey)
                  const href = catalogItemHref(
                    section.key,
                    item.itemId,
                    name,
                    section.defaultCategory
                  )

                  return (
                    <Link
                      key={item.nameKey}
                      href={href}
                      scroll
                      className="group flex items-center justify-between rounded-lg border border-border bg-background p-4 transition-all hover:border-primary/30"
                    >
                      <div className="min-w-0 pr-2">
                        <h4 className="font-medium text-foreground">{name}</h4>
                        <p className="line-clamp-2 text-sm text-muted-foreground">
                          {t(item.descKey)}
                        </p>
                      </div>
                      <ChevronDown className="-rotate-90 h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" />
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
