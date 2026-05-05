'use client'

import { useEffect, useState, useMemo } from 'react'
import CarCard from '@/components/CarCard'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import FilterBar, { Filters } from '@/components/FilterBar'
import { Car as CarIcon, Loader2, Clock, TrendingUp } from 'lucide-react'
import type { Car } from '@/types/car'
import Link from 'next/link'

const emptyFilters: Filters = {
  brand: '',
  model: '',
  yearFrom: '',
  yearTo: '',
  priceFrom: '',
  priceTo: '',
  fuelType: '',
  vehicleType: '',
}

export default function Home() {
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<Filters>(emptyFilters)
  const [aiQuery, setAIQuery] = useState('')

  useEffect(() => {
    setLoading(true)
    fetch('/api/cars')
      .then(res => res.json())
      .then(data => {
        setCars(data || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  // Apply filters to cars
  const filteredCars = useMemo(() => {
    return cars.filter(car => {
      // Brand filter
      if (filters.brand && car.brand !== filters.brand) return false
      
      // Model filter
      if (filters.model && car.model !== filters.model) return false
      
      // Year range
      if (filters.yearFrom && car.year && car.year < parseInt(filters.yearFrom)) return false
      if (filters.yearTo && car.year && car.year > parseInt(filters.yearTo)) return false
      
      // Price range
      if (filters.priceFrom && car.price && car.price < parseInt(filters.priceFrom)) return false
      if (filters.priceTo && car.price && car.price > parseInt(filters.priceTo)) return false
      
      // Fuel type
      if (filters.fuelType && car.fuelType !== filters.fuelType) return false
      
      // Vehicle type
      if (filters.vehicleType && car.vehicleType !== filters.vehicleType) return false
      
      // AI query keywords
      if (aiQuery) {
        const query = aiQuery.toLowerCase()
        const searchText = `${car.brand || ''} ${car.model || ''} ${car.name || ''} ${car.description || ''}`.toLowerCase()
        if (!searchText.includes(query)) return false
      }
      
      return true
    })
  }, [cars, filters, aiQuery])

  // Split cars for different sections
  const popularCars = useMemo(() => {
    return [...filteredCars]
      .filter(car => car.tier === 'platinum' || car.tier === 'gold')
      .slice(0, 6)
  }, [filteredCars])

  const recentCars = useMemo(() => {
    return [...filteredCars]
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime()
        const dateB = new Date(b.createdAt || 0).getTime()
        return dateB - dateA
      })
      .slice(0, 6)
  }, [filteredCars])

  const handleAISearch = async (query: string) => {
    setAIQuery(query)
    
    try {
      const res = await fetch('/api/ai-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      })
      const data = await res.json()
      
      if (data.filters) {
        setFilters(prev => ({
          ...prev,
          brand: data.filters.brand || prev.brand,
          yearFrom: data.filters.yearFrom?.toString() || prev.yearFrom,
          priceTo: data.filters.priceMax?.toString() || prev.priceTo,
          priceFrom: data.filters.priceMin?.toString() || prev.priceFrom,
          fuelType: data.filters.fuelType || prev.fuelType,
        }))
      }
    } catch (error) {
      console.error('AI search error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />

      {/* Filters section */}
      <section className="border-b border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
          <FilterBar 
            filters={filters}
            onFiltersChange={setFilters}
            onAISearch={handleAISearch}
            carsCount={filteredCars.length}
          />
        </div>
      </section>

      {/* Popular cars section */}
      {popularCars.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10">
                <TrendingUp className="h-5 w-5 text-amber-500" />
              </div>
              <h2 className="text-xl font-bold text-foreground">პოპულარული მანქანები</h2>
            </div>
            <Link 
              href="/?filter=popular" 
              className="text-sm font-medium text-primary hover:underline"
            >
              ყველა
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {popularCars.map((car, i) => (
              <CarCard key={car.id || i} car={car} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Recent cars section */}
      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground">ახლად დამატებული</h2>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">იტვირთება...</p>
            </div>
          </div>
        ) : recentCars.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recentCars.map((car, i) => (
              <CarCard key={car.id || i} car={car} index={i} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 py-24">
            <CarIcon className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">ავტომობილები არ მოიძებნა</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {Object.values(filters).some(v => v) ? 'სცადეთ სხვა ფილტრები' : 'ჯერ არცერთი განცხადება არ არის'}
            </p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
            <div className="flex items-center gap-2">
              <span className="font-bold text-foreground">AUTOMANQANEBI.GE</span>
            </div>
            <div className="flex gap-6">
              <Link href="/services" className="transition-colors hover:text-foreground">სერვისები</Link>
              <Link href="/blog" className="transition-colors hover:text-foreground">ბლოგი</Link>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-foreground">Facebook</a>
            </div>
            <p>{"© 2024 All rights reserved"}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
