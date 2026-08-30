'use client'

import { Suspense, useState, useMemo, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import CarCard, { Car } from '@/components/CarCard'
import HomeSearchPanel from '@/components/HomeSearchPanel'
import { initialFilters } from '@/components/SearchFilters'
import VipListingsSection from '@/components/VipListingsSection'
import SiteBannerSlot from '@/components/SiteBannerSlot'
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
import { getWindowQueryString, softReplaceUrl } from '@/lib/soft-url'
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
  const searchParams = useSearchParams()
  const searchParamsString = searchParams.toString()

  const [cars, setCars] = useState<Car[]>([])
  const [loadingCars, setLoadingCars] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [filters, setFilters] = useState<FilterState>(initialFilters)
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [page, setPage] = useState(1)
  const [urlReady, setUrlReady] = useState(false)

  // URL → state only when Next searchParams change (links / back). Soft writes do not.
  useEffect(() => {
    const liveQs = getWindowQueryString()
    const source = new URLSearchParams(liveQs || searchParamsString)
    const { filters: fromUrl, sort, page: fromPage } = parseCarFiltersFromParams(source)
    setFilters(fromUrl)
    setSortBy(sort)
    setPage(fromPage)
    setUrlReady(true)
  }, [searchParamsString])

  const debouncedSearch = useDebouncedValue(filters.search, 350)
  useAnalyticsSearchLog(debouncedSearch, 'search_cars', user?.uid)

  // Soft URL update — no Suspense remount, input keeps focus while typing.
  useEffect(() => {
    if (!urlReady) return
    const params = carFiltersToParams({ ...filters, search: debouncedSearch }, sortBy, page)
    const qs = params.toString()
    if (qs === getWindowQueryString()) return
    softReplaceUrl(qs ? `/?${qs}` : '/')
  }, [debouncedSearch, filters, sortBy, page, urlReady])

  const updateFilters = useCallback((next: FilterState) => {
    setFilters(next)
    setPage(1)
  }, [])

  const updateSort = useCallback((next: SortOption) => {
    setSortBy(next)
    setPage(1)
  }, [])

  const fetchCars = useCallback(() => {
    setLoadingCars(true)
    setLoadError(false)
    loadAllCars()
      .then((data) => {
        setCars(data)
        setLoadError(false)
      })
      .catch(() => {
        setCars([])
        setLoadError(true)
      })
      .finally(() => setLoadingCars(false))
  }, [])

  useEffect(() => {
    fetchCars()
  }, [fetchCars])

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

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])
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
      <HomeSearchPanel
        filters={filters}
        onFiltersChange={updateFilters}
        onSearch={handleSearch}
        onReset={handleReset}
        resultCount={filteredAndSortedCars.length}
      />

      <div id="vin-check" className="mx-auto max-w-5xl px-4 pb-4 sm:px-6 lg:px-8">
        <VinChecker compact />
      </div>

      <SiteBannerSlot placement="home_below_hero" className="px-4 pb-4 pt-2 sm:px-6 lg:px-8" />

      <VipListingsSection cars={vipCars} />

      <SiteBannerSlot placement="home_mid" className="px-4 py-6 sm:px-6 lg:px-8" />

      <section id="listings" className="section-padding">
        <div className="mx-auto max-w-7xl">
          <SiteBannerSlot placement="listings_top" className="mb-6" />
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {t('home.allListings')}
              </h2>
              {!loadingCars && (
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                  {filteredAndSortedCars.length} {countLabel}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm font-medium text-muted-foreground">
                {t('home.sortBy')}:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => updateSort(e.target.value as SortOption)}
                className="select-premium w-auto min-w-[160px] py-2"
              >
                <option value="newest">{t('home.sort.featured')}</option>
                <option value="price-low">{t('home.sort.priceLow')}</option>
                <option value="price-high">{t('home.sort.priceHigh')}</option>
                <option value="mileage">{t('home.sort.mileage')}</option>
                <option value="year">{t('home.sort.year')}</option>
              </select>
            </div>
          </div>

          {loadError && !loadingCars ? (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-10 text-center">
              <p className="mb-4 text-muted-foreground">{t('home.loadError')}</p>
              <button
                type="button"
                onClick={fetchCars}
                className="btn-primary rounded-xl px-6 py-2.5"
              >
                {t('home.loadErrorRetry')}
              </button>
            </div>
          ) : loadingCars ? (
            <CarCardSkeletonGrid count={8} />
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
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
            <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center shadow-card">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
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
                className="btn-primary rounded-xl px-6 py-2.5"
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
