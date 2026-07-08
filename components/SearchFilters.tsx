'use client'

import { useState } from 'react'
import { Search, ChevronDown, X, SlidersHorizontal } from 'lucide-react'
import BrandFilter from '@/components/BrandFilter'
import AdvancedFilterPanel from '@/components/AdvancedFilterPanel'
import { useLanguage } from '@/context/LanguageContext'
import { countActiveFilters } from '@/lib/apply-car-filters'
import type { FilterState } from '@/types/filters'

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
  const [isExpanded, setIsExpanded] = useState(true)

  const activeFilterCount = countActiveFilters(filters)

  return (
    <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-lg shadow-primary/5">
      <div className="border-b border-border/60 bg-gradient-to-r from-primary/8 via-card to-primary/5 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          {t('search.detailedFilters')}
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder={t('search.placeholder')}
              value={filters.search}
              onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
              className="w-full rounded-xl border border-input bg-background py-3 pl-12 pr-4 text-foreground placeholder:text-muted-foreground transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
              onKeyDown={(e) => e.key === 'Enter' && onSearch()}
            />
            {filters.search && (
              <button
                onClick={() => onFiltersChange({ ...filters, search: '' })}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 transition-colors hover:bg-secondary"
                aria-label={t('search.reset')}
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>

          <button
            onClick={onSearch}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3 font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98]"
          >
            <Search className="h-5 w-5" />
            <span>{t('search.button')}</span>
          </button>
        </div>

        <div className="mt-5">
          <BrandFilter
            selectedBrand={filters.brand}
            selectedModel={filters.model}
            onBrandChange={(brand) => onFiltersChange({ ...filters, brand, model: '' })}
            onModelChange={(model) => onFiltersChange({ ...filters, model })}
          />
        </div>

        <button
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
