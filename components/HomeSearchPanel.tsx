'use client'

import { useMemo, useState } from 'react'
import { ChevronDown, RotateCcw, Search } from 'lucide-react'
import { carBrands } from '@/data/car-brands'
import AdvancedFilterPanel from '@/components/AdvancedFilterPanel'
import SearchInputWithSuggestions from '@/components/SearchInputWithSuggestions'
import TypeaheadInput from '@/components/TypeaheadInput'
import VehicleGroupTabs from '@/components/VehicleGroupTabs'
import {
  CategoryTagGrid,
  CategoryTagPickerField,
  CategoryTagPickerSheet,
} from '@/components/CategoryTagPicker'
import { useLanguage } from '@/context/LanguageContext'
import { countActiveFilters } from '@/lib/apply-car-filters'
import {
  subcategoriesForGroup,
  subcategoryLabelKey,
  type VehicleGroup,
} from '@/lib/vehicle-categories'
import { OFFER_TYPES, type FilterState, type OfferType } from '@/types/filters'

type HomeSearchPanelProps = {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  onSearch: () => void
  onReset: () => void
  resultCount: number
}

const FUEL_OPTIONS = [
  { value: '', labelKey: 'search.allFuel' },
  { value: 'petrol', labelKey: 'fuel.Petrol' },
  { value: 'petrol_lpg', labelKey: 'fuel.Petrol_LPG' },
  { value: 'diesel', labelKey: 'fuel.Diesel' },
  { value: 'hybrid', labelKey: 'fuel.Hybrid' },
  { value: 'electric', labelKey: 'fuel.Electric' },
  { value: 'lpg', labelKey: 'fuel.LPG' },
] as const

const selectClass =
  'w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20'

