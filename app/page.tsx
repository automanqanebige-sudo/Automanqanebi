'use client'

import { useState, useMemo, useEffect } from 'react'
import CarCard, { Car } from '@/components/CarCard'
import SearchFilters, { initialFilters } from '@/components/SearchFilters'
import VipListingsSection from '@/components/VipListingsSection'
import CurrencyToggle from '@/components/CurrencyToggle'
import { SITE_DOMAIN } from '@/lib/site'
import { loadAllCars } from '@/lib/cars-firestore'
import { applyCarFilters } from '@/lib/apply-car-filters'
import { useLanguage } from '@/context/LanguageContext'

export default function Home() {
  const { t } = useLanguage()
  const [cars, setCars] = useState<Car[]>([])
  const [loadingCars, setLoadingCars] = useState(true)
  const [filters, setFilters] = useState(initialFilters)
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    loadAllCars()
      .then(setCars)
      .catch(() => setCars([]))
      .finally(() => setLoadingCars(false))
  }, [])

  const handleReset = () => {
    setFilters(initialFilters)
  }

  const vipCars = useMemo(() => cars.filter((car) => car.isVip), [cars])

  const filteredAndSortedCars = useMemo(() => {
    let result = applyCarFilters(cars, filters)

    switch (sortBy) {
      case 'price-low':
        result = [...result].sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        result = [...result].sort((a, b) => b.price - a.price)
        break
      case 'mileage':
        result = [...result].sort((a, b) => a.mileage - b.mileage)
        break
      case 'year':
        result = [...result].sort((a, b) => b.year - a.year)
        break
      case 'newest':
      default:
        result = [...result].sort((a, b) => {
          if (a.isVip !== b.isVip) return a.isVip ? -1 : 1
          return b.year - a.year
        })
        break
    }

    return result
  }, [cars, filters, sortBy])

  const countLabel =
    filteredAndSortedCars.length === 1 ? t('home.listing') : t('home.listings')

  return (
    <>
      <section className="bg-gradient-to-br from-primary/10 via-background to-background py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">{SITE_DOMAIN}</p>
          <h1 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance">
            {t('home.hero.title')}
          </h1>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl">{t('home.hero.subtitle')}</p>

          <div className="mt-8">
            <SearchFilters
              filters={filters}
              onFiltersChange={setFilters}
              onSearch={() => {}}
              onReset={handleReset}
              resultCount={filteredAndSortedCars.length}
            />
          </div>
        </div>
      </section>

      <VipListingsSection cars={vipCars} />

      <section id="listings" className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold text-foreground">{t('home.allListings')}</h2>
            <span className="px-3 py-1 text-sm font-medium bg-secondary text-secondary-foreground rounded-full">
              {filteredAndSortedCars.length} {countLabel}
            </span>
            {loadingCars && (
              <span className="text-sm text-muted-foreground">{t('car.loading')}</span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">{filteredAndSortedCars.length}</span>{' '}
              {countLabel} {t('home.found')}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <CurrencyToggle compact />
              <div className="flex items-center gap-2">
                <label htmlFor="sort" className="text-sm text-muted-foreground">
                  {t('home.sortBy')}:
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="cursor-pointer rounded-lg border border-input bg-card px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="newest">{t('home.sort.featured')}</option>
                  <option value="price-low">{t('home.sort.priceLow')}</option>
                  <option value="price-high">{t('home.sort.priceHigh')}</option>
                  <option value="mileage">{t('home.sort.mileage')}</option>
                  <option value="year">{t('home.sort.year')}</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>

          {filteredAndSortedCars.length === 0 && !loadingCars && (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
                <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{t('home.empty.title')}</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">{t('home.empty.desc')}</p>
              <button
                onClick={handleReset}
                className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                {t('home.empty.clear')}
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
