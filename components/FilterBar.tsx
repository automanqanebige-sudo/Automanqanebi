'use client'

import { useState } from 'react'
import { ChevronDown, SlidersHorizontal, Sparkles, Car, Truck, Bike, RotateCcw, Search, Zap } from 'lucide-react'
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

const fuelTypes: { value: FuelType; label: string }[] = [
  { value: 'Gasoline', label: 'ბენზინი' },
  { value: 'Diesel', label: 'დიზელი' },
  { value: 'Hybrid', label: 'ჰიბრიდი' },
  { value: 'Electric', label: 'ელექტრო' },
  { value: 'LPG', label: 'გაზი' },
]

const vehicleCategories = [
  { value: 'car' as VehicleType, label: 'ავტომობილები', icon: Car, count: '137,413' },
  { value: 'moto' as VehicleType, label: 'სპეცტექნიკა', icon: Truck, count: '2,841' },
  { value: 'atv' as VehicleType, label: 'მოტოტექნიკა', icon: Bike, count: '1,205' },
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
    if (key === 'brand') {
      newFilters.model = ''
    }
    onFiltersChange(newFilters)
  }

  const clearFilters = () => {
    onFiltersChange({
      brand: '',
      model: '',
      yearFrom: '',
      yearTo: '',
      priceFrom: '',
      priceTo: '',
      fuelType: '',
      vehicleType: '',
    })
    setAIQuery('')
  }

  const handleAISearch = () => {
    if (aiQuery.trim()) {
      onAISearch(aiQuery)
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl shadow-gray-900/5">
      {/* Tabs */}
      <div className="flex justify-center border-b border-gray-100 bg-gray-50/50 py-5">
        <div className="inline-flex rounded-full bg-white p-1.5 shadow-sm ring-1 ring-gray-200">
          <button
            onClick={() => setActiveTab('filters')}
            className={`flex items-center gap-2.5 rounded-full px-7 py-3 text-sm font-semibold transition-all ${
              activeTab === 'filters'
                ? 'bg-gray-900 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            ფილტრები
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`relative flex items-center gap-2.5 rounded-full px-7 py-3 text-sm font-semibold transition-all ${
              activeTab === 'ai'
                ? 'bg-gradient-to-r from-primary to-orange-500 text-white shadow-lg shadow-primary/25'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Sparkles className={`h-4 w-4 ${activeTab === 'ai' ? 'text-white' : 'text-primary'}`} />
            Myauto AI
            <span className="absolute -right-2 -top-2 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-lg">
              ბეტა
            </span>
          </button>
        </div>
      </div>

      {activeTab === 'filters' ? (
        <div className="p-6">
          {/* Listing type toggle & Clear */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className={`text-sm font-semibold transition-colors ${listingType === 'sell' ? 'text-gray-900' : 'text-gray-400'}`}>
                იყიდება
              </span>
              <button
                onClick={() => setListingType(listingType === 'sell' ? 'rent' : 'sell')}
                className={`relative h-7 w-14 rounded-full transition-all ${
                  listingType === 'rent' ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-md transition-all ${
                    listingType === 'rent' ? 'left-8' : 'left-1'
                  }`}
                />
              </button>
              <span className={`text-sm font-semibold transition-colors ${listingType === 'rent' ? 'text-gray-900' : 'text-gray-400'}`}>
                ქირავდება
              </span>
            </div>
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-700"
            >
              <RotateCcw className="h-4 w-4" />
              გასუფთავება
            </button>
          </div>

          {/* Main content with sidebar */}
          <div className="flex gap-6">
            {/* Left sidebar - Vehicle categories */}
            <div className="w-52 shrink-0 space-y-1">
              {vehicleCategories.map((cat) => {
                const Icon = cat.icon
                const isActive = filters.vehicleType === cat.value || (!filters.vehicleType && cat.value === 'car')
                return (
                  <button
                    key={cat.value}
                    onClick={() => updateFilter('vehicleType', filters.vehicleType === cat.value ? '' : cat.value)}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-primary/10 to-orange-500/10 text-primary shadow-sm ring-1 ring-primary/20'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-gray-400'}`} />
                    <span className="flex-1 text-left">{cat.label}</span>
                    <span className={`text-xs ${isActive ? 'text-primary/70' : 'text-gray-400'}`}>{cat.count}</span>
                  </button>
                )
              })}
            </div>

            {/* Divider */}
            <div className="w-px bg-gray-200" />

            {/* Right side - Filter dropdowns */}
            <div className="flex-1 space-y-4">
              {/* Row 1: Brand, Model, Location */}
              <div className="grid grid-cols-3 gap-4">
                <SelectField
                  value={filters.brand}
                  onChange={(v) => updateFilter('brand', v)}
                  placeholder="მწარმოებელი"
                  options={carBrands.map(b => ({ value: b.brand, label: b.brand }))}
                />
                <SelectField
                  value={filters.model}
                  onChange={(v) => updateFilter('model', v)}
                  placeholder="მოდელი"
                  options={models.map(m => ({ value: m, label: m }))}
                  disabled={!filters.brand}
                />
                <SelectField
                  value=""
                  onChange={() => {}}
                  placeholder="მდებარეობა"
                  options={[
                    { value: 'tbilisi', label: 'თბილისი' },
                    { value: 'batumi', label: 'ბათუმი' },
                    { value: 'kutaisi', label: 'ქუთაისი' },
                  ]}
                />
              </div>

              {/* Row 2: Year, Price, Fuel + Sort buttons */}
              <div className="flex items-center gap-4">
                <div className="grid flex-1 grid-cols-3 gap-4">
                  <SelectField
                    value={filters.yearFrom}
                    onChange={(v) => updateFilter('yearFrom', v)}
                    placeholder="წელი"
                    options={years.map(y => ({ value: y.toString(), label: y.toString() }))}
                  />
                  <SelectField
                    value={filters.priceTo}
                    onChange={(v) => updateFilter('priceTo', v)}
                    placeholder="ფასი"
                    options={[
                      { value: '5000', label: '5,000 ₾-მდე' },
                      { value: '10000', label: '10,000 ₾-მდე' },
                      { value: '20000', label: '20,000 ₾-მდე' },
                      { value: '30000', label: '30,000 ₾-მდე' },
                      { value: '50000', label: '50,000 ₾-მდე' },
                      { value: '100000', label: '100,000 ₾-მდე' },
                    ]}
                  />
                  <SelectField
                    value={filters.fuelType}
                    onChange={(v) => updateFilter('fuelType', v)}
                    placeholder="საწვავი"
                    options={fuelTypes.map(f => ({ value: f.value, label: f.label }))}
                  />
                </div>
                
                {/* Sort buttons */}
                <div className="flex rounded-xl border border-gray-200 bg-white p-1">
                  <button className="rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-900">
                    განაცხადებელი
                  </button>
                  <button className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700">
                    განცხადებული
                  </button>
                </div>
              </div>

              {/* Row 3: Additional filters button + Toggle options */}
              <div className="flex items-center justify-between">
                <button className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50">
                  <SlidersHorizontal className="h-4 w-4 text-gray-500" />
                  დამატებითი ფილტრები
                </button>
                
                <div className="flex items-center gap-6">
                  <ToggleOption label="VIN კოდით" />
                  <ToggleOption label="ფასი შეთანხმებით" />
                  <ToggleOption label="360° ფოტოთი" />
                </div>
              </div>
            </div>
          </div>

          {/* Search button */}
          <div className="mt-6 flex justify-end">
            <button className="flex h-14 items-center gap-3 rounded-full bg-gradient-to-r from-primary to-orange-500 px-12 text-base font-bold text-white shadow-2xl shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5">
              <Search className="h-5 w-5" />
              ძებნა ({carsCount.toLocaleString()})
            </button>
          </div>
        </div>
      ) : (
        /* AI Search Tab */
        <div className="p-10">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-orange-500/20 shadow-lg shadow-primary/10">
              <Zap className="h-10 w-10 text-primary" />
            </div>
            <h3 className="mb-3 text-2xl font-bold text-gray-900">AI ძებნა</h3>
            <p className="mb-8 text-gray-500">
              აღწერე რა მანქანა გინდა ბუნებრივ ენაზე და ხელოვნური ინტელექტი მოძებნის შენთვის საუკეთესო ვარიანტებს
            </p>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Sparkles className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-primary/50" />
                <input
                  type="text"
                  value={aiQuery}
                  onChange={(e) => setAIQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAISearch()}
                  placeholder="მაგ: იაფი ჰიბრიდი 2015 წლიდან, BMW X5 50000₾-მდე..."
                  className="h-14 w-full rounded-full border border-gray-200 bg-white pl-14 pr-6 text-sm text-gray-700 placeholder:text-gray-400 transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                />
              </div>
              <button
                onClick={handleAISearch}
                className="flex h-14 items-center gap-2 rounded-full bg-gradient-to-r from-primary to-orange-500 px-10 text-base font-bold text-white shadow-xl shadow-primary/30 transition-all hover:shadow-2xl hover:shadow-primary/40"
              >
                <Sparkles className="h-5 w-5" />
                ძებნა
              </button>
            </div>
            
            {/* Suggestions */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {['იაფი ჰიბრიდი', 'ოჯახური სედანი', 'სპორტული BMW', 'ელექტრო მანქანა'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setAIQuery(suggestion)}
                  className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 transition-all hover:border-primary hover:text-primary"
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

// Helper components
function SelectField({ value, onChange, placeholder, options, disabled = false }: {
  value: string
  onChange: (value: string) => void
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
        className="h-12 w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 pr-10 text-sm text-gray-700 transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"
      >
        <option value="">{placeholder}</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
    </div>
  )
}

function ToggleOption({ label }: { label: string }) {
  const [checked, setChecked] = useState(false)
  return (
    <label className="flex cursor-pointer items-center gap-2.5">
      <button
        onClick={() => setChecked(!checked)}
        className={`relative h-6 w-11 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-gray-200'}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-all ${checked ? 'left-[22px]' : 'left-0.5'}`} />
      </button>
      <span className="text-sm text-gray-600">{label}</span>
    </label>
  )
}
