'use client'

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, Plus } from 'lucide-react'
import ServiceCard from '@/components/ServiceCard'
import ServicesTopSearch from '@/components/ServicesTopSearch'
import ServiceSearchResults from '@/components/ServiceSearchResults'
import { ServiceCardSkeletonGrid } from '@/components/ui/Skeleton'
import ServiceDiscFilters from '@/components/ServiceDiscFilters'
import ServiceCategoryAdsSection from '@/components/ServiceCategoryAdsSection'
import SiteBannerSlot from '@/components/SiteBannerSlot'
import MobileServicesCategoriesSection from '@/components/MobileServicesCategoriesSection'
import MarketplaceServicesCategoriesSection from '@/components/MarketplaceServicesCategoriesSection'
import {
  FILTERABLE_SERVICE_CATEGORIES,
  type Service,
  type ServiceCategory,
} from '@/types/service'
import { useServiceCatalogT } from '@/hooks/useServiceCatalogT'
import { useLanguage } from '@/context/LanguageContext'
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
  DISC_BOLT_PATTERNS,
  DISC_CONDITIONS,
  DISC_DIAMETERS,
  DISC_MATERIALS,
  initialDiscFilters,
  type DiscBoltPattern,
  type DiscCondition,
  type DiscDiameter,
  type DiscMaterial,
  type ServiceDiscFilterState,
} from '@/types/disc-filters'
import { useAuth } from '@/context/AuthContext'
import { useAnalyticsSearchLog } from '@/hooks/useAnalyticsSearchLog'
import { getWindowQueryString, softReplaceUrl } from '@/lib/soft-url'

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
  const searchParams = useSearchParams()
  const searchParamsString = searchParams.toString()

  const cachedServices = getCachedServices()
  const cachedAds = getCachedServiceCategoryAds()

  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [discFilters, setDiscFilters] = useState<ServiceDiscFilterState>(initialDiscFilters)
  const [services, setServices] = useState<Service[]>(cachedServices ?? sampleServices)
  const [categoryAds, setCategoryAds] = useState<ServiceCategoryAd[]>(cachedAds ?? [])
  const [loading, setLoading] = useState(!cachedServices)
  const [urlReady, setUrlReady] = useState(false)

  useEffect(() => {
    const liveQs = getWindowQueryString()
    const params = new URLSearchParams(liveQs || searchParamsString)
    const q = params.get('q') ?? ''
    const cat = params.get('category')
    const diameter = params.get('diameter') ?? ''
    const bolt = params.get('bolt') ?? ''
    const material = params.get('material') ?? ''
    const condition = params.get('condition') ?? ''

    setSearchQuery(q)

    if (diameter || bolt || material || condition) {
      setSelectedCategory('discs')
    } else if (cat && FILTERABLE_SERVICE_CATEGORIES.includes(cat as ServiceCategory)) {
      setSelectedCategory(cat as ServiceCategory)
    } else {
      setSelectedCategory(null)
    }

    setDiscFilters({
      diameter: DISC_DIAMETERS.includes(diameter as DiscDiameter)
        ? (diameter as DiscDiameter)
        : '',
      boltPattern: DISC_BOLT_PATTERNS.includes(bolt as DiscBoltPattern)
        ? (bolt as DiscBoltPattern)
        : '',
      material: DISC_MATERIALS.includes(material as DiscMaterial)
        ? (material as DiscMaterial)
        : '',
      condition: DISC_CONDITIONS.includes(condition as DiscCondition)
        ? (condition as DiscCondition)
        : '',
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
    if (selectedCategory) params.set('category', selectedCategory)
    if (discFilters.diameter) params.set('diameter', discFilters.diameter)
    if (discFilters.boltPattern) params.set('bolt', discFilters.boltPattern)
    if (discFilters.material) params.set('material', discFilters.material)
    if (discFilters.condition) params.set('condition', discFilters.condition)
    const qs = params.toString()
    if (qs === getWindowQueryString()) return
    softReplaceUrl(qs ? `/services?${qs}` : '/services')
  }, [debouncedSearch, selectedCategory, discFilters, urlReady])

  const categoryLabel = useCallback(
    (cat: ServiceCategory) => baseT(`services.cat.${cat}`),
    [baseT]
  )

  const hasSearch = Boolean(debouncedSearch.trim())

  const scopedServices = useMemo(
    () => services.filter((service) => FILTERABLE_SERVICE_CATEGORIES.includes(service.category)),
    [services]
  )

  const filteredServices = useMemo(() => {
    if (!selectedCategory && !hasSearch) return []
    return filterServices(
      scopedServices,
      debouncedSearch,
      selectedCategory ?? 'all',
      categoryLabel,
      undefined,
      discFilters
    )
  }, [scopedServices, debouncedSearch, selectedCategory, categoryLabel, discFilters, hasSearch])

  const catalogMatches = useMemo(() => {
    if (!hasSearch) return []
    const allowed = new Set<string>(FILTERABLE_SERVICE_CATEGORIES)
    return filterServiceSubItems(debouncedSearch, catalogReady ? t : baseT).filter((item) =>
      allowed.has(item.defaultCategory)
    )
  }, [hasSearch, catalogReady, debouncedSearch, t, baseT])

  const searchSuggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (q.length < 1) return []
    const labelFn = catalogReady ? t : baseT
    const names = scopedServices
      .filter((s) => s.name.toLowerCase().includes(q))
      .map((s) => s.name)
    const catalog = filterServiceSubItems(searchQuery, labelFn)
      .slice(0, 5)
      .map((item) => labelFn(`services.sub.${item.id}`))
    return [...new Set([...names, ...catalog])].slice(0, 8)
  }, [searchQuery, scopedServices, catalogReady, t, baseT])

  const visibleCategoryAds = useMemo(
    () =>
      selectedCategory ? filterAdsForCategory(categoryAds, selectedCategory) : [],
    [categoryAds, selectedCategory]
  )

  const selectCategory = (cat: ServiceCategory | null) => {
    setSelectedCategory(cat)
    if (cat !== 'discs') {
      setDiscFilters(initialDiscFilters)
    }
    if (searchQuery) setSearchQuery('')
  }

  const showListings = Boolean(selectedCategory || hasSearch)

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-[6.5rem] z-30 border-b border-border bg-white backdrop-blur-md md:top-[7rem]">
        <ServicesTopSearch
          value={searchQuery}
          onChange={setSearchQuery}
          suggestions={searchSuggestions}
        />
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

        <MobileServicesCategoriesSection
          className="mb-8"
          value={selectedCategory}
          onChange={selectCategory}
        />

        <MarketplaceServicesCategoriesSection
          className="mb-8"
          value={selectedCategory}
          onChange={selectCategory}
        />

        {selectedCategory === 'discs' && (
          <ServiceDiscFilters filters={discFilters} onChange={setDiscFilters} />
        )}

        {selectedCategory && (
          <ServiceCategoryAdsSection ads={visibleCategoryAds} categoryLabel={categoryLabel} />
        )}

        <SiteBannerSlot placement="services_mid" className="mb-8" />

        {!hasSearch && !showListings && (
          <div className="mb-12 rounded-xl border border-dashed border-border bg-card px-6 py-12 text-center">
            <p className="text-muted-foreground">{baseT('services.pickCategory')}</p>
          </div>
        )}

        {loading && showListings && !hasSearch ? (
          <ServiceCardSkeletonGrid count={6} />
        ) : showListings && !hasSearch && filteredServices.length === 0 ? (
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
        ) : showListings && !hasSearch ? (
          <>
            <h2 className="mb-4 text-xl font-bold text-foreground">
              {selectedCategory ? categoryLabel(selectedCategory) : baseT('services.userListings')}
            </h2>
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
