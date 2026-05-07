'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Search, ChevronDown, SlidersHorizontal, Sparkles, Car, Truck, Bike, RotateCcw, X } from 'lucide-react'
import { carBrands } from '@/data/cars'
import type { FuelType, VehicleType } from '@/types/car'

export interface Filters {
  brand: string
  model: string
  yearFrom: string
  yearTo: string
  priceFrom: string
  priceTo: string
  fuelType: FuelType | ''
  vehicleType: VehicleType | ''
  transmission: string
}

interface FilterBarProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
  onAISearch: (query: string) => void
  carsCount: number
}

const priceRanges = [
  { value: '5000', label: '5,000' },
  { value: '10000', label: '10,000' },
  { value: '15000', label: '15,000' },
  { value: '20000', label: '20,000' },
  { value: '30000', label: '30,000' },
  { value: '50000', label: '50,000' },
  { value: '100000', label: '100,000' },
]

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 35 }, (_, i) => currentYear - i)

export default function FilterBar({ filters, onFiltersChange, onAISearch, carsCount }: FilterBarProps) {
  const t = useTranslations()
  const [activeTab, setActiveTab] = useState<'filters' | 'ai'>('filters')
  const [aiQuery, setAIQuery] = useState('')
  const [listingType, setListingType] = useState<'sell' | 'rent'>('sell')

  const fuelTypes = [
    { value: 'Gasoline', label: t('filters.petrol') },
    { value: 'Diesel', label: t('filters.diesel') },
    { value: 'Hybrid', label: t('filters.hybrid') },
    { value: 'Electric', label: t('filters.electric') },
    { value: 'LPG', label: t('filters.lpg') },
  ]

  const transmissionTypes = [
    { value: 'automatic', label: t('filters.automatic') },
    { value: 'manual', label: t('filters.manual') },
    { value: 'tiptronic', label: t('filters.tiptronic') },
    { value: 'variator', label: t('filters.variator') },
  ]

  const vehicleCategories = [
    { value: 'car', label: t('filters.cars'), icon: Car, count: '137,413' },
    { value: 'special', label: t('filters.trucks'), icon: Truck, count: '2,841' },
    { value: 'moto', label: t('filters.moto'), icon: Bike, count: '1,205' },
  ]

  const locations = [
    { value: 'tbilisi', label: t('filters.tbilisi') },
    { value: 'batumi', label: t('filters.batumi') },
    { value: 'kutaisi', label: t('filters.kutaisi') },
    { value: 'rustavi', label: t('filters.rustavi') },
  ]

  const selectedBrand = carBrands.find(b => b.brand === filters.brand)
  const models = selectedBrand?.models || []

  const updateFilter = (key: keyof Filters, value: string) => {
    const newFilters = { ...filters, [key]: value }
    if (key === 'brand') newFilters.model = ''
    onFiltersChange(newFilters)
  }

  const clearFilters = () => {
    onFiltersChange({
      brand: '', model: '', yearFrom: '', yearTo: '',
      priceFrom: '', priceTo: '', fuelType: '', vehicleType: '', transmission: '',
    })
  }

  const activeFiltersCount = Object.values(filters).filter(v => v).length

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-sm">
      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <div className="inline-flex gap-1 rounded-xl bg-slate-800/80 p-1">
          <button
            onClick={() => setActiveTab('filters')}
            className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all ${
              activeTab === 'filters' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            {t('filters.title')}
            {activeFiltersCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1.5 text-xs font-bold text-white">
                {activeFiltersCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`relative flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all ${
              activeTab === 'ai' 
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            {t('filters.aiSearch')}
            <span className="rounded bg-emerald-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
              {t('filters.new')}
            </span>
          </button>
        </div>

        {activeFiltersCount > 0 && (
          <button 
            onClick={clearFilters} 
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <RotateCcw className="h-4 w-4" />
            {t('filters.reset')}
          </button>
        )}
      </div>

      {activeTab === 'filters' ? (
        <div className="p-6">
          {/* Listing type toggle */}
          <div className="mb-6 flex items-center gap-4">
            <div className="flex items-center gap-3 rounded-xl bg-slate-800/50 p-1">
              <button
                onClick={() => setListingType('sell')}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  listingType === 'sell' ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white'
                }`}
              >
                {t('filters.buy')}
              </button>
              <button
                onClick={() => setListingType('rent')}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  listingType === 'rent' ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white'
                }`}
              >
                {t('filters.rent')}
              </button>
            </div>
          </div>

          {/* Main layout */}
          <div className="flex gap-8">
            {/* Sidebar - Vehicle Categories */}
            <div className="w-52 shrink-0 space-y-1 border-r border-white/10 pr-6">
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-500">{t('filters.category')}</p>
              {vehicleCategories.map((cat) => {
                const Icon = cat.icon
                const isActive = filters.vehicleType === cat.value || (!filters.vehicleType && cat.value === 'car')
                return (
                  <button
                    key={cat.value}
                    onClick={() => updateFilter('vehicleType', filters.vehicleType === cat.value ? '' : cat.value)}
                    className={`group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all ${
                      isActive 
                        ? 'bg-orange-500/10 text-orange-400' 
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                      isActive ? 'bg-orange-500/20' : 'bg-slate-800 group-hover:bg-slate-700'
                    }`}>
                      <Icon className={`h-4 w-4 ${isActive ? 'text-orange-500' : 'text-slate-500 group-hover:text-slate-300'}`} />
                    </div>
                    <span className={`flex-1 text-left ${isActive ? 'font-medium' : ''}`}>{cat.label}</span>
                    <span className="text-xs text-slate-500">{cat.count}</span>
                  </button>
                )
              })}
            </div>

            {/* Filter Dropdowns */}
            <div className="flex-1 space-y-4">
              {/* Row 1 - Brand, Model, Location */}
              <div className="grid grid-cols-3 gap-4">
                <FilterSelect 
                  value={filters.brand} 
                  onChange={(v) => updateFilter('brand', v)} 
                  placeholder={t('filters.brand')}
                  options={carBrands.map(b => ({ value: b.brand, label: b.brand }))} 
                />
                <FilterSelect 
                  value={filters.model} 
                  onChange={(v) => updateFilter('model', v)} 
                  placeholder={t('filters.model')}
                  options={models.map(m => ({ value: m, label: m }))} 
                  disabled={!filters.brand} 
                />
                <FilterSelect 
                  value="" 
                  onChange={() => {}} 
                  placeholder={t('filters.location')}
                  options={locations} 
                />
              </div>

              {/* Row 2 - Year, Price, Fuel, Transmission */}
              <div className="grid grid-cols-4 gap-4">
                <FilterSelect 
                  value={filters.yearFrom} 
                  onChange={(v) => updateFilter('yearFrom', v)} 
                  placeholder={t('filters.year')}
                  options={years.map(y => ({ value: String(y), label: String(y) }))} 
                />
                <FilterSelect 
                  value={filters.priceTo} 
                  onChange={(v) => updateFilter('priceTo', v)} 
                  placeholder={t('filters.price')}
                  options={priceRanges.map(p => ({ value: p.value, label: `${t('filters.upTo')} ${p.label}` }))} 
                />
                <FilterSelect 
                  value={filters.fuelType} 
                  onChange={(v) => updateFilter('fuelType', v)} 
                  placeholder={t('filters.fuel')}
                  options={fuelTypes} 
                />
                <FilterSelect 
                  value={filters.transmission} 
                  onChange={(v) => updateFilter('transmission', v)} 
                  placeholder={t('filters.transmission')}
                  options={transmissionTypes} 
                />
              </div>

              {/* Row 3 - Toggle options and more filters */}
              <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <div className="flex items-center gap-6">
                  <ToggleSwitch label={t('filters.hasVin')} />
                  <ToggleSwitch label={t('filters.has360')} />
                  <ToggleSwitch label={t('filters.priceNegotiable')} />
                </div>
                <button className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-400 transition-all hover:border-white/20 hover:bg-white/5 hover:text-white">
                  <SlidersHorizontal className="h-4 w-4" />
                  {t('filters.moreFilters')}
                </button>
              </div>
            </div>
          </div>

          {/* Search button */}
          <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-6">
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-400">{t('filters.sortBy')}:</span>
              <div className="flex gap-1 rounded-lg bg-slate-800/50 p-1">
                <button className="rounded-md bg-white px-3 py-1.5 text-xs font-medium text-slate-900">{t('filters.sortByDate')}</button>
                <button className="rounded-md px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white">{t('filters.sortByPrice')}</button>
                <button className="rounded-md px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white">{t('filters.sortByMileage')}</button>
              </div>
            </div>
            <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/30 transition-all hover:shadow-orange-500/50 hover:brightness-110">
              <Search className="h-4 w-4" />
              {t('common.search')} ({carsCount.toLocaleString()})
            </button>
          </div>
        </div>
      ) : (
        /* AI Search Tab */
        <div className="p-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-xl shadow-orange-500/30">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
            <h3 className="mb-2 text-2xl font-bold text-white">{t('aiSearch.title')}</h3>
            <p className="mb-8 text-slate-400">{t('aiSearch.description')}</p>
            
            <div className="relative">
              <div className="flex overflow-hidden rounded-2xl border border-white/10 bg-slate-800/50 shadow-xl">
                <input
                  type="text"
                  value={aiQuery}
                  onChange={(e) => setAIQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && aiQuery && onAISearch(aiQuery)}
                  placeholder={t('aiSearch.placeholder')}
                  className="h-14 flex-1 bg-transparent px-6 text-white placeholder:text-slate-500 focus:outline-none"
                />
                <button 
                  onClick={() => aiQuery && onAISearch(aiQuery)} 
                  disabled={!aiQuery}
                  className="m-2 flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 text-sm font-bold text-white transition-all hover:shadow-lg hover:shadow-orange-500/30 disabled:opacity-50 disabled:shadow-none"
                >
                  <Search className="h-4 w-4" />
                  {t('common.search')}
                </button>
              </div>
            </div>

            {/* AI Suggestions */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {[
                t('aiSearch.suggestions.cheapHybrid'),
                t('aiSearch.suggestions.sedan2020'),
                t('aiSearch.suggestions.electricCar'),
                t('aiSearch.suggestions.familySuv')
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => { setAIQuery(suggestion); onAISearch(suggestion) }}
                  className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-400 transition-all hover:border-orange-500/50 hover:bg-orange-500/10 hover:text-orange-400"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function FilterSelect({ value, onChange, placeholder, options, disabled = false }: {
  value: string
  onChange: (v: string) => void
  placeholder: string
  options: { value: string; label: string }[]
  disabled?: boolean
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`h-12 w-full cursor-pointer appearance-none rounded-xl border bg-slate-800/80 px-4 pr-10 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-orange-500/50 ${
          disabled 
            ? 'border-white/5 text-slate-500' 
            : value 
              ? 'border-orange-500/30 text-white' 
              : 'border-white/10 text-slate-400 hover:border-white/20'
        }`}
      >
        <option value="" className="bg-slate-800 text-slate-400">{placeholder}</option>
        {options.map(o => (
          <option key={o.value} value={o.value} className="bg-slate-800 text-white">{o.label}</option>
        ))}
      </select>
      <ChevronDown className={`pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${value ? 'text-orange-400' : 'text-slate-500'}`} />
      {value && (
        <button 
          onClick={(e) => { e.stopPropagation(); onChange('') }}
          className="absolute right-8 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-slate-500 hover:bg-white/10 hover:text-white"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  )
}

function ToggleSwitch({ label }: { label: string }) {
  const [on, setOn] = useState(false)
  return (
    <label className="flex cursor-pointer items-center gap-2.5">
      <button
        onClick={() => setOn(!on)}
        className={`relative h-6 w-11 rounded-full transition-colors ${on ? 'bg-orange-500' : 'bg-slate-700'}`}
      >
        <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${on ? 'left-6' : 'left-1'}`} />
      </button>
      <span className={`text-sm transition-colors ${on ? 'text-white' : 'text-slate-400'}`}>{label}</span>
    </label>
  )
}
