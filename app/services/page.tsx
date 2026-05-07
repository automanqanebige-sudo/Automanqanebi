'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import Navbar from '@/components/Navbar'
import { Phone, MapPin, Wrench, ChevronRight, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { serviceCategories, sampleServices, serviceSubCategories } from '@/data/services'
import type { ServiceCategory } from '@/types/car'
import { serviceCategoryLabels } from '@/types/car'

export default function ServicesPage() {
  const t = useTranslations()
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'all'>('all')

  const filteredServices = selectedCategory === 'all' 
    ? sampleServices 
    : sampleServices.filter(s => s.category === selectedCategory)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        {/* Back link */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('common.backToHome')}
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">{t('services.title')}</h1>
          <p className="mt-2 text-muted-foreground">{t('services.subtitle')}</p>
        </div>

        {/* Category filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border text-card-foreground hover:bg-secondary'
            }`}
          >
            {t('services.all')}
          </button>
          {serviceCategories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                selectedCategory === cat.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-card-foreground hover:bg-secondary'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Services grid */}
        <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-lg"
            >
              <div className="mb-3 flex items-start justify-between">
                <h3 className="text-lg font-semibold text-card-foreground">{service.name}</h3>
                <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                  {serviceCategoryLabels[service.category]}
                </span>
              </div>
              
              {service.description && (
                <p className="mb-4 text-sm text-muted-foreground">{service.description}</p>
              )}

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {service.location}
                </div>
                <a
                  href={`tel:${service.phone}`}
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <Phone className="h-4 w-4" />
                  {service.phone}
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Service categories detail */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-foreground">{t('services.categories')}</h2>

          {/* Mechanic services */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                <Wrench className="h-5 w-5 text-blue-500" />
              </div>
              <h3 className="text-lg font-bold text-foreground">{t('services.mechanic')}</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {serviceSubCategories.mechanic.map((sub, i) => (
                <div
                  key={i}
                  className="group flex cursor-pointer items-center justify-between rounded-lg border border-border bg-background p-4 transition-all hover:border-primary/30"
                >
                  <div>
                    <h4 className="font-medium text-foreground">{sub.name}</h4>
                    <p className="text-sm text-muted-foreground">{sub.description}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                </div>
              ))}
            </div>
          </div>

          {/* Detailing services */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
                <span className="text-lg">✨</span>
              </div>
              <h3 className="text-lg font-bold text-foreground">{t('services.detailing')}</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {serviceSubCategories.detailing.map((sub, i) => (
                <div
                  key={i}
                  className="group flex cursor-pointer items-center justify-between rounded-lg border border-border bg-background p-4 transition-all hover:border-primary/30"
                >
                  <div>
                    <h4 className="font-medium text-foreground">{sub.name}</h4>
                    <p className="text-sm text-muted-foreground">{sub.description}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                </div>
              ))}
            </div>
          </div>

          {/* Electric services */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
                <span className="text-lg">⚡</span>
              </div>
              <h3 className="text-lg font-bold text-foreground">{t('services.electric')}</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {serviceSubCategories.electric.map((sub, i) => (
                <div
                  key={i}
                  className="group flex cursor-pointer items-center justify-between rounded-lg border border-border bg-background p-4 transition-all hover:border-primary/30"
                >
                  <div>
                    <h4 className="font-medium text-foreground">{sub.name}</h4>
                    <p className="text-sm text-muted-foreground">{sub.description}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                </div>
              ))}
            </div>
          </div>

          {/* Other services */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                <span className="text-lg">🛠️</span>
              </div>
              <h3 className="text-lg font-bold text-foreground">{t('services.other')}</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {serviceSubCategories.other.map((sub, i) => (
                <div
                  key={i}
                  className="group flex cursor-pointer items-center justify-between rounded-lg border border-border bg-background p-4 transition-all hover:border-primary/30"
                >
                  <div>
                    <h4 className="font-medium text-foreground">{sub.name}</h4>
                    <p className="text-sm text-muted-foreground">{sub.description}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
