'use client'

import { useState } from 'react'
import { ChevronDown, X, SlidersHorizontal, Sparkles } from 'lucide-react'
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
      <div className="flex items-center gap-2">
        <button
          onClick={() => updateFilter('vehicleType', '')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            filters.vehicleType === '' 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
        >
          ყველა
        </button>
        {vehicleTypes.map(type => (
          <button
            key={type.value}
            onClick={() => updateFilter('vehicleType', type.value)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              filters.vehicleType === type.value 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Main filters row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Brand select */}
        <div className="relative">
          <select
            value={filters.brand}
            onChange={(e) => updateFilter('brand', e.target.value)}
            className="h-10 appearance-none rounded-lg border border-input bg-card pl-3 pr-9 text-sm text-card-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">მარკა</option>
            {carBrands.map(brand => (
              <option key={brand.brand} value={brand.brand}>{brand.brand}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>

        {/* Model select */}
        <div className="relative">
          <select
            value={filters.model}
            onChange={(e) => updateFilter('model', e.target.value)}
            disabled={!filters.brand}
            className="h-10 appearance-none rounded-lg border border-input bg-card pl-3 pr-9 text-sm text-card-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">მოდელი</option>
            {models.map(model => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>

        {/* Advanced filters toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`flex h-10 items-center gap-2 rounded-lg border px-4 text-sm font-medium transition-colors ${
            showAdvanced 
              ? 'border-primary bg-primary/10 text-primary' 
              : 'border-input bg-card text-card-foreground hover:bg-secondary'
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          გაფართოებული ფილტრები
        </button>

        {/* AI Search toggle */}
        <button
          onClick={() => setShowAIInput(!showAIInput)}
          className={`flex h-10 items-center gap-2 rounded-lg border px-4 text-sm font-medium transition-colors ${
            showAIInput 
              ? 'border-primary bg-primary/10 text-primary' 
              : 'border-input bg-card text-card-foreground hover:bg-secondary'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          AI ძებნა
        </button>

        {/* Count & Clear */}
        <div className="ml-auto flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {carsCount} განცხადება
          </span>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
              გასუფთავება
            </button>
          )}
        </div>
      </div>

      {/* AI Search input */}
      {showAIInput && (
        <div className="animate-fade-in-up rounded-xl border border-primary/30 bg-card p-4">
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            აღწერე რა მანქანა გინდა
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={aiQuery}
              onChange={(e) => setAIQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAISearch()}
              placeholder="მაგ: იაფი ჰიბრიდი 2015 წლიდან, BMW 30000₾-მდე..."
              className="flex-1 rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              onClick={handleAISearch}
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              ძებნა
            </button>
          </div>
        </div>
      )}

      {/* Advanced filters panel */}
      {showAdvanced && (
        <div className="animate-fade-in-up grid grid-cols-2 gap-4 rounded-xl border border-border bg-card p-4 sm:grid-cols-3 lg:grid-cols-6">
          {/* Year range */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">წელი (დან)</label>
            <select
              value={filters.yearFrom}
              onChange={(e) => updateFilter('yearFrom', e.target.value)}
              className="h-9 w-full appearance-none rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none"
            >
              <option value="">ნებისმიერი</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">წელი (მდე)</label>
            <select
              value={filters.yearTo}
              onChange={(e) => updateFilter('yearTo', e.target.value)}
              className="h-9 w-full appearance-none rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none"
            >
              <option value="">ნებისმიერი</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Price range */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">ფასი (დან)</label>
            <input
              type="number"
              value={filters.priceFrom}
              onChange={(e) => updateFilter('priceFrom', e.target.value)}
              placeholder="0 ₾"
              className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">ფასი (მდე)</label>
            <input
              type="number"
              value={filters.priceTo}
              onChange={(e) => updateFilter('priceTo', e.target.value)}
              placeholder="100000 ₾"
              className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none"
            />
          </div>

          {/* Fuel type */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">საწვავის ტიპი</label>
            <select
              value={filters.fuelType}
              onChange={(e) => updateFilter('fuelType', e.target.value)}
              className="h-9 w-full appearance-none rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none"
            >
              <option value="">ყველა</option>
              {fuelTypes.map(fuel => (
                <option key={fuel.value} value={fuel.value}>{fuel.label}</option>
              ))}
            </select>
          </div>

          {/* Apply button (mobile) */}
          <div className="flex items-end">
            <button
              onClick={() => setShowAdvanced(false)}
              className="h-9 w-full rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              ფილტრაცია
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
