'use client'

import { Megaphone } from 'lucide-react'
import ServiceCategoryAdCard from '@/components/ServiceCategoryAdCard'
import { useLanguage } from '@/context/LanguageContext'
import type { ServiceCategoryAd } from '@/types/service-category-ad'
import type { ServiceCategory } from '@/types/service'

type ServiceCategoryAdsSectionProps = {
  ads: ServiceCategoryAd[]
  categoryLabel: (cat: ServiceCategory) => string
}

export default function ServiceCategoryAdsSection({
  ads,
  categoryLabel,
}: ServiceCategoryAdsSectionProps) {
  const { t } = useLanguage()

  if (ads.length === 0) return null

  return (
    <section className="mb-8">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
          <Megaphone className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">{t('services.adSectionTitle')}</h2>
          <p className="text-xs text-muted-foreground">{t('services.adSectionSubtitle')}</p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ads.map((ad) => (
          <ServiceCategoryAdCard key={ad.id} ad={ad} categoryLabel={categoryLabel} />
        ))}
      </div>
    </section>
  )
}
