'use client'

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  ArrowLeft,
  ChevronRight,
  Clock,
  MapPin,
  Phone,
  Wrench,
} from 'lucide-react'
import ServiceCard from '@/components/ServiceCard'
import ServiceSearchBar from '@/components/ServiceSearchBar'
import ServiceReviewsSection from '@/components/ServiceReviewsSection'
import ReportListingButton from '@/components/ReportListingButton'
import CarImageGallery from '@/components/CarImageGallery'
import { useServiceCatalogT } from '@/hooks/useServiceCatalogT'
import { useLanguage } from '@/context/LanguageContext'
import { useCurrency } from '@/context/CurrencyContext'
import {
  SERVICE_SUB_SECTIONS,
  WORK_DAY_KEYS,
  type Service,
  type ServiceCategory,
} from '@/types/service'
import { sampleServices } from '@/data/services'
import { fetchServiceById, loadAllServices } from '@/lib/services-firestore'
import { getServiceImages } from '@/lib/service-images'
import {
  CATEGORY_TO_SECTION,
  filterServiceSubItems,
  filterServices,
} from '@/lib/service-search'

export default function ServiceDetailPage({ params }: { params: { id: string } }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center text-muted-foreground">
          Loading...
        </div>
      }
    >
      <ServiceDetailContent id={params.id} />
    </Suspense>
  )
}

