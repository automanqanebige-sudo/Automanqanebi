'use client'

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
      <div className="mb-4">
        <h2 className="text-lg font-bold text-foreground">{t('services.adSectionTitle')}</h2>
        <p className="text-xs text-muted-foreground">{t('services.adSectionSubtitle')}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ads.map((ad) => (
          <ServiceCategoryAdCard key={ad.id} ad={ad} categoryLabel={categoryLabel} />
        ))}
      </div>
    </section>
  )
}
