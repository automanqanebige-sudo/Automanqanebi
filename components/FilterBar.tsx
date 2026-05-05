'use client'

import { useState } from 'react'
import { ChevronDown, X, SlidersHorizontal, Sparkles, Search } from 'lucide-react'
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

const vehicleTypes: { value: VehicleType; label: string }[] = [
  { value: 'car', label: 'მანქანები' },
  { value: 'moto', label: 'მოტო' },
  { value: 'atv', label: 'ATV' },
]

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 35 }, (_, i) => currentYear - i)

export default function FilterBar({ filters, onFiltersChange, onAISearch, carsCount }: FilterBarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [aiQuery, setAIQuery] = useState('')
  const [showAIInput, setShowAIInput] = useState(false)

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

  const hasFilters = Object.values(filters).some(v => v !== '')

  const handleAISearch = () => {
    if (aiQuery.trim()) {
      onAISearch(aiQuery)
      setShowAIInput(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Vehicle type tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => updateFilter('vehicleType', '')}
          className={`shrink-0 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
            filters.vehicleType === '' 
              ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25' 
              : 'bg-card border border-border text-card-foreground hover:bg-secondary'
          }`}
        >
          ყველა
        </button>
        {vehicleTypes.map(type => (
          <button
            key={type.value}
            onClick={() => updateFilter('vehicleType', type.value)}
            className={`shrink-0 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
              filters.vehicleType === type.value 
                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25' 
                : 'bg-card border border-border text-card-foreground hover:bg-secondary'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Main filters row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        {/* Brand select */}
        <div className="relative flex-1 sm:flex-initial sm:min-w-[140px]">
          <select
            value={filters.brand}
            onChange={(e) => updateFilter('brand', e.target.value)}
            className="h-11 w-full appearance-none rounded-lg border border-border bg-card px-4 pr-10 text-sm text-card-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">მარკა</option>
            {carBrands.map(brand => (
              <option key={brand.brand} value={brand.brand}>{brand.brand}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>

        {/* Model select */}
        <div className="relative flex-1 sm:flex-initial sm:min-w-[140px]">
          <select
            value={filters.model}
            onChange={(e) => updateFilter('model', e.target.value)}
            disabled={!filters.brand}
            className="h-11 w-full appearance-none rounded-lg border border-border bg-card px-4 pr-10 text-sm text-card-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">მოდელი</option>
            {models.map(model => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {/* Advanced filters toggle */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex h-11 items-center gap-2 rounded-lg border px-4 text-sm font-medium transition-all ${
              showAdvanced 
                ? 'border-primary bg-primary/10 text-primary' 
                : 'border-border bg-card text-card-foreground hover:bg-secondary'
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">ფილტრები</span>
          </button>

          {/* AI Search toggle */}
          <button
            onClick={() => setShowAIInput(!showAIInput)}
            className={`flex h-11 items-center gap-2 rounded-lg border px-4 text-sm font-medium transition-all ${
              showAIInput 
                ? 'border-primary bg-primary/10 text-primary' 
                : 'border-border bg-card text-card-foreground hover:bg-secondary'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">AI ძებნა</span>
          </button>
        </div>

        {/* Count & Clear */}
        <div className="flex items-center gap-3 sm:ml-auto">
          <span className="rounded-lg bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground">
            {carsCount} განცხადება
          </span>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="h-4 w-4" />
              გასუფთავება
            </button>
          )}
        </div>
      </div>

      {/* AI Search input */}
      {showAIInput && (
        <div className="animate-fade-in-up rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 to-transparent p-4">
          <label className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            აღწერე რა მანქანა გინდა ბუნებრივ ენაზე
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={aiQuery}
                onChange={(e) => setAIQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAISearch()}
                placeholder="მაგ: იაფი ჰიბრიდი 2015 წლიდან, BMW 30000₾-მდე..."
                className="h-11 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button
              onClick={handleAISearch}
              className="h-11 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground shadow-md shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-lg"
            >
              ძებნა
            </button>
          </div>
        </div>
      )}

      {/* Advanced filters panel */}
      {showAdvanced && (
        <div className="animate-fade-in-up rounded-xl border border-border bg-card p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {/* Year range */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-muted-foreground">წელი (დან)</label>
              <select
                value={filters.yearFrom}
                onChange={(e) => updateFilter('yearFrom', e.target.value)}
                className="h-10 w-full appearance-none rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">ნებისმიერი</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-muted-foreground">წელი (მდე)</label>
              <select
                value={filters.yearTo}
                onChange={(e) => updateFilter('yearTo', e.target.value)}
                className="h-10 w-full appearance-none rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">ნებისმიერი</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            {/* Price range */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-muted-foreground">ფასი (დან)</label>
              <input
                type="number"
                value={filters.priceFrom}
                onChange={(e) => updateFilter('priceFrom', e.target.value)}
                placeholder="0 ₾"
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-muted-foreground">ფასი (მდე)</label>
              <input
                type="number"
                value={filters.priceTo}
                onChange={(e) => updateFilter('priceTo', e.target.value)}
                placeholder="100000 ₾"
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Fuel type */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-muted-foreground">საწვავის ტიპი</label>
              <select
                value={filters.fuelType}
                onChange={(e) => updateFilter('fuelType', e.target.value)}
                className="h-10 w-full appearance-none rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">ყველა</option>
                {fuelTypes.map(fuel => (
                  <option key={fuel.value} value={fuel.value}>{fuel.label}</option>
                ))}
              </select>
            </div>

            {/* Apply button */}
            <div className="flex items-end">
              <button
                onClick={() => setShowAdvanced(false)}
                className="h-10 w-full rounded-lg bg-primary text-sm font-medium text-primary-foreground shadow-md shadow-primary/25 transition-all hover:bg-primary/90"
              >
                ფილტრაცია
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
