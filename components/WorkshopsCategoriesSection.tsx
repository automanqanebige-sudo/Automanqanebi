'use client'

import ServiceCategoriesSection from '@/components/ServiceCategoriesSection'
import {
  WORKSHOP_PAGE_CATEGORY_ENTRIES,
  type ServiceCategory,
} from '@/types/service'

type WorkshopsCategoriesSectionProps = {
  value: ServiceCategory | null
  onChange: (category: ServiceCategory | null) => void
  className?: string
}

export default function WorkshopsCategoriesSection(props: WorkshopsCategoriesSectionProps) {
  return (
    <ServiceCategoriesSection
      titleKey="filter.category"
      entries={WORKSHOP_PAGE_CATEGORY_ENTRIES}
      mobileGrid
      allowDeselect
      {...props}
    />
  )
}
