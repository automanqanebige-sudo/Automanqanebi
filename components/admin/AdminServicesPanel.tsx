'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ExternalLink, Pencil, Search, Trash2 } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import type { Service } from '@/types/service'

type AdminServicesPanelProps = {
  services: Service[]
  onDelete: (id: string) => void
  categoryLabel: (cat: string) => string
}

export default function AdminServicesPanel({
  services,
  onDelete,
  categoryLabel,
}: AdminServicesPanelProps) {
  const { t } = useLanguage()
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return services
    return services.filter((s) =>
      [s.name, s.location, s.phone, categoryLabel(s.category)].some((v) =>
        String(v ?? '').toLowerCase().includes(q)
      )
    )
  }, [services, query, categoryLabel])

  if (services.length === 0) {
    return <p className="text-muted-foreground">{t('admin.noServices')}</p>
  }

  return (
    <div className="space-y-4">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('admin.searchServices')}
          className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-3 text-sm"
        />
      </div>

      <ul className="space-y-3">
        {filtered.map((service) => (
          <li
            key={service.id}
            className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-semibold text-foreground">{service.name}</p>
              <p className="text-sm text-muted-foreground">
                {categoryLabel(service.category)} · {service.location}
              </p>
              <p className="text-xs text-muted-foreground">{service.phone}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/services/${service.id}`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm hover:bg-secondary"
              >
                <ExternalLink className="h-4 w-4" />
                {t('profile.view')}
              </Link>
              <Link
                href={`/services/edit/${service.id}`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 px-3 py-2 text-sm text-primary hover:bg-primary/10"
              >
                <Pencil className="h-4 w-4" />
                {t('profile.edit')}
              </Link>
              <button
                type="button"
                onClick={() => onDelete(service.id)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/30 px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
                {t('profile.delete')}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
