'use client'

import { Suspense, useState, useMemo, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Plus } from 'lucide-react'
import CarCard, { Car } from '@/components/CarCard'
import SearchFilters, { initialFilters } from '@/components/SearchFilters'
import ListingQuickSearch from '@/components/ListingQuickSearch'
import VipListingsSection from '@/components/VipListingsSection'
import MobileServicesQuickLinks from '@/components/MobileServicesQuickLinks'
import SiteBannerSlot from '@/components/SiteBannerSlot'
import HeroBanner from '@/components/HeroBanner'
import VinChecker from '@/components/VinChecker'
import { CarCardSkeletonGrid } from '@/components/ui/Skeleton'
import { loadAllCars } from '@/lib/cars-firestore'
import { applyCarFilters } from '@/lib/apply-car-filters'
import {
  carFiltersToParams,
  parseCarFiltersFromParams,
  LISTINGS_PAGE_SIZE,
  type SortOption,
} from '@/lib/car-filter-url'
import Pagination from '@/components/Pagination'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { useAnalyticsSearchLog } from '@/hooks/useAnalyticsSearchLog'
import type { FilterState } from '@/types/filters'

export default function Home() {
  return (
    <Suspense fallback={<HomePageFallback />}>
      <HomePageContent />
    </Suspense>
  )
}

function HomePageFallback() {
  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <CarCardSkeletonGrid count={8} />
      </div>
    </section>
  )
}

function HomePageContent() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const skipUrlHydrate = useRef(false)

  const [cars, setCars] = useState<Car[]>([])
  const [loadingCars, setLoadingCars] = useState(true)
  const [filters, setFilters] = useState<FilterState>(initialFilters)
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [page, setPage] = useState(1)
  const [urlReady, setUrlReady] = useState(false)

  useEffect(() => {
    if (skipUrlHydrate.current) {
      skipUrlHydrate.current = false
      setUrlReady(true)
      return
    }
    const { filters: fromUrl, sort, page: fromPage } = parseCarFiltersFromParams(searchParams)
    setFilters(fromUrl)
    setSortBy(sort)
    setPage(fromPage)
    setUrlReady(true)
  }, [searchParams])

  const debouncedSearch = useDebouncedValue(filters.search, 350)
  useAnalyticsSearchLog(debouncedSearch, 'search_cars', user?.uid)

  useEffect(() => {
    if (!urlReady) return
    const params = carFiltersToParams({ ...filters, search: debouncedSearch }, sortBy, page)
    const qs = params.toString()
    const current = searchParams.toString()
    if (qs === current) return
    skipUrlHydrate.current = true
    router.replace(qs ? `/?${qs}` : '/', { scroll: false })
  }, [debouncedSearch, filters, sortBy, page, urlReady, router, searchParams])

  const updateFilters = useCallback((next: FilterState) => {
    setFilters(next)
    setPage(1)
  }, [])

  const updateSort = useCallback((next: SortOption) => {
    setSortBy(next)
    setPage(1)
  }, [])

  useEffect(() => {
    loadAllCars()
      .then(setCars)
      .catch(() => setCars([]))
      .finally(() => setLoadingCars(false))
  }, [])

  const handleReset = useCallback(() => {
    setFilters(initialFilters)
    setSortBy('newest')
    setPage(1)
  }, [])

  const vipCars = useMemo(() => cars.filter((car) => car.isVip), [cars])

  const activeFilters = useMemo(
    () => ({ ...filters, search: debouncedSearch }),
    [filters, debouncedSearch]
  )

  const filteredAndSortedCars = useMemo(() => {
    let result = applyCarFilters(cars, activeFilters)

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
  }, [cars, activeFilters, sortBy])

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedCars.length / LISTINGS_PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paginatedCars = filteredAndSortedCars.slice(
    (safePage - 1) * LISTINGS_PAGE_SIZE,
    safePage * LISTINGS_PAGE_SIZE
  )

  const handleSearch = () => {
    document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' })
  }

  const countLabel =
    filteredAndSortedCars.length === 1 ? t('home.listing') : t('home.listings')

  return (
    <>
      <HeroBanner>
        <div className="mb-3 flex justify-end">
          <Link
            href="/add-car"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-colors hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            {t('home.addListing')}
          </Link>
        </div>
        <ListingQuickSearch
          search={filters.search}
          offerType={filters.offerType}
          onSearchChange={(search) => updateFilters({ ...filters, search })}
          onOfferTypeChange={(offerType) => updateFilters({ ...filters, offerType })}
          resultCount={filteredAndSortedCars.length}
        />
        <SearchFilters
          filters={filters}
          onFiltersChange={updateFilters}
          onSearch={handleSearch}
          onReset={handleReset}
          resultCount={filteredAndSortedCars.length}
        />
        <VinChecker compact className="mt-4" />
      </HeroBanner>

      <SiteBannerSlot placement="home_below_hero" className="px-4 pb-4 pt-2 sm:px-6 lg:px-8" />

      <MobileServicesQuickLinks className="py-6 sm:py-8" />

      <VipListingsSection cars={vipCars} />

      <SiteBannerSlot placement="home_mid" className="px-4 py-6 sm:px-6 lg:px-8" />

      <section id="listings" className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SiteBannerSlot placement="listings_top" className="mb-6" />
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-foreground">{t('home.allListings')}</h2>
              {!loadingCars && (
                <span className="rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">
                  {filteredAndSortedCars.length} {countLabel}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm text-muted-foreground">
                {t('home.sortBy')}:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => updateSort(e.target.value as SortOption)}
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

          {loadingCars ? (
            <CarCardSkeletonGrid count={8} />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {paginatedCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}

          {!loadingCars && filteredAndSortedCars.length > 0 && (
            <Pagination
              page={safePage}
              totalPages={totalPages}
              onPageChange={(nextPage) => {
                setPage(nextPage)
                document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' })
              }}
            />
          )}

          {!loadingCars && filteredAndSortedCars.length === 0 && (
            <div className="px-4 py-16 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                <svg className="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">{t('home.empty.title')}</h3>
              <p className="mx-auto mb-6 max-w-md text-muted-foreground">{t('home.empty.desc')}</p>
              <button
                onClick={handleReset}
                className="rounded-lg bg-primary px-6 py-2.5 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
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

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(timer)
  }, [value, delayMs])
  return debounced
}
