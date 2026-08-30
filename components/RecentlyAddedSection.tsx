'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { ChevronRight, Clock } from 'lucide-react'
import CarCard, { type Car } from '@/components/CarCard'
import { useLanguage } from '@/context/LanguageContext'

type RecentlyAddedSectionProps = {
  cars: Car[]
  max?: number
}

export default function RecentlyAddedSection({ cars, max = 8 }: RecentlyAddedSectionProps) {
  const { t } = useLanguage()

  const recent = useMemo(() => {
    return [...cars]
      .filter((c) => c.createdAt)
      .sort((a, b) => {
        const da = new Date(a.createdAt!).getTime()
        const db = new Date(b.createdAt!).getTime()
        return db - da
      })
      .slice(0, max)
  }, [cars, max])

  if (recent.length === 0) return null

  return (
    <section className="section-padding border-b border-border/60">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
          <div>
            <div className="mb-1 flex items-center gap-2 text-primary">
              <Clock className="h-4 w-4" aria-hidden />
              <span className="text-xs font-semibold uppercase tracking-wide">{t('home.recent.badge')}</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {t('home.recent.title')}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{t('home.recent.subtitle')}</p>
          </div>
          <Link
            href="/#listings"
            className="hidden shrink-0 items-center gap-1 text-sm font-medium text-primary transition-colors hover:underline sm:inline-flex"
          >
            {t('home.recent.viewAll')}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {recent.slice(0, 4).map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>

        <div className="mt-6 text-center sm:hidden">
          <Link href="/#listings" className="btn-secondary inline-flex rounded-xl px-5 py-2.5 text-sm">
            {t('home.recent.viewAll')}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
