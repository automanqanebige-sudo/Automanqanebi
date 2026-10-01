'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import BrandFilter from '@/components/BrandFilter'
import AdvancedFilterPanel from '@/components/AdvancedFilterPanel'
import RangeFromTo from '@/components/RangeFromTo'
import CurrencyToggle from '@/components/CurrencyToggle'
import { useLanguage } from '@/context/LanguageContext'
import { useCurrency } from '@/context/CurrencyContext'
import { countActiveFilters } from '@/lib/apply-car-filters'
import { PRICE_SLIDER_MAX, type FilterState } from '@/types/filters'

export type { FilterState } from '@/types/filters'
export { initialFilters } from '@/types/filters'

interface SearchFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  onSearch: () => void
  onReset: () => void
  resultCount: number
}

export default function SearchFilters({
  filters,
  onFiltersChange,
  onSearch,
  onReset,
  resultCount,
}: SearchFiltersProps) {
  const { t } = useLanguage()
  const { currency, rate, toBasePrice, fromBasePrice } = useCurrency()
  const [isExpanded, setIsExpanded] = useState(false)
  const currentYear = new Date().getFullYear()

  const activeFilterCount = countActiveFilters(filters)
  const patch = (partial: Partial<FilterState>) => onFiltersChange({ ...filters, ...partial })

  return (
    <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-lg shadow-primary/5">
      <div className="border-b border-border/60 bg-secondary/40 px-4 py-3 sm:px-6">
        <div className="text-sm font-semibold text-foreground">
          {t('search.detailedFilters')}
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <BrandFilter
          selectedBrand={filters.brand}
          selectedModel={filters.model}
          onBrandChange={(brand) => onFiltersChange({ ...filters, brand, model: '' })}
          onModelChange={(model) => onFiltersChange({ ...filters, model })}
        />

        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium text-foreground">
              {t('filter.section.price')} ({currency === 'GEL' ? '₾' : '$'})
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <CurrencyToggle compact />
              <span className="text-xs text-muted-foreground">
                1$ ≈ {rate.toFixed(2)}₾
              </span>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <RangeFromTo
              title={`${t('search.from')} – ${t('search.to')}`}
              fromLabel={t('search.from')}
              toLabel={t('search.to')}
              fromValue={filters.priceMin ? fromBasePrice(filters.priceMin) : ''}
              toValue={filters.priceMax === PRICE_SLIDER_MAX ? '' : fromBasePrice(filters.priceMax)}
              onFromChange={(v) => patch({ priceMin: toBasePrice(Number(v) || 0) })}
              onToChange={(v) =>
                patch({ priceMax: v ? toBasePrice(Number(v)) : PRICE_SLIDER_MAX })
              }
              fromPlaceholder="0"
              toPlaceholder={String(fromBasePrice(PRICE_SLIDER_MAX))}
              min={0}
              step={100}
            />
            <RangeFromTo
              title={t('search.year')}
              fromLabel={t('search.from')}
              toLabel={t('search.to')}
              fromValue={filters.yearMin}
              toValue={filters.yearMax}
              onFromChange={(yearMin) => patch({ yearMin })}
              onToChange={(yearMax) => patch({ yearMax })}
              fromPlaceholder={String(currentYear - 30)}
              toPlaceholder={String(currentYear)}
              min={1980}
              max={currentYear + 1}
            />
            <RangeFromTo
              title={t('search.mileage')}
              fromLabel={t('search.from')}
              toLabel={t('search.to')}
              fromValue={filters.mileageMin}
              toValue={filters.mileageMax}
              onFromChange={(mileageMin) => patch({ mileageMin })}
              onToChange={(mileageMax) => patch({ mileageMax })}
              fromPlaceholder="0"
              toPlaceholder="200000"
              min={0}
              step={1000}
              suffix="km"
              className="sm:col-span-2 lg:col-span-1"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {t('currency.filterAutoConvert').replace('{{rate}}', rate.toFixed(2))}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
          />
          <span>{isExpanded ? t('search.hideMore') : t('search.showMore')}</span>
          {activeFilterCount > 0 && (
            <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-border/60 px-4 pb-6 pt-4 sm:px-6">
            <AdvancedFilterPanel
              filters={filters}
              onChange={onFiltersChange}
              onApply={onSearch}
              onReset={onReset}
              resultCount={resultCount}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
