'use client'

import { useEffect, useState, useMemo } from 'react'
import CarCard from '@/components/CarCard'
import Navbar from '@/components/Navbar'
import FilterBar, { Filters } from '@/components/FilterBar'
import { Car as CarIcon, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
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

  // Split cars by tier
  const vipCars = useMemo(() => {
    return filteredCars.filter(car => car.tier === 'platinum' || car.tier === 'gold')
  }, [filteredCars])

  const regularCars = useMemo(() => {
    return filteredCars.filter(car => !car.tier || car.tier === 'standard' || car.tier === 'silver')
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main>
        {/* Filters section */}
        <section className="mx-auto max-w-[1400px] px-4 py-6 lg:px-6">
          <FilterBar 
            filters={filters}
            onFiltersChange={setFilters}
            onAISearch={handleAISearch}
            carsCount={filteredCars.length}
          />
        </section>

        {/* VIP Cars Section */}
        {vipCars.length > 0 && (
          <section className="mx-auto max-w-[1400px] px-4 py-6 lg:px-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-amber-400 to-orange-500">
                  <span className="text-sm font-bold text-white">VIP</span>
                </div>
                <h2 className="text-lg font-bold text-gray-900">SUPER VIP</h2>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition-colors hover:border-gray-300 hover:text-gray-600">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition-colors hover:border-gray-300 hover:text-gray-600">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {vipCars.slice(0, 4).map((car, i) => (
                <CarCard key={car.id || i} car={car} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* Regular Cars Section */}
        <section className="mx-auto max-w-[1400px] px-4 py-6 lg:px-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              განცხადებები ({filteredCars.length.toLocaleString()})
            </h2>
            <select className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 focus:border-primary focus:outline-none">
              <option>თარიღით (ახალი)</option>
              <option>თარიღით (ძველი)</option>
              <option>ფასით (ზრდადი)</option>
              <option>ფასით (კლებადი)</option>
              <option>წლით (ახალი)</option>
              <option>გარბენით</option>
            </select>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-sm text-gray-500">იტვირთება...</p>
              </div>
            </div>
          ) : regularCars.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {regularCars.map((car, i) => (
                <CarCard key={car.id || i} car={car} index={i} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white py-20">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                <CarIcon className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">ავტომობილები არ მოიძებნა</h3>
              <p className="mt-1 text-sm text-gray-500">
                {Object.values(filters).some(v => v) ? 'სცადეთ სხვა ფილტრები' : 'ჯერ არცერთი განცხადება არ არის'}
              </p>
              <Link
                href="/add-car"
                className="mt-6 rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary/90"
              >
                დაამატე განცხადება
              </Link>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-[1400px] px-4 py-10 lg:px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xl font-bold text-gray-800">automanqanebi</span>
                <span className="rounded bg-primary px-1.5 py-0.5 text-xs font-bold text-white">.ge</span>
              </div>
              <p className="mt-3 text-sm text-gray-500">
                საქართველოს უდიდესი ავტო პლატფორმა
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="mb-3 font-semibold text-gray-900">ბმულები</h4>
              <div className="flex flex-col gap-2">
                <Link href="/" className="text-sm text-gray-500 transition-colors hover:text-primary">მთავარი</Link>
                <Link href="/add-car" className="text-sm text-gray-500 transition-colors hover:text-primary">დამატება</Link>
                <Link href="/services" className="text-sm text-gray-500 transition-colors hover:text-primary">სერვისები</Link>
                <Link href="/blog" className="text-sm text-gray-500 transition-colors hover:text-primary">ბლოგი</Link>
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="mb-3 font-semibold text-gray-900">სერვისები</h4>
              <div className="flex flex-col gap-2">
                <Link href="/compare" className="text-sm text-gray-500 transition-colors hover:text-primary">შედარება</Link>
                <Link href="/favorites" className="text-sm text-gray-500 transition-colors hover:text-primary">რჩეულები</Link>
                <Link href="/profile" className="text-sm text-gray-500 transition-colors hover:text-primary">პროფილი</Link>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="mb-3 font-semibold text-gray-900">კონტაქტი</h4>
              <div className="flex flex-col gap-2 text-sm text-gray-500">
                <span>info@automanqanebi.ge</span>
                <span>+995 555 123 456</span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-8 sm:flex-row">
            <p className="text-sm text-gray-400">{"© 2024 AUTOMANQANEBI.GE — ყველა უფლება დაცულია"}</p>
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 transition-colors hover:text-primary">Facebook</a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 transition-colors hover:text-primary">Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
