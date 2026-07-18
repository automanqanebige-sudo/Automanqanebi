'use client'

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Plus, Wrench } from 'lucide-react'
import ServiceCard from '@/components/ServiceCard'
import ServiceCatalogSections from '@/components/ServiceCatalogSections'
import ServicesTopSearch from '@/components/ServicesTopSearch'
import ServiceSearchResults from '@/components/ServiceSearchResults'
import { ServiceCardSkeletonGrid } from '@/components/ui/Skeleton'
import ServiceRentalFilters from '@/components/ServiceRentalFilters'
import ServiceCategoryAdsSection from '@/components/ServiceCategoryAdsSection'
import SiteBannerSlot from '@/components/SiteBannerSlot'
import VinChecker from '@/components/VinChecker'
import { useServiceCatalogT } from '@/hooks/useServiceCatalogT'
import { useLanguage } from '@/context/LanguageContext'
import {
  SERVICE_CATEGORIES,
  SERVICE_CATEGORY_ICONS,
  catalogSectionsForCategory,
  type Service,
  type ServiceCategory,
} from '@/types/service'
import MobileServicesQuickLinks from '@/components/MobileServicesQuickLinks'
import { sampleServices } from '@/data/services'
import { loadAllServices, getCachedServices } from '@/lib/services-firestore'
import {
  fetchServiceCategoryAds,
  filterAdsForCategory,
  getCachedServiceCategoryAds,
} from '@/lib/service-category-ads-firestore'
import { filterServiceSubItems, filterServices } from '@/lib/service-search'
import type { ServiceCategoryAd } from '@/types/service-category-ad'
import {
  RENTAL_SUB_SERVICES,
  RENTAL_TRANSPORT_TYPES,
  initialRentalFilters,
  type RentalSubService,
  type RentalTransportType,
  type ServiceRentalFilterState,
} from '@/types/rental-transport'
import { useAuth } from '@/context/AuthContext'
import { useAnalyticsSearchLog } from '@/hooks/useAnalyticsSearchLog'

export default function ServicesPage() {
  return (
    <Suspense fallback={null}>
      <ServicesPageContent />
    </Suspense>
  )
}

