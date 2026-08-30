'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import VipCarCard from './VipCarCard'
import { Car } from './CarCard'
import { useLanguage } from '@/context/LanguageContext'

interface VipListingsSectionProps {
  cars: Car[]
  onFavoriteToggle?: (id: string) => void
}

export default function VipListingsSection({ cars, onFavoriteToggle }: VipListingsSectionProps) {
  const { t } = useLanguage()
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return

    const scrollAmount = 400
    const newScrollLeft =
      scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount)

    scrollContainerRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth',
    })
  }

  if (cars.length === 0) return null

  return (
    <section className="py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">{t('vip.title')}</h2>
            <p className="mt-0.5 text-muted-foreground">{t('vip.subtitle')}</p>
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            <button
              onClick={() => scroll('left')}
              className="group rounded-xl border border-border bg-card p-3 shadow-sm transition-all duration-200 hover:border-primary/40 hover:bg-primary/10 hover:shadow-md"
              aria-label={t('vip.scrollLeft')}
            >
              <ChevronLeft className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="group rounded-xl border border-border bg-card p-3 shadow-sm transition-all duration-200 hover:border-primary/40 hover:bg-primary/10 hover:shadow-md"
              aria-label={t('vip.scrollRight')}
            >
              <ChevronRight className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-8 bg-gradient-to-r from-background/80 to-transparent" />
          <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-8 bg-gradient-to-l from-background/80 to-transparent" />

          <div
            ref={scrollContainerRef}
            className="scrollbar-hide flex gap-6 overflow-x-auto px-2 pb-4 pt-2 scroll-smooth"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {cars.map((car) => (
              <VipCarCard key={car.id} car={car} onFavoriteToggle={onFavoriteToggle} />
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/#listings"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
          >
            {t('vip.viewAll')}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
