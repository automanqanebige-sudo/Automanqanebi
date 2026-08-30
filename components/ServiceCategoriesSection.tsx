'use client'

import { useMemo } from 'react'
import { CategoryTagGrid } from '@/components/CategoryTagPicker'
import { useLanguage } from '@/context/LanguageContext'
import type { ServiceCategory } from '@/types/service'

export type ServiceCategoryEntry = {
  category: ServiceCategory
  labelKey?: string
}

type ServiceCategoriesSectionProps = {
  titleKey: string
  entries: ServiceCategoryEntry[]
  value: ServiceCategory | null
  onChange: (category: ServiceCategory | null) => void
  className?: string
  /** Two-column chip grid on mobile */
  mobileGrid?: boolean
  allowDeselect?: boolean
}

export default function ServiceCategoriesSection({
  titleKey,
  entries,
  value,
  onChange,
  className = '',
  mobileGrid = false,
  allowDeselect = false,
}: ServiceCategoriesSectionProps) {
  const { t } = useLanguage()

  const options = useMemo(
    () =>
      entries.map((entry) => ({
        value: entry.category,
        label: t(entry.labelKey ?? `services.cat.${entry.category}`),
      })),
    [entries, t]
  )

  const handleChange = (next: string) => {
    onChange((next as ServiceCategory) || null)
  }

  return (
    <section
      className={`relative z-10 rounded-2xl border border-border bg-card p-4 sm:p-5 ${className}`}
    >
      <h2 className="mb-3 text-center text-base font-semibold text-foreground sm:text-lg">
        {t(titleKey)}
      </h2>

      <CategoryTagGrid
        options={options}
        value={value ?? ''}
        onChange={handleChange}
        allowDeselect={allowDeselect}
        mobileGrid={mobileGrid}
      />
    </section>
  )
}