function ServicesPageContent() {
  const { t: baseT } = useLanguage()
  const { user } = useAuth()
  const { t, ready: catalogReady } = useServiceCatalogT()
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchParamsString = searchParams.toString()
  const skipSearchHydrate = useRef(false)

  const cachedServices = getCachedServices()
  const cachedAds = getCachedServiceCategoryAds()

  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [rentalFilters, setRentalFilters] = useState<ServiceRentalFilterState>(initialRentalFilters)
  const [services, setServices] = useState<Service[]>(cachedServices ?? sampleServices)
  const [categoryAds, setCategoryAds] = useState<ServiceCategoryAd[]>(cachedAds ?? [])
  const [loading, setLoading] = useState(!cachedServices)
  const [urlReady, setUrlReady] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(searchParamsString)
    const q = params.get('q') ?? ''
    const cat = params.get('category')
    const transport = params.get('transport') ?? ''
    const sub = params.get('sub') ?? ''
    const driver = params.get('driver') ?? ''

    // Internal router.replace from our debounce must not clobber in-progress typing,
    // but external Link clicks (category / catalog item) must update search fully.
    if (skipSearchHydrate.current) {
      skipSearchHydrate.current = false
    } else {
      setSearchQuery(q)
    }

    if (sub || transport || driver) {
      setSelectedCategory('rental')
    } else if (cat && (cat === 'all' || SERVICE_CATEGORIES.includes(cat as ServiceCategory))) {
      setSelectedCategory(cat as ServiceCategory | 'all')
    } else {
      setSelectedCategory('all')
    }
    setRentalFilters({
      transport: RENTAL_TRANSPORT_TYPES.includes(transport as RentalTransportType)
        ? (transport as RentalTransportType)
        : '',
      subService: RENTAL_SUB_SERVICES.includes(sub as RentalSubService)
        ? (sub as RentalSubService)
        : '',
      withDriver: driver === 'yes' || driver === 'no' ? driver : '',
    })
    setUrlReady(true)
  }, [searchParamsString])

  useEffect(() => {
    let cancelled = false
    Promise.all([
      loadAllServices()
        .then((list) => {
          if (!cancelled) setServices(list)
        })
        .catch(() => {
          if (!cancelled) setServices(sampleServices)
        }),
      fetchServiceCategoryAds()
        .then((ads) => {
          if (!cancelled) setCategoryAds(ads)
        })
        .catch(() => {
          if (!cancelled) setCategoryAds([])
        }),
    ]).finally(() => {
      if (!cancelled) setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const debouncedSearch = useDebouncedValue(searchQuery, 350)
  useAnalyticsSearchLog(debouncedSearch, 'search_services', user?.uid)

  useEffect(() => {
    if (!urlReady) return
    const params = new URLSearchParams()
    if (debouncedSearch.trim()) params.set('q', debouncedSearch.trim())
    if (selectedCategory !== 'all') params.set('category', selectedCategory)
    if (rentalFilters.transport) params.set('transport', rentalFilters.transport)
    if (rentalFilters.subService) params.set('sub', rentalFilters.subService)
    if (rentalFilters.withDriver) params.set('driver', rentalFilters.withDriver)
    const qs = params.toString()
    if (qs === searchParamsString) return
    skipSearchHydrate.current = true
    router.replace(qs ? `/services?${qs}` : '/services', { scroll: false })
  }, [debouncedSearch, selectedCategory, rentalFilters, urlReady, router, searchParamsString])

  const categoryLabel = useCallback(
    (cat: ServiceCategory) => baseT(`services.cat.${cat}`),
    [baseT]
  )

  const hasSearch = Boolean(debouncedSearch.trim())

  const filteredServices = useMemo(
    () => filterServices(services, debouncedSearch, selectedCategory, categoryLabel, rentalFilters),
    [services, debouncedSearch, selectedCategory, categoryLabel, rentalFilters]
  )

  const visibleSections = useMemo(() => {
    if (!catalogReady) return []
    return catalogSectionsForCategory(selectedCategory)
  }, [catalogReady, selectedCategory])

  const catalogDefaultExpanded = useMemo(() => {
    if (selectedCategory === 'mobile') return 'mobile' as const
    if (selectedCategory !== 'all' && visibleSections.length === 1) {
      return visibleSections[0].key
    }
    return null
  }, [selectedCategory, visibleSections])

  const catalogMatches = useMemo(() => {
    if (!hasSearch || !catalogReady) return []
    return filterServiceSubItems(debouncedSearch, t)
  }, [hasSearch, catalogReady, debouncedSearch, t])

  const visibleCategoryAds = useMemo(
    () => filterAdsForCategory(categoryAds, selectedCategory),
    [categoryAds, selectedCategory]
  )

  const selectCategory = (cat: ServiceCategory | 'all') => {
    setSelectedCategory(cat)
    if (cat !== 'rental') {
      setRentalFilters(initialRentalFilters)
    }
    // Clear search when picking a category chip so the list visibly updates
    if (searchQuery) setSearchQuery('')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-14 z-30 border-b border-border bg-card/95 backdrop-blur-md sm:top-[4.25rem]">
        <ServicesTopSearch value={searchQuery} onChange={setSearchQuery} />
      </div>

      {hasSearch && (
        <ServiceSearchResults
          query={debouncedSearch}
          catalogMatches={catalogMatches}
          userServices={filteredServices}
          catalogReady={catalogReady}
          loading={loading}
          t={t}
          baseT={baseT}
          categoryLabel={categoryLabel}
        />
      )}

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {baseT('nav.home')}
        </Link>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{baseT('services.title')}</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">{baseT('services.subtitle')}</p>
          </div>
          <Link
            href="/services/add"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            {baseT('services.addService')}
          </Link>
        </div>

        <SiteBannerSlot placement="services_top" className="mb-8" />

        <Link
          href="/workshops"
          className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-primary/30 bg-primary/5 px-5 py-4 transition-colors hover:bg-primary/10"
        >
          <div className="flex items-center gap-3">
            <Wrench className="h-6 w-6 text-primary" />
            <div>
              <p className="font-semibold text-foreground">{baseT('workshops.title')}</p>
              <p className="text-sm text-muted-foreground">{baseT('workshops.subtitle')}</p>
            </div>
          </div>
          <span className="text-sm font-medium text-primary">{baseT('workshops.openMap')} →</span>
        </Link>

        <MobileServicesQuickLinks className="mb-8" />

        <div className="mb-8">
          <button
            type="button"
            onClick={() => selectCategory('all')}
            className={`mb-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'border border-border bg-card text-foreground hover:bg-secondary'
            }`}
          >
            {baseT('services.all')}
          </button>
          <div className="flex flex-wrap gap-2 rounded-xl border border-border/60 bg-card/50 p-2 sm:border-0 sm:bg-transparent sm:p-0">
            {SERVICE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => selectCategory(cat)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-border bg-card text-foreground hover:bg-secondary'
                }`}
              >
                <span className="mr-1" aria-hidden>
                  {SERVICE_CATEGORY_ICONS[cat]}
                </span>
                {categoryLabel(cat)}
              </button>
            ))}
          </div>
        </div>

        {(selectedCategory === 'rental' || rentalFilters.transport || rentalFilters.subService) && (
          <ServiceRentalFilters filters={rentalFilters} onChange={setRentalFilters} />
        )}

        <ServiceCategoryAdsSection ads={visibleCategoryAds} categoryLabel={categoryLabel} />

        <VinChecker className="mb-8" />

        <SiteBannerSlot placement="services_mid" className="mb-8" />

        {loading && !hasSearch ? (
          <ServiceCardSkeletonGrid count={6} />
        ) : !hasSearch && filteredServices.length === 0 ? (
          <div className="mb-12 rounded-xl border border-dashed border-border bg-card px-6 py-12 text-center">
            <p className="text-muted-foreground">{baseT('services.empty')}</p>
            <Link
              href="/services/add"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              {baseT('services.addService')}
            </Link>
          </div>
        ) : !hasSearch ? (
          <>
            <h2 className="mb-4 text-xl font-bold text-foreground">{baseT('services.userListings')}</h2>
            <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  categoryLabel={categoryLabel}
                />
              ))}
            </div>
          </>
        ) : null}

        {!hasSearch && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">{baseT('services.categories')}</h2>

            {!catalogReady ? (
              <p className="text-sm text-muted-foreground">{baseT('car.loading')}</p>
            ) : (
              <ServiceCatalogSections
                key={selectedCategory}
                sections={visibleSections}
                hasSearch={false}
                t={t}
                defaultExpanded={catalogDefaultExpanded}
              />
            )}
          </div>
        )}
      </div>
    </div>
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
