'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ChevronRight, MapPin, Phone, Plus, Wrench } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import {
  SERVICE_CATEGORIES,
  SERVICE_CATEGORY_ICONS,
  SERVICE_SUB_SECTIONS,
  type Service,
  type ServiceCategory,
} from '@/types/service'
import { sampleServices } from '@/data/services'
import { loadAllServices } from '@/lib/services-firestore'

export default function ServicesPage() {
  const { t } = useLanguage()
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'all'>('all')
  const [services, setServices] = useState<Service[]>(sampleServices)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAllServices()
      .then(setServices)
      .catch(() => setServices(sampleServices))
      .finally(() => setLoading(false))
  }, [])

  const filteredServices = useMemo(
    () =>
      selectedCategory === 'all'
        ? services
        : services.filter((s) => s.category === selectedCategory),
    [selectedCategory, services]
  )

  const categoryLabel = (cat: ServiceCategory) => t(`services.cat.${cat}`)

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('nav.home')}
        </Link>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t('services.title')}</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">{t('services.subtitle')}</p>
          </div>
          <Link
            href="/services/add"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            {t('services.addService')}
          </Link>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'border border-border bg-card text-foreground hover:bg-secondary'
            }`}
          >
            {t('services.all')}
          </button>
          {SERVICE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
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

        {loading && (
          <p className="mb-4 text-sm text-muted-foreground">{t('car.loading')}</p>
        )}

        {filteredServices.length === 0 ? (
          <div className="mb-12 rounded-xl border border-dashed border-border bg-card px-6 py-12 text-center">
            <p className="text-muted-foreground">{t('services.empty')}</p>
            <Link
              href="/services/add"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              {t('services.addService')}
            </Link>
          </div>
        ) : (
          <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service) => (
              <article
                key={service.id}
                className="rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-lg"
              >
                <div className="mb-3 flex items-start justify-between gap-2">
                  <h3 className="text-lg font-semibold text-foreground">{service.name}</h3>
                  <span className="shrink-0 rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                    {categoryLabel(service.category)}
                  </span>
                </div>

                {service.description && (
                  <p className="mb-4 text-sm text-muted-foreground">{service.description}</p>
                )}

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0" />
                    {service.location}
                  </div>
                  <a
                    href={`tel:${service.phone.replace(/\s/g, '')}`}
                    className="flex items-center gap-2 font-medium text-primary hover:underline"
                  >
                    <Phone className="h-4 w-4 shrink-0" />
                    {service.phone}
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-foreground">{t('services.categories')}</h2>

          {SERVICE_SUB_SECTIONS.map((section) => (
            <div key={section.key} className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${section.colorClass}`}
                >
                  {section.key === 'mechanic' ? (
                    <Wrench className="h-5 w-5" />
                  ) : (
                    <span className="text-lg">{section.icon}</span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  {t(`services.section.${section.key}`)}
                </h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {section.items.map((item) => (
                  <div
                    key={item.nameKey}
                    className="group flex items-center justify-between rounded-lg border border-border bg-background p-4 transition-all hover:border-primary/30"
                  >
                    <div>
                      <h4 className="font-medium text-foreground">{t(item.nameKey)}</h4>
                      <p className="text-sm text-muted-foreground">{t(item.descKey)}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
