'use client'

import { useState } from 'react'
import { ChevronDown, SlidersHorizontal, Sparkles, Car, Truck, Bike, RotateCcw } from 'lucide-react'
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
}

interface FilterBarProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
  onAISearch: (query: string) => void
  carsCount: number
}

const fuelTypes = [
  { value: 'Gasoline', label: 'ბენზინი' },
  { value: 'Diesel', label: 'დიზელი' },
  { value: 'Hybrid', label: 'ჰიბრიდი' },
  { value: 'Electric', label: 'ელექტრო' },
  { value: 'LPG', label: 'გაზი' },
]

const vehicleCategories = [
  { value: 'car', label: 'ავტომობილები', icon: Car, count: '137,413' },
  { value: 'moto', label: 'სპეცტექნიკა', icon: Truck, count: '2,841' },
  { value: 'atv', label: 'მოტოტექნიკა', icon: Bike, count: '1,205' },
]

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 35 }, (_, i) => currentYear - i)

export default function FilterBar({ filters, onFiltersChange, onAISearch, carsCount }: FilterBarProps) {
  const [activeTab, setActiveTab] = useState<'filters' | 'ai'>('filters')
  const [aiQuery, setAIQuery] = useState('')
  const [listingType, setListingType] = useState<'sell' | 'rent'>('sell')

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
      priceFrom: '', priceTo: '', fuelType: '', vehicleType: '',
    })
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#1e293b]">
      {/* Tabs */}
      <div className="flex justify-center border-b border-white/10 py-4">
        <div className="inline-flex gap-1 rounded-xl bg-slate-800 p-1">
          <button
            onClick={() => setActiveTab('filters')}
            className={`flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-medium transition-all ${
              activeTab === 'filters' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            ფილტრები
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`relative flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-medium transition-all ${
              activeTab === 'ai' ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white' : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            AI ძებნა
            <span className="absolute -right-1 -top-1 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
              NEW
            </span>
          </button>
        </div>
      </div>

      {activeTab === 'filters' ? (
        <div className="p-6">
          {/* Header row */}
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={`text-sm font-medium ${listingType === 'sell' ? 'text-white' : 'text-slate-500'}`}>იყიდება</span>
              <button
                onClick={() => setListingType(listingType === 'sell' ? 'rent' : 'sell')}
                className={`relative h-6 w-12 rounded-full transition-colors ${listingType === 'rent' ? 'bg-orange-500' : 'bg-slate-600'}`}
              >
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${listingType === 'rent' ? 'left-6' : 'left-0.5'}`} />
              </button>
              <span className={`text-sm font-medium ${listingType === 'rent' ? 'text-white' : 'text-slate-500'}`}>ქირავდება</span>
            </div>
            <button onClick={clearFilters} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white">
              <RotateCcw className="h-4 w-4" />
              გასუფთავება
            </button>
          </div>

          {/* Main layout */}
          <div className="flex gap-6">
            {/* Sidebar */}
            <div className="w-48 shrink-0 space-y-1 border-r border-white/10 pr-6">
              {vehicleCategories.map((cat) => {
                const Icon = cat.icon
                const isActive = filters.vehicleType === cat.value || (!filters.vehicleType && cat.value === 'car')
                return (
                  <button
                    key={cat.value}
                    onClick={() => updateFilter('vehicleType', filters.vehicleType === cat.value ? '' : cat.value)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all ${
                      isActive ? 'bg-orange-500/10 text-orange-400 font-medium' : 'text-slate-400 hover:bg-white/5 hover:text-slate-300'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? 'text-orange-500' : 'text-slate-500'}`} />
                    <span className="flex-1 text-left">{cat.label}</span>
                    <span className="text-xs text-slate-500">{cat.count}</span>
                  </button>
                )
              })}
            </div>

            {/* Filter dropdowns */}
            <div className="flex-1 space-y-4">
              {/* Row 1 */}
              <div className="grid grid-cols-3 gap-3">
                <Select value={filters.brand} onChange={(v) => updateFilter('brand', v)} placeholder="მწარმოებელი" options={carBrands.map(b => ({ value: b.brand, label: b.brand }))} />
                <Select value={filters.model} onChange={(v) => updateFilter('model', v)} placeholder="მოდელი" options={models.map(m => ({ value: m, label: m }))} disabled={!filters.brand} />
                <Select value="" onChange={() => {}} placeholder="მდებარეობა" options={[{ value: 'tbilisi', label: 'თბილისი' }, { value: 'batumi', label: 'ბათუმი' }]} />
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-3 gap-3">
                <Select value={filters.yearFrom} onChange={(v) => updateFilter('yearFrom', v)} placeholder="წელი" options={years.map(y => ({ value: String(y), label: String(y) }))} />
                <Select value={filters.priceTo} onChange={(v) => updateFilter('priceTo', v)} placeholder="ფასი" options={[{ value: '10000', label: '10,000-მდე' }, { value: '20000', label: '20,000-მდე' }, { value: '50000', label: '50,000-მდე' }]} />
                <Select value={filters.fuelType} onChange={(v) => updateFilter('fuelType', v)} placeholder="საწვავი" options={fuelTypes.map(f => ({ value: f.value, label: f.label }))} />
              </div>

              {/* Row 3 */}
              <div className="flex items-center justify-between pt-2">
                <button className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-sm text-slate-400 hover:bg-white/5 hover:text-white">
                  <SlidersHorizontal className="h-4 w-4" />
                  მეტი ფილტრი
                </button>
                <div className="flex items-center gap-4">
                  <Toggle label="VIN კოდით" />
                  <Toggle label="360° ფოტო" />
                </div>
              </div>
            </div>
          </div>

          {/* Search button */}
          <div className="mt-6 flex justify-end">
            <button className="rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-10 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:shadow-orange-500/40">
              ძებნა ({carsCount.toLocaleString()})
            </button>
          </div>
        </div>
      ) : (
        /* AI Tab */
        <div className="p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-white">AI ძებნა</h3>
          <p className="mb-6 text-sm text-slate-400">აღწერე რა მანქანა გინდა და AI მოძებნის შენთვის</p>
          <div className="mx-auto flex max-w-lg gap-2">
            <input
              type="text"
              value={aiQuery}
              onChange={(e) => setAIQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onAISearch(aiQuery)}
              placeholder="მაგ: იაფი ჰიბრიდი 2015 წლიდან..."
              className="h-12 flex-1 rounded-xl border border-white/10 bg-slate-800 px-5 text-sm text-white placeholder:text-slate-500 focus:border-orange-500/50 focus:outline-none"
            />
            <button onClick={() => onAISearch(aiQuery)} className="h-12 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 text-sm font-bold text-white hover:from-orange-600 hover:to-orange-700">
              ძებნა
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function Select({ value, onChange, placeholder, options, disabled = false }: {
  value: string; onChange: (v: string) => void; placeholder: string
  options: { value: string; label: string }[]; disabled?: boolean
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="h-11 w-full appearance-none rounded-xl border border-white/10 bg-slate-800 px-3 pr-8 text-sm text-white focus:border-orange-500/50 focus:outline-none disabled:bg-slate-800/50 disabled:text-slate-500"
      >
        <option value="">{placeholder}</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
  )
}

function Toggle({ label }: { label: string }) {
  const [on, setOn] = useState(false)
  return (
    <label className="flex cursor-pointer items-center gap-2">
      <button
        onClick={() => setOn(!on)}
        className={`relative h-5 w-9 rounded-full transition-colors ${on ? 'bg-orange-500' : 'bg-slate-600'}`}
      >
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${on ? 'left-4' : 'left-0.5'}`} />
      </button>
      <span className="text-sm text-slate-400">{label}</span>
    </label>
  )
}
