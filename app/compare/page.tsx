'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Columns2, Loader2, Trash2, X } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useCurrency } from '@/context/CurrencyContext'
import { useCompare, COMPARE_MAX } from '@/context/CompareContext'
import { fetchFirestoreCarById } from '@/lib/cars-firestore'
import { getCarById } from '@/data/cars'
import type { Car } from '@/components/CarCard'

type RowDef = {
  key: string
  label: string
  value: (car: Car) => string
}

function CompareInner() {
  const { t } = useLanguage()
  const { formatPrice } = useCurrency()
  const { ids, removeCompare, clearCompare, ready, setCompareIds } = useCompare()
  const searchParams = useSearchParams()
  const router = useRouter()

  const paramIds = useMemo(() => {
    const raw = searchParams.get('ids') || ''
    return raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, COMPARE_MAX)
  }, [searchParams])

  // Hydrate context from shared ?ids= links
  useEffect(() => {
    if (!ready || paramIds.length === 0) return
    const same =
      paramIds.length === ids.length && paramIds.every((id, i) => id === ids[i])
    if (!same) setCompareIds(paramIds)
  }, [ready, paramIds, ids, setCompareIds])

  const effectiveIds = paramIds.length > 0 ? paramIds : ids

  const idsKey = effectiveIds.join(',')

  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      try {
        const idList = idsKey ? idsKey.split(',').filter(Boolean) : []
        const list: Car[] = []
        for (const id of idList) {
          const sample = getCarById(id)
          if (sample) {
            list.push(sample)
            continue
          }
          const fromDb = await fetchFirestoreCarById(id)
          if (fromDb) list.push(fromDb)
        }
        if (active) setCars(list)
      } finally {
        if (active) setLoading(false)
      }
    }
    if (ready || paramIds.length > 0) void load()
    return () => {
      active = false
    }
  }, [idsKey, ready, paramIds.length])

  const label = (candidates: string[], fallback?: string | number) => {
    if (fallback == null || fallback === '') return '—'
    for (const key of candidates) {
      const translated = t(key)
      if (translated !== key) return translated
    }
    return String(fallback)
  }

  const rows: RowDef[] = [
    {
      key: 'price',
      label: t('compare.row.price'),
      value: (c) =>
        `${formatPrice(c.price)}${c.offerType === 'rent' ? ` / ${t('filter.offer.perMonth')}` : ''}`,
    },
    {
      key: 'year',
      label: t('compare.row.year'),
      value: (c) => String(c.year),
    },
    {
      key: 'mileage',
      label: t('compare.row.mileage'),
      value: (c) => `${new Intl.NumberFormat('en-US').format(c.mileage)} km`,
    },
    {
      key: 'fuel',
      label: t('compare.row.fuel'),
      value: (c) => label([`fuel.${c.fuelType}`], c.fuelType),
    },
    {
      key: 'transmission',
      label: t('compare.row.transmission'),
      value: (c) => label([`filter.transmission.${c.transmission}`, `transmission.${c.transmission}`], c.transmission),
    },
    {
      key: 'body',
      label: t('compare.row.body'),
      value: (c) => label([`filter.body.${c.bodyType}`], c.bodyType),
    },
    {
      key: 'drive',
      label: t('compare.row.drive'),
      value: (c) => label([`filter.drive.${c.driveType}`], c.driveType),
    },
    {
      key: 'engine',
      label: t('compare.row.engine'),
      value: (c) => (c.engineVolume ? `${c.engineVolume} L` : '—'),
    },
    {
      key: 'color',
      label: t('compare.row.color'),
      value: (c) => label([`filter.color.${c.color}`], c.color),
    },
    {
      key: 'location',
      label: t('compare.row.location'),
      value: (c) => c.location || '—',
    },
    {
      key: 'offer',
      label: t('compare.row.offer'),
      value: (c) =>
        label([`filter.offer.${c.offerType || 'sale'}`], c.offerType || 'sale'),
    },
    {
      key: 'views',
      label: t('compare.row.views'),
      value: (c) => String(c.views ?? 0),
    },
  ]

  const remove = (id: string) => {
    removeCompare(id)
    const next = effectiveIds.filter((x) => x !== id)
    if (next.length === 0) {
      router.replace('/compare')
    } else {
      router.replace(`/compare?ids=${next.join(',')}`)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-20 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        {t('auth.loading')}
      </div>
    )
  }

  if (cars.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center">
        <Columns2 className="mx-auto h-10 w-10 text-muted-foreground" />
        <h1 className="mt-4 text-xl font-bold text-foreground">{t('compare.title')}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t('compare.empty')}</p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          {t('compare.browse')}
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
            <Columns2 className="h-7 w-7 text-primary" />
            {t('compare.title')}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('compare.subtitle').replace('{max}', String(COMPARE_MAX))}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            clearCompare()
            router.replace('/compare')
          }}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm hover:bg-secondary"
        >
          <Trash2 className="h-4 w-4" />
          {t('compare.clear')}
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="sticky left-0 z-10 w-36 bg-card px-3 py-3 text-left text-xs font-medium text-muted-foreground">
                {t('compare.spec')}
              </th>
              {cars.map((car) => (
                <th key={car.id} className="min-w-[180px] px-3 py-3 text-left align-top">
                  <div className="relative mb-2 aspect-[4/3] overflow-hidden rounded-xl bg-muted">
                    <Image
                      src={car.image}
                      alt={`${car.year} ${car.brand} ${car.model}`}
                      fill
                      className="object-cover"
                      sizes="200px"
                    />
                    <button
                      type="button"
                      onClick={() => remove(car.id)}
                      className="absolute right-2 top-2 rounded-full bg-card/90 p-1.5 shadow hover:bg-card"
                      aria-label={t('compare.remove')}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <Link
                    href={`/car/${car.id}`}
                    className="font-semibold text-foreground hover:text-primary hover:underline"
                  >
                    {car.year} {car.brand} {car.model}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const values = cars.map((c) => row.value(c))
              const allSame = values.every((v) => v === values[0])
              return (
                <tr key={row.key} className="border-b border-border/70 last:border-0">
                  <th className="sticky left-0 z-10 bg-card px-3 py-2.5 text-left text-xs font-medium text-muted-foreground">
                    {row.label}
                  </th>
                  {values.map((v, i) => (
                    <td
                      key={`${row.key}-${cars[i].id}`}
                      className={`px-3 py-2.5 text-foreground ${!allSame ? 'font-semibold' : ''}`}
                    >
                      {v}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {cars.length < COMPARE_MAX && (
        <p className="text-center text-sm text-muted-foreground">
          {t('compare.addMore').replace('{n}', String(COMPARE_MAX - cars.length))}
        </p>
      )}
    </div>
  )
}

export default function ComparePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Suspense
        fallback={
          <div className="flex justify-center py-20 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        }
      >
        <CompareInner />
      </Suspense>
    </div>
  )
}
