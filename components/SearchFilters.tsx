'use client'

import { useState } from 'react'
import { Search, ChevronDown, X, RotateCcw } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

export interface FilterState {
  search: string
  priceMin: string
  priceMax: string
  yearMin: string
  yearMax: string
  fuelType: string
  transmission: string
}

interface SearchFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  onSearch: () => void
  onReset: () => void
}

const priceValues = ['', '5000', '10000', '15000', '20000', '30000', '50000', '75000', '100000']

const currentYear = new Date().getFullYear()

interface SelectDropdownProps {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
  className?: string
}

function SelectDropdown({ label, value, options, onChange, className = '' }: SelectDropdownProps) {
  return (
    <div className={`relative ${className}`}>
      {label ? (
        <label className="block text-xs font-medium text-muted-foreground mb-1.5">{label}</label>
      ) : null}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none px-4 py-2.5 pr-10 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all cursor-pointer hover:border-primary/50"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      </div>
    </div>
  )
}

export default function SearchFilters({ filters, onFiltersChange, onSearch, onReset }: SearchFiltersProps) {
  const { t } = useLanguage()
  const [isExpanded, setIsExpanded] = useState(false)

  const updateFilter = (key: keyof FilterState, value: string) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const priceOptions = priceValues.map((value) => ({
    value,
    label: value ? `$${Number(value).toLocaleString()}` : t('search.any'),
  }))

  const yearOptions = [
    { value: '', label: t('search.any') },
    ...Array.from({ length: 30 }, (_, i) => ({
      value: String(currentYear - i),
      label: String(currentYear - i),
    })),
  ]

  const fuelTypeOptions = [
    { value: '', label: t('search.allFuel') },
    { value: 'petrol', label: t('fuel.Petrol') },
    { value: 'diesel', label: t('fuel.Diesel') },
    { value: 'hybrid', label: t('fuel.Hybrid') },
    { value: 'electric', label: t('fuel.Electric') },
    { value: 'lpg', label: t('fuel.LPG') },
  ]

  const transmissionOptions = [
    { value: '', label: t('search.allTransmission') },
    { value: 'automatic', label: t('transmission.Automatic') },
    { value: 'manual', label: t('transmission.Manual') },
    { value: 'semi-automatic', label: t('transmission.Semi-Automatic') },
  ]

  const hasActiveFilters =
    filters.priceMin ||
    filters.priceMax ||
    filters.yearMin ||
    filters.yearMax ||
    filters.fuelType ||
    filters.transmission

  const activeFilterCount = [
    filters.priceMin || filters.priceMax,
    filters.yearMin || filters.yearMax,
    filters.fuelType,
    filters.transmission,
  ].filter(Boolean).length

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder={t('search.placeholder')}
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              onKeyDown={(e) => e.key === 'Enter' && onSearch()}
            />
            {filters.search && (
              <button
                onClick={() => updateFilter('search', '')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-secondary transition-colors"
                aria-label={t('search.reset')}
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>

          <div className="hidden lg:flex items-end gap-3">
            <SelectDropdown
              label={t('search.priceRange')}
              value={filters.priceMin}
              options={priceOptions.map((o) => ({
                ...o,
                label: o.value ? `${t('search.from')} ${o.label}` : t('search.minPrice'),
              }))}
              onChange={(value) => updateFilter('priceMin', value)}
              className="w-36"
            />
            <span className="text-muted-foreground pb-3">-</span>
            <SelectDropdown
              label=""
              value={filters.priceMax}
              options={priceOptions.map((o) => ({
                ...o,
                label: o.value ? `${t('search.to')} ${o.label}` : t('search.maxPrice'),
              }))}
              onChange={(value) => updateFilter('priceMax', value)}
              className="w-36 mt-5"
            />
          </div>

          <button
            onClick={onSearch}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98]"
          >
            <Search className="h-5 w-5" />
            <span>{t('search.button')}</span>
          </button>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
          <span>{isExpanded ? t('search.hideMore') : t('search.showMore')}</span>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs font-medium rounded-full">
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
          <div className="px-4 sm:px-6 pb-6 pt-2 border-t border-border">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              <div className="lg:hidden sm:col-span-2">
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  {t('search.priceRange')}
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={filters.priceMin}
                    onChange={(e) => updateFilter('priceMin', e.target.value)}
                    className="flex-1 appearance-none px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  >
                    {priceOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.value ? `${t('search.from')} ${option.label}` : t('search.minPrice')}
                      </option>
                    ))}
                  </select>
                  <span className="text-muted-foreground">-</span>
                  <select
                    value={filters.priceMax}
                    onChange={(e) => updateFilter('priceMax', e.target.value)}
                    className="flex-1 appearance-none px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  >
                    {priceOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.value ? `${t('search.to')} ${option.label}` : t('search.maxPrice')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  {t('search.year')}
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={filters.yearMin}
                    onChange={(e) => updateFilter('yearMin', e.target.value)}
                    className="flex-1 appearance-none px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  >
                    {yearOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.value ? `${t('search.from')} ${option.label}` : t('search.minYear')}
                      </option>
                    ))}
                  </select>
                  <span className="text-muted-foreground">-</span>
                  <select
                    value={filters.yearMax}
                    onChange={(e) => updateFilter('yearMax', e.target.value)}
                    className="flex-1 appearance-none px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  >
                    {yearOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.value ? `${t('search.to')} ${option.label}` : t('search.maxYear')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <SelectDropdown
                label={t('search.fuelType')}
                value={filters.fuelType}
                options={fuelTypeOptions}
                onChange={(value) => updateFilter('fuelType', value)}
              />

              <SelectDropdown
                label={t('search.transmission')}
                value={filters.transmission}
                options={transmissionOptions}
                onChange={(value) => updateFilter('transmission', value)}
              />

              <div className="flex items-end">
                <button
                  onClick={onReset}
                  disabled={!hasActiveFilters && !filters.search}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 w-full rounded-lg border border-input bg-background text-foreground text-sm font-medium hover:bg-secondary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>{t('search.reset')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
