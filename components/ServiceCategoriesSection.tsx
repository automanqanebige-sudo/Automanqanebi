'use client'

import { useMemo, useState } from 'react'
import {
  CategoryTagGrid,
  CategoryTagPickerField,
  CategoryTagPickerSheet,
} from '@/components/CategoryTagPicker'
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
  /** On small screens open categories in a bottom sheet (better for long lists). */
  mobileSheet?: boolean
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
  mobileSheet = false,
  mobileGrid = false,
  allowDeselect = false,
}: ServiceCategoriesSectionProps) {
  const { t } = useLanguage()
  const [sheetOpen, setSheetOpen] = useState(false)

  const options = useMemo(
    () =>
      entries.map((entry) => ({
        value: entry.category,
        label: t(entry.labelKey ?? `services.cat.${entry.category}`),
      })),
    [entries, t]
  )

  const selectedLabel = value
    ? options.find((option) => option.value === value)?.label ?? ''
    : ''

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

      {mobileSheet ? (
        <>
          <div className="md:hidden">
            <CategoryTagPickerField
              label={t(titleKey)}
              placeholder={t('picker.chooseCategory')}
              selectedLabel={selectedLabel}
              onOpen={() => setSheetOpen(true)}
            />
            <CategoryTagPickerSheet
              open={sheetOpen}
              onClose={() => setSheetOpen(false)}
              title={t(titleKey)}
              options={options}
              value={value ?? ''}
              onConfirm={handleChange}
            />
          </div>
          <div className="hidden md:block">
            <CategoryTagGrid
              options={options}
              value={value ?? ''}
              onChange={handleChange}
              allowDeselect={allowDeselect}
              mobileGrid={mobileGrid}
            />
          </div>
        </>
      ) : (
        <CategoryTagGrid
          options={options}
          value={value ?? ''}
          onChange={handleChange}
          allowDeselect={allowDeselect}
          mobileGrid={mobileGrid}
        />
      )}
    </section>
  )
}
