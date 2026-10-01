'use client'

import { useMemo } from 'react'
import { Plus } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { ACCESSORY_MARKETPLACE_CHIPS } from '@/types/service'

type MarketplaceServicesCategoriesSectionProps = {
  /** Currently selected accessory chip id, or null */
  value: string | null
  onChange: (accessoryId: string | null, searchLabel: string) => void
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
      ACCESSORY_MARKETPLACE_CHIPS.map((chip) => ({
        id: chip.id,
        label: t(chip.labelKey),
      })),
    [t]
  )

  return (
    <section
      className={`relative z-10 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5 ${className}`}
      aria-label={t('services.section.accessories')}
    >
      <h2 className="mb-3 text-center text-base font-semibold text-foreground sm:text-lg">
        {t('services.section.accessories')}
      </h2>

      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-2">
        {options.map((option) => {
          const selected = value === option.id
          return (
            <button
              key={option.id}
              type="button"
              onClick={() =>
                onChange(selected ? null : option.id, selected ? '' : option.label)
              }
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