export default function HomeSearchPanel({
  filters,
  onFiltersChange,
  onSearch,
  onReset,
  resultCount,
}: HomeSearchPanelProps) {
  const { t } = useLanguage()
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [categorySheetOpen, setCategorySheetOpen] = useState(false)

  const vehicleGroup = (filters.vehicleGroup || 'automobile') as VehicleGroup

  const patch = (partial: Partial<FilterState>) => onFiltersChange({ ...filters, ...partial })
  const activeFilterCount = countActiveFilters(filters)

  const sortedBrands = useMemo(
    () => [...carBrands].map((b) => b.brand).sort((a, b) => a.localeCompare(b)),
    []
  )
  const models = carBrands.find((b) => b.brand === filters.brand)?.models ?? []

  const subcategoryOptions = useMemo(
    () =>
      subcategoriesForGroup(vehicleGroup).map((sub) => ({
        value: sub,
        label: t(subcategoryLabelKey(vehicleGroup, sub)),
      })),
    [vehicleGroup, t]
  )

  const selectedSubLabel = filters.bodyType
    ? t(subcategoryLabelKey(vehicleGroup, filters.bodyType))
    : ''

  const searchSuggestions = useMemo(() => {
    const q = filters.search.trim().toLowerCase()
    if (q.length < 1) return []
    const brandHits = sortedBrands.filter((b) => b.toLowerCase().includes(q)).slice(0, 4)
    const modelHits: string[] = []
    for (const b of carBrands) {
      for (const m of b.models) {
        const label = `${b.brand} ${m}`
        if (label.toLowerCase().includes(q) || m.toLowerCase().includes(q)) {
          modelHits.push(label)
        }
        if (modelHits.length >= 6) break
      }
      if (modelHits.length >= 6) break
    }
    return [...new Set([...brandHits, ...modelHits])].slice(0, 8)
  }, [filters.search, sortedBrands])

  const selectVehicleGroup = (group: VehicleGroup) => {
    onFiltersChange({
      ...filters,
      vehicleGroup: group,
      bodyType: '',
      category: '',
    })
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches) {
      setCategorySheetOpen(true)
    }
  }

  const applySearchSuggestion = (value: string) => {
    const trimmed = value.trim()
    const parts = trimmed.split(/\s+/)
    if (parts.length >= 2) {
      const brand = sortedBrands.find((b) => b.toLowerCase() === parts[0].toLowerCase())
      if (brand) {
        onFiltersChange({
          ...filters,
          search: trimmed,
          brand,
          model: parts.slice(1).join(' '),
        })
        return
      }
    }
    const brand = sortedBrands.find((b) => b.toLowerCase() === trimmed.toLowerCase())
    if (brand) {
      onFiltersChange({ ...filters, search: trimmed, brand, model: '' })
    }
  }

  return (
    <section id="search" className="bg-white px-4 pb-6 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-6">
            <div
              className="inline-flex rounded-full border border-border bg-secondary/40 p-0.5"
              role="group"
              aria-label={t('filter.section.offerType')}
            >
              {OFFER_TYPES.map((type) => {
                const active = filters.offerType === type
                return (
                  <button
                    key={type || 'all'}
                    type="button"
                    onClick={() => patch({ offerType: type as OfferType })}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                      active
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {type ? t(`filter.offer.${type}`) : t('filter.all')}
                  </button>
                )
              })}
            </div>

            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <RotateCcw className="h-4 w-4" />
              {t('home.searchTab.clear')}
            </button>
          </div>

          <div className="border-b border-border p-4 sm:p-6">
            <SearchInputWithSuggestions
              value={filters.search}
              onChange={(search) => patch({ search })}
              onSubmit={(q) => {
                if (q) applySearchSuggestion(q)
                onSearch()
              }}
              placeholder={t('search.placeholder')}
              suggestions={searchSuggestions}
              inputClassName={`${selectClass} py-3.5 pl-12 pr-11 text-base`}
            />
          </div>

          <VehicleGroupTabs value={vehicleGroup} onChange={selectVehicleGroup} />

          <div className="p-4 sm:p-6">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <TypeaheadInput
                label={t('search.selectBrand')}
                value={filters.brand}
                onChange={(brand) => patch({ brand, model: '' })}
                onSelect={(brand) => patch({ brand, model: '' })}
                options={sortedBrands}
                placeholder={t('search.typeBrand')}
                emptyLabel={t('search.noResults')}
              />

              <TypeaheadInput
                label={t('search.model')}
                value={filters.model}
                onChange={(model) => patch({ model })}
                onSelect={(model) => patch({ model })}
                options={models}
                placeholder={t('search.typeModel')}
                disabled={!filters.brand}
                emptyLabel={t('search.noResults')}
              />

              <div className="block md:hidden">
                <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  {t('filter.category')}
                </span>
                <CategoryTagPickerField
                  label={t('filter.category')}
                  placeholder={t('picker.chooseCategory')}
                  selectedLabel={selectedSubLabel}
                  onOpen={() => setCategorySheetOpen(true)}
                />
              </div>

              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  {t('search.fuelType')}
                </span>
                <select
                  value={filters.fuelType}
                  onChange={(e) => patch({ fuelType: e.target.value })}
                  className={selectClass}
                >
                  <option value="">{t('search.allFuel')}</option>
                  {FUEL_OPTIONS.filter((f) => f.value).map((fuel) => (
                    <option key={fuel.value} value={fuel.value}>
                      {t(fuel.labelKey)}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-4 hidden md:block">
              <p className="mb-2 text-xs font-medium text-muted-foreground">{t('filter.category')}</p>
              <CategoryTagGrid
                options={subcategoryOptions}
                value={filters.bodyType}
                onChange={(bodyType) => patch({ bodyType })}
              />
            </div>

            <CategoryTagPickerSheet
              open={categorySheetOpen}
              onClose={() => setCategorySheetOpen(false)}
              title={t('filter.category')}
              options={subcategoryOptions}
              value={filters.bodyType}
              onConfirm={(bodyType) => patch({ bodyType })}
            />

            <div className="mt-5 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => setAdvancedOpen(!advancedOpen)}
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${advancedOpen ? 'rotate-180' : ''}`}
                />
                {t('home.searchTab.moreFilters')}
                {activeFilterCount > 0 && (
                  <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={onSearch}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto"
              >
                <Search className="h-5 w-5" />
                {t('search.button')} ({resultCount})
              </button>
            </div>
          </div>

          {advancedOpen && (
            <div className="border-t border-border px-4 pb-6 pt-4 sm:px-6">
              <AdvancedFilterPanel
                filters={filters}
                onChange={onFiltersChange}
                onApply={onSearch}
                onReset={onReset}
                resultCount={resultCount}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
