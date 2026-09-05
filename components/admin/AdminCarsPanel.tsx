'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Crown, ExternalLink, Pencil, Search, Trash2 } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useCurrency } from '@/context/CurrencyContext'

export type AdminCar = {
  id: string
  brand?: string
  model?: string
  price?: number
  year?: number
  userEmail?: string
  listingType?: string
  isVip?: boolean
  views?: number
}

type AdminCarsPanelProps = {
  cars: AdminCar[]
  onDelete: (id: string) => void
  onToggleVip: (car: AdminCar) => void
}

export default function AdminCarsPanel({ cars, onDelete, onToggleVip }: AdminCarsPanelProps) {
  const { t } = useLanguage()
  const { formatPrice } = useCurrency()
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return cars
    return cars.filter((c) =>
      [c.brand, c.model, c.userEmail, String(c.year)].some((v) =>
        String(v ?? '').toLowerCase().includes(q)
      )
    )
  }, [cars, query])

  if (cars.length === 0) {
    return <p className="text-muted-foreground">{t('admin.noCars')}</p>
  }

  return (
    <div className="space-y-4">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('admin.searchCars')}
          className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-3 text-sm"
        />
      </div>

      <ul className="space-y-3">
        {filtered.map((car) => {
          const isVip =
            car.isVip || ['vip', 'vip_plus', 'super_vip'].includes(car.listingType ?? '')
          return (
            <li
              key={car.id}
              className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 lg:flex-row lg:items-center lg:justify-between"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-foreground">
                    {car.year} {car.brand} {car.model}
                  </p>
                  {isVip && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">
                      <Crown className="h-3 w-3" />
                      VIP
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium text-primary">{formatPrice(car.price ?? 0)}</p>
                {car.userEmail && (
                  <p className="text-xs text-muted-foreground">{car.userEmail}</p>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onToggleVip(car)}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm ${
                    isVip
                      ? 'border-primary/40 bg-primary/10 text-primary'
                      : 'border-border hover:bg-secondary'
                  }`}
                >
                  <Crown className="h-4 w-4" />
                  {isVip ? t('admin.removeVip') : t('admin.makeVip')}
                </button>
                <Link
                  href={`/car/${car.id}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm hover:bg-secondary"
                >
                  <ExternalLink className="h-4 w-4" />
                  {t('profile.view')}
                </Link>
                <Link
                  href={`/edit-car/${car.id}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 px-3 py-2 text-sm text-primary hover:bg-primary/10"
                >
                  <Pencil className="h-4 w-4" />
                  {t('profile.edit')}
                </Link>
                <button
                  type="button"
                  onClick={() => onDelete(car.id)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/30 px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                  {t('profile.delete')}
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
