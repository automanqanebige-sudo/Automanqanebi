'use client'

import { useState, useMemo } from 'react'
import CarCard, { Car } from '@/components/CarCard'
import SearchFilters, { FilterState } from '@/components/SearchFilters'
import VipListingsSection from '@/components/VipListingsSection'
import { SITE_DOMAIN } from '@/lib/site'
import { sampleCars } from '@/data/cars'
import { useLanguage } from '@/context/LanguageContext'

const initialFilters: FilterState = {
  search: '',
  priceMin: '',
  priceMax: '',
  yearMin: '',
  yearMax: '',
  fuelType: '',
  transmission: '',
}

export default function Home() {
  const { t } = useLanguage()
  const [cars, setCars] = useState<Car[]>(sampleCars)
  const [filters, setFilters] = useState<FilterState>(initialFilters)
  const [sortBy, setSortBy] = useState('newest')

  const handleFavoriteToggle = (id: string) => {
    setCars((prevCars) =>
      prevCars.map((car) =>
        car.id === id ? { ...car, isFavorite: !car.isFavorite } : car
      )
    )
  }

  const handleReset = () => {
    setFilters(initialFilters)
  }

  const vipCars = useMemo(() => cars.filter((car) => car.isVip), [cars])

  const filteredAndSortedCars = useMemo(() => {
    let result = cars.filter((car) => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch =
          car.brand.toLowerCase().includes(searchLower) ||
          car.model.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }

      if (filters.priceMin && car.price < Number(filters.priceMin)) return false
      if (filters.priceMax && car.price > Number(filters.priceMax)) return false
      if (filters.yearMin && car.year < Number(filters.yearMin)) return false
      if (filters.yearMax && car.year > Number(filters.yearMax)) return false
      if (filters.fuelType && car.fuelType.toLowerCase() !== filters.fuelType.toLowerCase())
        return false
      if (
        filters.transmission &&
        car.transmission?.toLowerCase() !== filters.transmission.toLowerCase()
      )
        return false

      return true
    })

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
            />
          </div>
        </div>
      </section>

      <VipListingsSection cars={vipCars} onFavoriteToggle={handleFavoriteToggle} />

      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold text-foreground">{t('home.allListings')}</h2>
            <span className="px-3 py-1 text-sm font-medium bg-secondary text-secondary-foreground rounded-full">
              {filteredAndSortedCars.length} {countLabel}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">{filteredAndSortedCars.length}</span>{' '}
              {countLabel} {t('home.found')}
            </p>
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm text-muted-foreground">
                {t('home.sortBy')}:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              >
                <option value="newest">{t('home.sort.featured')}</option>
                <option value="price-low">{t('home.sort.priceLow')}</option>
                <option value="price-high">{t('home.sort.priceHigh')}</option>
                <option value="mileage">{t('home.sort.mileage')}</option>
                <option value="year">{t('home.sort.year')}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedCars.map((car) => (
              <CarCard key={car.id} car={car} onFavoriteToggle={handleFavoriteToggle} />
            ))}
          </div>

          {filteredAndSortedCars.length === 0 && (
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
