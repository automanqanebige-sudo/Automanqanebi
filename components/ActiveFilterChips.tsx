'use client'

import { X } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useCurrency } from '@/context/CurrencyContext'
import { initialFilters, PRICE_SLIDER_MAX, type FilterState } from '@/types/filters'

type ActiveFilterChipsProps = {
  filters: FilterState
  onChange: (filters: FilterState) => void
  onClearAll: () => void
}

type Chip = { key: string; label: string; clear: () => void }

export default function ActiveFilterChips({ filters, onChange, onClearAll }: ActiveFilterChipsProps) {
  const { t } = useLanguage()
  const { formatPrice, fromBasePrice } = useCurrency()

  const patch = (partial: Partial<FilterState>) => onChange({ ...filters, ...partial })

  const chips: Chip[] = []

  if (filters.search.trim()) {
    chips.push({
      key: 'search',
      label: `"${filters.search.trim()}"`,
      clear: () => patch({ search: '' }),
    })
  }
  if (filters.brand) {
    chips.push({
      key: 'brand',
      label: filters.brand,
      clear: () => patch({ brand: '', model: '' }),
    })
  }
  if (filters.model) {
    chips.push({
      key: 'model',
      label: filters.model,
      clear: () => patch({ model: '' }),
    })
  }
  if (filters.fuelType) {
    const label = t(`fuel.${filters.fuelType}`)
    chips.push({
      key: 'fuel',
      label: label !== `fuel.${filters.fuelType}` ? label : filters.fuelType,
      clear: () => patch({ fuelType: '' }),
    })
  }
  if (filters.bodyType) {
    chips.push({
      key: 'body',
      label: filters.bodyType,
      clear: () => patch({ bodyType: '' }),
    })
  }
  if (filters.priceMin > 0 || filters.priceMax < PRICE_SLIDER_MAX) {
    const min = filters.priceMin > 0 ? formatPrice(filters.priceMin) : '0'
    const max =
      filters.priceMax < PRICE_SLIDER_MAX ? formatPrice(filters.priceMax) : `${fromBasePrice(PRICE_SLIDER_MAX)}+`
    chips.push({
      key: 'price',
      label: `${min} – ${max}`,
      clear: () => patch({ priceMin: 0, priceMax: PRICE_SLIDER_MAX }),
    })
  }
  if (filters.yearMin || filters.yearMax) {
    chips.push({
      key: 'year',
      label: `${filters.yearMin || '…'} – ${filters.yearMax || '…'}`,
      clear: () => patch({ yearMin: '', yearMax: '' }),
    })
  }
  if (filters.mileageMin || filters.mileageMax) {
    chips.push({
      key: 'mileage',
      label: `${filters.mileageMin || '0'} – ${filters.mileageMax || '∞'} km`,
      clear: () => patch({ mileageMin: '', mileageMax: '' }),
    })
  }
  if (filters.offerType) {
    chips.push({
      key: 'offer',
      label: t(`filter.offer.${filters.offerType}`),
      clear: () => patch({ offerType: '' }),
    })
  }
  if (filters.transmission) {
    chips.push({
      key: 'transmission',
      label: filters.transmission,
      clear: () => patch({ transmission: '' }),
    })
  }
  if (filters.color) {
    const label = t(`filter.color.${filters.color}`)
    chips.push({
      key: 'color',
      label: label !== `filter.color.${filters.color}` ? label : filters.color,
      clear: () => patch({ color: '' }),
    })
  }
  if (filters.features.length) {
    chips.push({
      key: 'features',
      label: `${filters.features.length} ${t('filter.section.features')}`,
      clear: () => patch({ features: [] }),
    })
  }

  if (chips.length === 0) return null

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={chip.clear}
          className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/15"
        >
          <span className="truncate">{chip.label}</span>
          <X className="h-3 w-3 shrink-0" aria-hidden />
          <span className="sr-only">{t('filter.clear')}</span>
        </button>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="text-xs font-medium text-muted-foreground underline-offset-2 transition-colors hover:text-foreground hover:underline"
      >
        {t('home.searchTab.clear')}
      </button>
    </div>
  )
}

export { initialFilters }
