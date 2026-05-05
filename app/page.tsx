'use client'

import { useEffect, useState, useMemo } from 'react'
import CarCard from '@/components/CarCard'
import Navbar from '@/components/Navbar'
import FilterBar, { Filters } from '@/components/FilterBar'
import { Car as CarIcon, Loader2, ChevronLeft, ChevronRight, LayoutGrid, List } from 'lucide-react'
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

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
    <div className="min-h-screen bg-[#F2F3F6]">
      <Navbar />
      
      <main>
        {/* Filters section */}
        <section className="mx-auto max-w-[1400px] px-4 py-5 lg:px-6">
          <FilterBar 
            filters={filters}
            onFiltersChange={setFilters}
            onAISearch={handleAISearch}
            carsCount={filteredCars.length}
          />
        </section>

        {/* VIP Cars Section */}
        {vipCars.length > 0 && (
          <section className="mx-auto max-w-[1400px] px-4 pb-4 lg:px-6">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 items-center gap-1 rounded bg-gradient-to-r from-amber-400 to-orange-500 px-2">
                  <svg className="h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                  </svg>
                  <span className="text-[12px] font-bold text-white">SUPER VIP</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 transition-colors hover:text-gray-600">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 transition-colors hover:text-gray-600">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {vipCars.slice(0, 4).map((car, i) => (
                <CarCard key={car.id || i} car={car} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* Regular Cars Section */}
        <section className="mx-auto max-w-[1400px] px-4 py-4 lg:px-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-gray-800">
              {filteredCars.length.toLocaleString()} განცხადება
            </h2>
            <div className="flex items-center gap-3">
              {/* View mode toggle */}
              <div className="flex overflow-hidden rounded-lg border border-gray-200 bg-white">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex h-9 w-9 items-center justify-center transition-colors ${
                    viewMode === 'grid' ? 'bg-[#FD4100] text-white' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex h-9 w-9 items-center justify-center border-l border-gray-200 transition-colors ${
                    viewMode === 'list' ? 'bg-[#FD4100] text-white' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
              
              {/* Sort dropdown */}
              <select className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-[13px] text-gray-600 focus:border-[#FD4100] focus:outline-none">
                <option>თარიღით (ახალი)</option>
                <option>თარიღით (ძველი)</option>
                <option>ფასით (ზრდადი)</option>
                <option>ფასით (კლებადი)</option>
                <option>წლით (ახალი)</option>
                <option>გარბენით</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-[#FD4100]" />
                <p className="text-[13px] text-gray-500">იტვირთება...</p>
              </div>
            </div>
          ) : regularCars.length > 0 ? (
            <div className={`grid gap-3 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {regularCars.map((car, i) => (
                <CarCard key={car.id || i} car={car} index={i} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white py-16">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
                <CarIcon className="h-7 w-7 text-gray-400" />
              </div>
              <h3 className="mt-4 text-[15px] font-semibold text-gray-800">ავტომობილები არ მოიძებნა</h3>
              <p className="mt-1 text-[13px] text-gray-500">
                {Object.values(filters).some(v => v) ? 'სცადეთ სხვა ფილტრები' : 'ჯერ არცერთი განცხადება არ არის'}
              </p>
              <Link
                href="/add-car"
                className="mt-5 rounded-full bg-[#FD4100] px-7 py-2.5 text-[13px] font-semibold text-white shadow-lg shadow-[#FD4100]/25 transition-all hover:bg-[#E53B00]"
              >
                დაამატე განცხადება
              </Link>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-8 border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-[1400px] px-4 py-8 lg:px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div>
              <div className="flex items-center">
                <span className="text-[18px] font-bold text-gray-800">myauto</span>
                <span className="ml-0.5 rounded bg-[#FD4100] px-1.5 py-0.5 text-[11px] font-bold text-white">.ge</span>
              </div>
              <p className="mt-2 text-[13px] text-gray-500">
                საქართველოს უდიდესი ავტო პლატფორმა
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="mb-3 text-[13px] font-semibold text-gray-800">ბმულები</h4>
              <div className="flex flex-col gap-2">
                <Link href="/" className="text-[13px] text-gray-500 transition-colors hover:text-[#FD4100]">მთავარი</Link>
                <Link href="/add-car" className="text-[13px] text-gray-500 transition-colors hover:text-[#FD4100]">დამატება</Link>
                <Link href="/services" className="text-[13px] text-gray-500 transition-colors hover:text-[#FD4100]">სერვისები</Link>
                <Link href="/blog" className="text-[13px] text-gray-500 transition-colors hover:text-[#FD4100]">ბლოგი</Link>
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="mb-3 text-[13px] font-semibold text-gray-800">სერვისები</h4>
              <div className="flex flex-col gap-2">
                <Link href="/compare" className="text-[13px] text-gray-500 transition-colors hover:text-[#FD4100]">შედარება</Link>
                <Link href="/favorites" className="text-[13px] text-gray-500 transition-colors hover:text-[#FD4100]">რჩეულები</Link>
                <Link href="/profile" className="text-[13px] text-gray-500 transition-colors hover:text-[#FD4100]">პროფილი</Link>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="mb-3 text-[13px] font-semibold text-gray-800">კონტაქტი</h4>
              <div className="flex flex-col gap-2 text-[13px] text-gray-500">
                <span>info@myauto.ge</span>
                <span>+995 555 123 456</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-gray-100 pt-6 sm:flex-row">
            <p className="text-[12px] text-gray-400">{"© 2024 MYAUTO.GE — ყველა უფლება დაცულია"}</p>
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-[12px] text-gray-400 transition-colors hover:text-[#FD4100]">Facebook</a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-[12px] text-gray-400 transition-colors hover:text-[#FD4100]">Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
