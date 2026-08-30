'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import WorkshopsMapSection from '@/components/WorkshopsMapSection'
import WorkshopsCategoriesSection from '@/components/WorkshopsCategoriesSection'
import ServiceCard from '@/components/ServiceCard'
import { sampleServices } from '@/data/services'
import { invalidateServicesCache, loadAllServices } from '@/lib/services-firestore'
import {
  LEGACY_WORKSHOP_CATEGORIES,
  WORKSHOP_PAGE_CATEGORIES,
  WORKSHOP_PAGE_CATEGORY_ENTRIES,
  type Service,
  type ServiceCategory,
} from '@/types/service'
import { isPhysicalAutoService } from '@/lib/service-map-eligibility'

export default function WorkshopsPage() {
  const { t } = useLanguage()
  const [services, setServices] = useState<Service[]>(sampleServices)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null)

  useEffect(() => {
    invalidateServicesCache()
    loadAllServices()
      .then(setServices)
      .catch(() => setServices(sampleServices))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const cat = params.get('category')
    if (cat && WORKSHOP_PAGE_CATEGORIES.includes(cat as ServiceCategory)) {
      setSelectedCategory(cat as ServiceCategory)
    }
  }, [])

  const workshopServices = useMemo(
    () =>
      services.filter(
        (s) =>
          WORKSHOP_PAGE_CATEGORIES.includes(s.category) ||
          LEGACY_WORKSHOP_CATEGORIES.includes(s.category)
      ),
    [services]
  )

  const mapServices = useMemo(
    () => services.filter(isPhysicalAutoService),
    [services]
  )

  const workshops = useMemo(() => {
    if (!selectedCategory) return workshopServices
    return workshopServices.filter((s) => s.category === selectedCategory)
  }, [workshopServices, selectedCategory])

  const categoryLabel = (cat: string) => {
    const entry = WORKSHOP_PAGE_CATEGORY_ENTRIES.find((e) => e.category === cat)
    if (entry?.labelKey) return t(entry.labelKey)
    return t(`services.cat.${cat}`)
  }

  const addWorkshopHref = selectedCategory
    ? `/workshops/add?category=${selectedCategory}`
    : '/workshops/add'

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 pb-28 sm:px-6 sm:py-10 sm:pb-10 lg:px-8">
      <Link
        href="/"
        className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground sm:mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('nav.home')}
      </Link>

      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{t('workshops.title')}</h1>
        <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground sm:mt-2 sm:text-base">
          {t('workshops.subtitle')}
        </p>
      </div>

      <div className="relative z-20 mb-4 sm:mb-8">
        <WorkshopsCategoriesSection
          value={selectedCategory}
          onChange={setSelectedCategory}
        />
      </div>

      <div className="mb-4 hidden sm:mb-6 sm:flex sm:justify-end">
        <Link
          href={addWorkshopHref}
          className="btn-primary inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm"
        >
          <Plus className="h-4 w-4" />
          {t('workshops.addWorkshop')}
        </Link>
      </div>

      <Link
        href={addWorkshopHref}
        className="btn-primary fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] left-4 right-4 z-40 rounded-xl px-5 py-3 text-sm shadow-lg shadow-primary/25 sm:hidden"
      >
        <Plus className="h-4 w-4" />
        {t('workshops.addWorkshop')}
      </Link>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-bold text-foreground">{t('workshops.mapTitle')}</h2>
        <WorkshopsMapSection mapServices={mapServices} listServices={workshops} />
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-foreground">{t('workshops.listTitle')}</h2>
        {loading ? (
          <p className="text-muted-foreground">{t('car.loading')}</p>
        ) : workshops.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card px-6 py-12 text-center">
            <p className="text-muted-foreground">{t('workshops.empty')}</p>
            <Link
              href={addWorkshopHref}
              className="btn-primary mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm"
            >
              <Plus className="h-4 w-4" />
              {t('workshops.addWorkshop')}
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {workshops.map((service) => (
              <ServiceCard key={service.id} service={service} categoryLabel={categoryLabel} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
