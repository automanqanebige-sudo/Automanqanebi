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

const fuelTypes: { value: FuelType; label: string }[] = [
  { value: 'Gasoline', label: 'ბენზინი' },
  { value: 'Diesel', label: 'დიზელი' },
  { value: 'Hybrid', label: 'ჰიბრიდი' },
  { value: 'Electric', label: 'ელექტრო' },
  { value: 'LPG', label: 'გაზი' },
]

const vehicleCategories = [
  { value: 'car' as VehicleType, label: 'ავტომობილები', icon: Car },
  { value: 'moto' as VehicleType, label: 'სპეცტექნიკა', icon: Truck },
  { value: 'atv' as VehicleType, label: 'მოტოტექნიკა', icon: Bike },
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
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Tabs */}
      <div className="flex justify-center border-b border-gray-100 py-4">
        <div className="inline-flex rounded-full bg-gray-100 p-1">
          <button
            onClick={() => setActiveTab('filters')}
            className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium transition-all ${
              activeTab === 'filters'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            ფილტრები
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`relative flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium transition-all ${
              activeTab === 'ai'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Sparkles className="h-4 w-4 text-primary" />
            Myauto AI
            <span className="absolute -right-1 -top-1 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
              ბეტა
            </span>
          </button>
        </div>
      </div>

      {activeTab === 'filters' ? (
        <div className="p-5">
          {/* Listing type toggle & Clear */}
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className={`text-sm font-medium ${listingType === 'sell' ? 'text-gray-900' : 'text-gray-400'}`}>
                იყიდება
              </span>
              <button
                onClick={() => setListingType(listingType === 'sell' ? 'rent' : 'sell')}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  listingType === 'rent' ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    listingType === 'rent' ? 'left-[22px]' : 'left-0.5'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${listingType === 'rent' ? 'text-gray-900' : 'text-gray-400'}`}>
                ქირავდება
              </span>
            </div>
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-700"
            >
              <RotateCcw className="h-4 w-4" />
              ფილტრების გასუფთავება
            </button>
          </div>

          {/* Main content with sidebar */}
          <div className="flex gap-5">
            {/* Left sidebar - Vehicle categories */}
            <div className="w-48 shrink-0 space-y-1 border-r border-gray-100 pr-5">
              {vehicleCategories.map((cat) => {
                const Icon = cat.icon
                const isActive = filters.vehicleType === cat.value || (!filters.vehicleType && cat.value === 'car')
                return (
                  <button
                    key={cat.value}
                    onClick={() => updateFilter('vehicleType', filters.vehicleType === cat.value ? '' : cat.value)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all ${
                      isActive
                        ? 'border-l-2 border-primary bg-primary/5 text-primary'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {cat.label}
                  </button>
                )
              })}
            </div>

            {/* Right side - Filter dropdowns */}
            <div className="flex-1 space-y-4">
              {/* Row 1: Brand, Model, Location */}
              <div className="grid grid-cols-3 gap-4">
                {/* Brand */}
                <div className="relative">
                  <select
                    value={filters.brand}
                    onChange={(e) => updateFilter('brand', e.target.value)}
                    className="h-12 w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 pr-10 text-sm text-gray-700 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">მწარმოებელი</option>
                    {carBrands.map(brand => (
                      <option key={brand.brand} value={brand.brand}>{brand.brand}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                </div>

                {/* Model */}
                <div className="relative">
                  <select
                    value={filters.model}
                    onChange={(e) => updateFilter('model', e.target.value)}
                    disabled={!filters.brand}
                    className="h-12 w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 pr-10 text-sm text-gray-700 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"
                  >
                    <option value="">მოდელი</option>
                    {models.map(model => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                </div>

                {/* Location */}
                <div className="relative">
                  <select
                    className="h-12 w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 pr-10 text-sm text-gray-700 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">მდებარეობა</option>
                    <option value="tbilisi">თბილისი</option>
                    <option value="batumi">ბათუმი</option>
                    <option value="kutaisi">ქუთაისი</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Row 2: Year, Price, Fuel + Additional filters */}
              <div className="flex items-center gap-4">
                {/* Year */}
                <div className="relative flex-1">
                  <select
                    value={filters.yearFrom}
                    onChange={(e) => updateFilter('yearFrom', e.target.value)}
                    className="h-12 w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 pr-10 text-sm text-gray-700 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">წელი</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                </div>

                {/* Price */}
                <div className="relative flex-1">
                  <select
                    value={filters.priceTo}
                    onChange={(e) => updateFilter('priceTo', e.target.value)}
                    className="h-12 w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 pr-10 text-sm text-gray-700 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">ფასი</option>
                    <option value="5000">5,000 ₾-მდე</option>
                    <option value="10000">10,000 ₾-მდე</option>
                    <option value="20000">20,000 ₾-მდე</option>
                    <option value="30000">30,000 ₾-მდე</option>
                    <option value="50000">50,000 ₾-მდე</option>
                    <option value="100000">100,000 ₾-მდე</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                </div>

                {/* Fuel type */}
                <div className="relative flex-1">
                  <select
                    value={filters.fuelType}
                    onChange={(e) => updateFilter('fuelType', e.target.value)}
                    className="h-12 w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 pr-10 text-sm text-gray-700 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">საწვავი</option>
                    {fuelTypes.map(fuel => (
                      <option key={fuel.value} value={fuel.value}>{fuel.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                </div>

                {/* Additional filters button */}
                <button className="flex h-12 items-center gap-2 rounded-lg border border-gray-200 bg-white px-5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                  <SlidersHorizontal className="h-4 w-4" />
                  დამატებითი ფილტრები
                </button>
              </div>

              {/* Row 3: Toggle options */}
              <div className="flex items-center gap-8">
                <label className="flex cursor-pointer items-center gap-2">
                  <div className="relative h-5 w-9 rounded-full bg-gray-200 transition-colors">
                    <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow" />
                  </div>
                  <span className="text-sm text-gray-600">განცხადებები VIN კოდით</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <div className="relative h-5 w-9 rounded-full bg-gray-200 transition-colors">
                    <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow" />
                  </div>
                  <span className="text-sm text-gray-600">დამალე ფასი შეთანხმებით</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <div className="relative h-5 w-9 rounded-full bg-gray-200 transition-colors">
                    <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow" />
                  </div>
                  <span className="text-sm text-gray-600">{"360° ფოტოთი"}</span>
                </label>
              </div>
            </div>
          </div>

          {/* Search button */}
          <div className="mt-5 flex justify-end">
            <button className="h-12 rounded-full bg-primary px-12 text-base font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/40">
              ძებნა ({carsCount.toLocaleString()})
            </button>
          </div>
        </div>
      ) : (
        /* AI Search Tab */
        <div className="p-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-900">AI ძებნა</h3>
            <p className="mb-6 text-sm text-gray-500">
              აღწერე რა მანქანა გინდა ბუნებრივ ენაზე და AI მოძებნის შენთვის
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                value={aiQuery}
                onChange={(e) => setAIQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAISearch()}
                placeholder="მაგ: იაფი ჰიბრიდი 2015 წლიდან, BMW X5 50000₾-მდე..."
                className="h-14 flex-1 rounded-full border border-gray-200 bg-white px-6 text-sm text-gray-700 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                onClick={handleAISearch}
                className="h-14 rounded-full bg-primary px-10 text-base font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary/90"
              >
                ძებნა
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
