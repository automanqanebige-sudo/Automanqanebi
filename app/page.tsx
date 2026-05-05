'use client'

import { useEffect, useState, useMemo } from 'react'
import CarCard from '@/components/CarCard'
import Navbar from '@/components/Navbar'
import FilterBar, { Filters } from '@/components/FilterBar'
import { Car as CarIcon, Loader2, ChevronLeft, ChevronRight, LayoutGrid, List, ArrowUpDown, Sparkles, Shield, Clock, Users } from 'lucide-react'
import type { Car } from '@/types/car'
import Link from 'next/link'
import Image from 'next/image'

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

const stats = [
  { icon: Users, value: '2.5M+', label: 'მომხმარებელი' },
  { icon: CarIcon, value: '137K', label: 'განცხადება' },
  { icon: Shield, value: '100%', label: 'დაცული' },
  { icon: Clock, value: '24/7', label: 'მხარდაჭერა' },
]

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
    <div className="min-h-screen bg-gray-50/50">
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
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-orange-500/25">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">SUPER VIP</h2>
                  <p className="text-sm text-gray-500">პრემიუმ განცხადებები</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-400 transition-all hover:border-gray-300 hover:text-gray-600 hover:shadow-md">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-400 transition-all hover:border-gray-300 hover:text-gray-600 hover:shadow-md">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {vipCars.slice(0, 4).map((car, i) => (
                <CarCard key={car.id || i} car={car} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* Regular Cars Section */}
        <section className="mx-auto max-w-[1400px] px-4 py-6 lg:px-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                ყველა განცხადება
              </h2>
              <p className="text-sm text-gray-500">{filteredCars.length.toLocaleString()} შედეგი</p>
            </div>
            <div className="flex items-center gap-3">
              {/* View mode toggle */}
              <div className="flex rounded-xl border border-gray-200 bg-white p-1">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
              
              {/* Sort dropdown */}
              <div className="relative">
                <select className="h-11 appearance-none rounded-xl border border-gray-200 bg-white pl-4 pr-10 text-sm font-medium text-gray-700 transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10">
                  <option>თარიღით (ახალი)</option>
                  <option>თარიღით (ძველი)</option>
                  <option>ფასით (ზრდადი)</option>
                  <option>ფასით (კლებადი)</option>
                  <option>წლით (ახალი)</option>
                  <option>გარბენით</option>
                </select>
                <ArrowUpDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="h-16 w-16 rounded-full border-4 border-gray-200" />
                  <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-primary" />
                </div>
                <p className="text-sm font-medium text-gray-500">იტვირთება...</p>
              </div>
            </div>
          ) : regularCars.length > 0 ? (
            <div className={`grid gap-5 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
              {regularCars.map((car, i) => (
                <CarCard key={car.id || i} car={car} index={i} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-white py-24">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gray-100">
                <CarIcon className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-gray-900">ავტომობილები არ მოიძებნა</h3>
              <p className="mt-2 text-gray-500">
                {Object.values(filters).some(v => v) ? 'სცადეთ სხვა ფილტრები' : 'ჯერ არცერთი განცხადება არ არის'}
              </p>
              <Link
                href="/add-car"
                className="mt-8 rounded-full bg-gradient-to-r from-primary to-orange-500 px-10 py-4 text-sm font-bold text-white shadow-xl shadow-primary/25 transition-all hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-0.5"
              >
                დაამატე განცხადება
              </Link>
            </div>
          )}
        </section>

        {/* Stats Section */}
        <section className="mx-auto max-w-[1400px] px-4 py-12 lg:px-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <div
                  key={i}
                  className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm transition-all hover:shadow-lg"
                >
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                  <span className="text-sm text-gray-500">{stat.label}</span>
                </div>
              )
            })}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-[1400px] px-4 py-12 lg:px-6">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div>
              <Image
                src="/logo.jpg"
                alt="Automanqanebi.ge"
                width={140}
                height={70}
                className="h-12 w-auto object-contain"
              />
              <p className="mt-4 text-sm leading-relaxed text-gray-500">
                საქართველოს უდიდესი ავტომობილების პლატფორმა. იყიდე, გაყიდე და იქირავე საუკეთესო ფასად.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="mb-4 font-bold text-gray-900">ბმულები</h4>
              <div className="flex flex-col gap-3">
                <Link href="/" className="text-sm text-gray-500 transition-colors hover:text-primary">მთავარი</Link>
                <Link href="/add-car" className="text-sm text-gray-500 transition-colors hover:text-primary">დამატება</Link>
                <Link href="/services" className="text-sm text-gray-500 transition-colors hover:text-primary">სერვისები</Link>
                <Link href="/blog" className="text-sm text-gray-500 transition-colors hover:text-primary">ბლოგი</Link>
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="mb-4 font-bold text-gray-900">სერვისები</h4>
              <div className="flex flex-col gap-3">
                <Link href="/compare" className="text-sm text-gray-500 transition-colors hover:text-primary">შედარება</Link>
                <Link href="/favorites" className="text-sm text-gray-500 transition-colors hover:text-primary">რჩეულები</Link>
                <Link href="/profile" className="text-sm text-gray-500 transition-colors hover:text-primary">პროფილი</Link>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="mb-4 font-bold text-gray-900">კონტაქტი</h4>
              <div className="flex flex-col gap-3 text-sm text-gray-500">
                <span>info@automanqanebi.ge</span>
                <span>+995 555 123 456</span>
                <div className="mt-2 flex gap-3">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-all hover:bg-primary hover:text-white">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-all hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500 hover:text-white">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-8 md:flex-row">
            <p className="text-sm text-gray-400">{"© 2024 AUTOMANQANEBI.GE — ყველა უფლება დაცულია"}</p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-gray-400 transition-colors hover:text-primary">კონფიდენციალურობა</a>
              <a href="#" className="text-sm text-gray-400 transition-colors hover:text-primary">წესები და პირობები</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
