'use client'

import { useEffect, useState, useMemo } from 'react'
import CarCard from '@/components/CarCard'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import FilterBar, { Filters } from '@/components/FilterBar'
import { Car as CarIcon, Loader2, Clock, TrendingUp, ArrowRight } from 'lucide-react'
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
      if (filters.brand && car.brand !== filters.brand) return false
      if (filters.model && car.model !== filters.model) return false
      if (filters.yearFrom && car.year && car.year < parseInt(filters.yearFrom)) return false
      if (filters.yearTo && car.year && car.year > parseInt(filters.yearTo)) return false
      if (filters.priceFrom && car.price && car.price < parseInt(filters.priceFrom)) return false
      if (filters.priceTo && car.price && car.price > parseInt(filters.priceTo)) return false
      if (filters.fuelType && car.fuelType !== filters.fuelType) return false
      if (filters.vehicleType && car.vehicleType !== filters.vehicleType) return false
      
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
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        <HeroSection />

        {/* Filters section */}
        <section className="sticky top-[57px] z-40 border-b border-border bg-background/95 backdrop-blur-lg">
          <div className="mx-auto max-w-7xl px-4 py-4 lg:px-8">
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
          <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8 lg:py-12">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
                  <TrendingUp className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">პოპულარული მანქანები</h2>
                  <p className="text-sm text-muted-foreground">გამორჩეული განცხადებები</p>
                </div>
              </div>
              <Link 
                href="/?filter=popular" 
                className="flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
              >
                ყველა
                <ArrowRight className="h-4 w-4" />
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
        <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8 lg:py-12">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">ახლად დამატებული</h2>
                <p className="text-sm text-muted-foreground">უახლესი განცხადებები</p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full border-4 border-primary/20" />
                  <div className="absolute inset-0 h-12 w-12 animate-spin rounded-full border-4 border-transparent border-t-primary" />
                </div>
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
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card/50 py-20">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
                <CarIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">ავტომობილები არ მოიძებნა</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {Object.values(filters).some(v => v) ? 'სცადეთ სხვა ფილტრები' : 'ჯერ არცერთი განცხადება არ არის'}
              </p>
              <Link
                href="/add-car"
                className="mt-6 flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90"
              >
                დაამატე განცხადება
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <CarIcon className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-bold text-foreground">AUTOMANQANEBI</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                საქართველოს #1 ავტო პლატფორმა
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="mb-3 font-semibold text-foreground">ბმულები</h4>
              <div className="flex flex-col gap-2">
                <Link href="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">მთავარი</Link>
                <Link href="/add-car" className="text-sm text-muted-foreground transition-colors hover:text-foreground">დამატება</Link>
                <Link href="/services" className="text-sm text-muted-foreground transition-colors hover:text-foreground">სერვისები</Link>
                <Link href="/blog" className="text-sm text-muted-foreground transition-colors hover:text-foreground">ბლოგი</Link>
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="mb-3 font-semibold text-foreground">სერვისები</h4>
              <div className="flex flex-col gap-2">
                <Link href="/compare" className="text-sm text-muted-foreground transition-colors hover:text-foreground">შედარება</Link>
                <Link href="/favorites" className="text-sm text-muted-foreground transition-colors hover:text-foreground">რჩეულები</Link>
                <Link href="/profile" className="text-sm text-muted-foreground transition-colors hover:text-foreground">პროფილი</Link>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="mb-3 font-semibold text-foreground">კონტაქტი</h4>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <span>info@automanqanebi.ge</span>
                <span>+995 555 123 456</span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
            <p className="text-sm text-muted-foreground">{"© 2024 AUTOMANQANEBI.GE — ყველა უფლება დაცულია"}</p>
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Facebook</a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
