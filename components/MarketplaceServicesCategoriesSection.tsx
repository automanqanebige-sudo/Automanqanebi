'use client'

import { useMemo } from 'react'
import { Plus } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { SERVICE_CATEGORIES, type ServiceCategory } from '@/types/service'

type MarketplaceServicesCategoriesSectionProps = {
  value: ServiceCategory | null
  onChange: (category: ServiceCategory | null) => void
  className?: string
}

export default function MarketplaceServicesCategoriesSection({
  value,
  onChange,
  className = '',
}: MarketplaceServicesCategoriesSectionProps) {
  const { t } = useLanguage()

  const options = useMemo(
    () =>
      SERVICE_CATEGORIES.map((category) => ({
        value: category,
        label: t(`services.cat.${category}`),
      })),
    [t]
  )

  return (
    <section
      className={`relative z-10 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5 ${className}`}
      aria-label={t('services.section.list')}
    >
      <h2 className="mb-3 text-center text-base font-semibold text-foreground sm:text-lg">
        {t('services.section.list')}
      </h2>

      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-2">
        {options.map((option) => {
          const selected = value === option.value
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(selected ? null : option.value)}
              className={`flex min-h-[44px] w-full items-center gap-1.5 rounded-lg border px-2.5 py-2.5 text-left text-xs font-medium shadow-sm transition-colors sm:inline-flex sm:min-h-0 sm:w-auto sm:px-3 sm:text-sm ${
                selected
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card text-foreground hover:border-primary/40 hover:bg-primary/5'
              }`}
            >
              <Plus
                className={`h-3.5 w-3.5 shrink-0 ${selected ? 'text-primary-foreground' : 'text-muted-foreground'}`}
                strokeWidth={2.5}
              />
              <span className="min-w-0 flex-1 leading-snug">{option.label}</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
