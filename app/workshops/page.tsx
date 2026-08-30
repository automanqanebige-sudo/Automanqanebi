'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { CategoryTagGrid } from '@/components/CategoryTagPicker'
import { useLanguage } from '@/context/LanguageContext'
import WorkshopsMapSection from '@/components/WorkshopsMapSection'
import ServiceCard from '@/components/ServiceCard'
import { sampleServices } from '@/data/services'
import { loadAllServices } from '@/lib/services-firestore'
import { WORKSHOP_PAGE_CATEGORIES, type Service, type ServiceCategory } from '@/types/service'

export default function WorkshopsPage() {
  const { t } = useLanguage()
  const [services, setServices] = useState<Service[]>(sampleServices)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null)

  useEffect(() => {
    loadAllServices()
      .then(setServices)
      .catch(() => setServices(sampleServices))
      .finally(() => setLoading(false))
  }, [])

  const workshopServices = useMemo(
    () => services.filter((s) => WORKSHOP_PAGE_CATEGORIES.includes(s.category)),
    [services]
  )

  const workshops = useMemo(() => {
    if (!selectedCategory) return workshopServices
    return workshopServices.filter((s) => s.category === selectedCategory)
  }, [workshopServices, selectedCategory])

  const categoryLabel = (cat: string) => t(`services.cat.${cat}`)

  const categoryOptions = useMemo(
    () =>
      WORKSHOP_PAGE_CATEGORIES.map((cat) => ({
        value: cat,
        label: categoryLabel(cat),
      })),
    [t]
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/services"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('nav.services')}
      </Link>

      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('workshops.title')}</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">{t('workshops.subtitle')}</p>
        </div>
        <Link
          href="/services/add"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          {t('services.addService')}
        </Link>
      </div>

      <div className="mb-8 rounded-2xl border border-border bg-card p-4 sm:p-5">
        <p className="mb-3 text-center text-base font-semibold text-foreground">
          {t('filter.category')}
        </p>
        <CategoryTagGrid
          options={categoryOptions}
          value={selectedCategory ?? ''}
          onChange={(value) => setSelectedCategory((value as ServiceCategory) || null)}
        />
      </div>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-bold text-foreground">{t('workshops.mapTitle')}</h2>
        <WorkshopsMapSection services={workshops} />
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-foreground">{t('workshops.listTitle')}</h2>
        {loading ? (
          <p className="text-muted-foreground">{t('car.loading')}</p>
        ) : workshops.length === 0 ? (
          <p className="text-muted-foreground">{t('services.empty')}</p>
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
