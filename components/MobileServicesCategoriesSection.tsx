'use client'

import { CategoryTagGrid } from '@/components/CategoryTagPicker'
import { useLanguage } from '@/context/LanguageContext'
import {
  MOBILE_SERVICE_CATEGORIES,
  type MobileServiceCategoryEntry,
  type ServiceCategory,
} from '@/types/service'

type MobileServicesCategoriesSectionProps = {
  value: ServiceCategory | null
  onChange: (category: ServiceCategory | null) => void
  className?: string
}

export default function MobileServicesCategoriesSection({
  value,
  onChange,
  className = '',
}: MobileServicesCategoriesSectionProps) {
  const { t } = useLanguage()

  const labelFor = (entry: MobileServiceCategoryEntry) =>
    t(entry.labelKey ?? `services.cat.${entry.category}`)

  const options = MOBILE_SERVICE_CATEGORIES.map((entry) => ({
    value: entry.category,
    label: labelFor(entry),
  }))

  return (
    <section className={`rounded-2xl border border-border bg-card p-4 sm:p-5 ${className}`}>
      <h2 className="mb-3 text-center text-base font-semibold text-foreground sm:text-lg">
        {t('services.section.mobile')}
      </h2>
      <CategoryTagGrid
        options={options}
        value={value ?? ''}
        onChange={(next) => onChange((next as ServiceCategory) || null)}
      />
    </section>
  )
}