function ServiceDetailContent({ id }: { id: string }) {
  const { t: baseT } = useLanguage()
  const { t, ready: catalogReady } = useServiceCatalogT()
  const { formatPrice } = useCurrency()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [service, setService] = useState<Service | null>(null)
  const [allServices, setAllServices] = useState<Service[]>(sampleServices)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') ?? '')

  useEffect(() => {
    setSearchQuery(searchParams.get('q') ?? '')
  }, [searchParams])

  useEffect(() => {
    Promise.all([fetchServiceById(id), loadAllServices()])
      .then(([found, list]) => {
        setService(found)
        setAllServices(list)
      })
      .finally(() => setLoading(false))
  }, [id])

  const categoryLabel = useCallback(
    (cat: ServiceCategory) => baseT(`services.cat.${cat}`),
    [baseT]
  )

  const sectionKey = service ? CATEGORY_TO_SECTION[service.category] : undefined

  const relatedServices = useMemo(() => {
    if (!service) return []
    const sameCategory = allServices.filter(
      (s) => s.id !== service.id && s.category === service.category
    )
    const pool = sameCategory.length > 0 ? sameCategory : allServices.filter((s) => s.id !== service.id)
    return filterServices(pool, searchQuery, 'all', categoryLabel)
  }, [allServices, service, searchQuery, categoryLabel])

  const specificItems = useMemo(() => {
    if (!searchQuery.trim() || !catalogReady) return []
    return filterServiceSubItems(searchQuery, t, sectionKey)
  }, [searchQuery, t, sectionKey, catalogReady])

  const updateSearch = (value: string) => {
    setSearchQuery(value)
    const paramsObj = new URLSearchParams(searchParams.toString())
    if (value.trim()) paramsObj.set('q', value.trim())
    else paramsObj.delete('q')
    const qs = paramsObj.toString()
    router.replace(qs ? `/services/${id}?${qs}` : `/services/${id}`, { scroll: false })
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-muted-foreground">
        {t('car.loading')}
      </div>
    )
  }

  if (!service) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-foreground">{t('services.notFound')}</h1>
        <Link href="/services" className="mt-4 inline-block text-primary hover:underline">
          {t('services.backToServices')}
        </Link>
      </div>
    )
  }

  const displayPrice = service.newPrice ?? service.price
  const bio = service.bio || service.description
  const mapUrl =
    service.latitude != null && service.longitude != null
      ? `https://www.openstreetmap.org/?mlat=${service.latitude}&mlon=${service.longitude}#map=16/${service.latitude}/${service.longitude}`
      : null
  const hasSearch = Boolean(searchQuery.trim())

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/services"
          className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('services.backToServices')}
        </Link>

        <div className="sticky top-[4.5rem] z-20 mb-6 rounded-2xl border border-border bg-card/95 p-4 shadow-sm backdrop-blur-md sm:p-5">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {t('services.searchInService')}
          </p>
          <ServiceSearchBar
            value={searchQuery}
            onChange={updateSearch}
            placeholder={t('services.searchSpecificPlaceholder')}
            resultCount={
              hasSearch ? relatedServices.length + specificItems.length : undefined
            }
            compact
          />
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            {getServiceImages(service).length > 0 && (
              <CarImageGallery images={getServiceImages(service)} alt={service.name} />
            )}

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{service.name}</h1>
                  <span className="mt-2 inline-block rounded-md bg-primary/10 px-2.5 py-1 text-sm font-medium text-primary">
                    {categoryLabel(service.category)}
                  </span>
                </div>
                {displayPrice != null && (
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{formatPrice(displayPrice)}</p>
                    {service.oldPrice != null && service.oldPrice > displayPrice && (
                      <p className="text-sm text-muted-foreground line-through">
                        {formatPrice(service.oldPrice)}
                      </p>
                    )}
                    {service.promoUntil && (
                      <p className="mt-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                        {t('services.promoUntil')}: {service.promoUntil}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {bio && (
                <p className="mb-6 leading-relaxed text-muted-foreground">{bio}</p>
              )}

              <div className="flex flex-wrap gap-3">
                <a
                  href={`tel:${service.phone.replace(/\s/g, '')}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  <Phone className="h-4 w-4" />
                  {service.phone}
                </a>
                {mapUrl && (
                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary"
                  >
                    <MapPin className="h-4 w-4" />
                    {t('services.viewOnMap')}
                  </a>
                )}
              </div>
            </div>

            {hasSearch && specificItems.length > 0 && (
              <section className="rounded-2xl border border-border bg-card p-6">
                <h2 className="mb-4 text-lg font-bold text-foreground">
                  {t('services.specificServices')}
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {specificItems.map((item) => (
                    <div
                      key={item.nameKey}
                      className="rounded-lg border border-border bg-background p-4"
                    >
                      <h3 className="font-medium text-foreground">{t(item.nameKey)}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{t(item.descKey)}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {relatedServices.length > 0 && (
              <section>
                <h2 className="mb-4 text-lg font-bold text-foreground">
                  {hasSearch ? t('services.matchingProviders') : t('services.relatedServices')}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {relatedServices.slice(0, hasSearch ? 6 : 3).map((s) => (
                    <ServiceCard key={s.id} service={s} categoryLabel={categoryLabel} />
                  ))}
                </div>
              </section>
            )}

            {hasSearch && relatedServices.length === 0 && specificItems.length === 0 && (
              <p className="rounded-xl border border-dashed border-border bg-card px-6 py-10 text-center text-muted-foreground">
                {t('services.noSearchResults')}
              </p>
            )}

            <ServiceReviewsSection serviceId={service.id} />
            <div className="mt-4">
              <ReportListingButton listingId={service.id} listingType="service" />
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5">
              <h2 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                {t('services.formLocation')}
              </h2>
              <p className="text-sm text-muted-foreground">{service.location}</p>
            </div>

            {(service.open24Hours || service.workSchedule) && (
              <div className="rounded-2xl border border-border bg-card p-5">
                <h2 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                  <Clock className="h-4 w-4 text-primary" />
                  {t('services.formWorkSchedule')}
                </h2>
                {service.open24Hours ? (
                  <p className="inline-flex rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
                    {t('services.open24HoursLabel')}
                  </p>
                ) : service.workSchedule ? (
                  <ul className="space-y-2 text-sm">
                    {WORK_DAY_KEYS.map((day) => {
                      const row = service.workSchedule![day]
                      return (
                        <li key={day} className="flex justify-between gap-2">
                          <span className="text-muted-foreground">{t(`services.day.${day}`)}</span>
                          <span className="font-medium text-foreground">
                            {row.closed ? t('services.formScheduleClosed') : `${row.open} – ${row.close}`}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                ) : null}
              </div>
            )}

            {!hasSearch && sectionKey && (
              <div className="rounded-2xl border border-border bg-card p-5">
                <h2 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                  <Wrench className="h-4 w-4 text-primary" />
                  {t('services.browseSpecific')}
                </h2>
                <div className="space-y-2">
                  {SERVICE_SUB_SECTIONS.find((s) => s.key === sectionKey)?.items.slice(0, 4).map((item) => (
                    <button
                      key={item.nameKey}
                      type="button"
                      onClick={() => updateSearch(t(item.nameKey))}
                      className="group flex w-full items-center justify-between rounded-lg border border-border bg-background px-3 py-2.5 text-left text-sm transition-colors hover:border-primary/30"
                    >
                      <span className="font-medium text-foreground">{t(item.nameKey)}</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  )
}
