'use client'

import ServiceCategoriesSection from '@/components/ServiceCategoriesSection'
import { SERVICE_CATEGORIES, type ServiceCategory } from '@/types/service'

type MarketplaceServicesCategoriesSectionProps = {
  value: ServiceCategory | null
  onChange: (category: ServiceCategory | null) => void
  className?: string
}

export default function MarketplaceServicesCategoriesSection(
  props: MarketplaceServicesCategoriesSectionProps
) {
  const entries = SERVICE_CATEGORIES.map((category) => ({ category }))

  return (
    <ServiceCategoriesSection
      titleKey="services.section.list"
      entries={entries}
      {...props}
    />
  )
}
