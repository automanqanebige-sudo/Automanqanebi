'use client'

import { useEffect, useState, useMemo } from 'react'
import CarCard from '@/components/CarCard'
import Navbar from '@/components/Navbar'
import FilterBar, { Filters } from '@/components/FilterBar'
import { Car as CarIcon, ChevronLeft, ChevronRight, LayoutGrid, List, ArrowUpDown, Sparkles, Shield, Clock, Users } from 'lucide-react'
import type { Car } from '@/types/car'
import Link from 'next/link'
import Image from 'next/image'

const emptyFilters: Filters = {
  brand: '', model: '', yearFrom: '', yearTo: '',
  priceFrom: '', priceTo: '', fuelType: '', vehicleType: '', transmission: '',
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
      .then(data => { setCars(data || []); setLoading(false) })
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
        const text = `${car.brand || ''} ${car.model || ''} ${car.name || ''} ${car.description || ''}`.toLowerCase()
        if (!text.includes(query)) return false
      }
      return true
    })
  }, [cars, filters, aiQuery])

  const vipCars = useMemo(() => filteredCars.filter(car => car.tier === 'platinum' || car.tier === 'gold'), [filteredCars])
  const regularCars = useMemo(() => filteredCars.filter(car => !car.tier || car.tier === 'standard' || car.tier === 'silver'), [filteredCars])

  const handleAISearch = async (query: string) => {
    setAIQuery(query)
    try {
      const res = await fetch('/api/ai-search', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query }) })
      const data = await res.json()
      if (data.filters) {
        setFilters(prev => ({
          ...prev,
          brand: data.filters.brand || prev.brand,
          yearFrom: data.filters.yearFrom?.toString() || prev.yearFrom,
          priceTo: data.filters.priceMax?.toString() || prev.priceTo,
          fuelType: data.filters.fuelType || prev.fuelType,
        }))
      }
    } catch (e) { console.error('AI search error:', e) }
  }

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <Navbar />
      
      <main>
        {/* Filters */}
        <section className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
          <FilterBar filters={filters} onFiltersChange={setFilters} onAISearch={handleAISearch} carsCount={filteredCars.length} />
        </section>

        {/* VIP Cars */}
        {vipCars.length > 0 && (
          <section className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-orange-500/25">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">SUPER VIP</h2>
                  <p className="text-sm text-slate-400">პრემიუმ განცხადებები</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"><ChevronLeft className="h-5 w-5" /></button>
                <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"><ChevronRight className="h-5 w-5" /></button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {vipCars.slice(0, 4).map((car, i) => <CarCard key={car.id || i} car={car} index={i} />)}
            </div>
          </section>
        )}

        {/* All Cars */}
        <section className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">ყველა განცხადება</h2>
              <p className="text-sm text-slate-400">{filteredCars.length.toLocaleString()} შედეგი</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex rounded-xl border border-white/10 bg-white/5 p-1">
                <button onClick={() => setViewMode('grid')} className={`flex h-9 w-9 items-center justify-center rounded-lg ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}><LayoutGrid className="h-4 w-4" /></button>
                <button onClick={() => setViewMode('list')} className={`flex h-9 w-9 items-center justify-center rounded-lg ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}><List className="h-4 w-4" /></button>
              </div>
              <div className="relative">
                <select className="h-11 appearance-none rounded-xl border border-white/10 bg-white/5 pl-4 pr-10 text-sm font-medium text-white focus:border-orange-500/50 focus:outline-none">
                  <option>თარიღით (ახალი)</option>
                  <option>ფასით (ზრდადი)</option>
                  <option>ფასით (კლებადი)</option>
                  <option>წლით (ახალი)</option>
                </select>
                <ArrowUpDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="flex flex-col items-center gap-4">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-orange-500" />
                <p className="text-sm text-slate-400">იტვირთება...</p>
              </div>
            </div>
          ) : regularCars.length > 0 ? (
            <div className={`grid gap-5 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
              {regularCars.map((car, i) => <CarCard key={car.id || i} car={car} index={i} />)}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#1e293b] py-24">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-800"><CarIcon className="h-10 w-10 text-slate-600" /></div>
              <h3 className="mt-6 text-xl font-bold text-white">ავტომობილები არ მოიძებნა</h3>
              <p className="mt-2 text-slate-400">{Object.values(filters).some(v => v) ? 'სცადეთ სხვა ფილტრები' : 'ჯერ არცერთი განცხადება არ არის'}</p>
              <Link href="/add-car" className="mt-8 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25">დაამატე განცხადება</Link>
            </div>
          )}
        </section>

        {/* Stats */}
        <section className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <div key={i} className="flex flex-col items-center rounded-2xl border border-white/10 bg-[#1e293b] p-6 text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10"><Icon className="h-6 w-6 text-orange-500" /></div>
                  <span className="text-2xl font-bold text-white">{stat.value}</span>
                  <span className="text-sm text-slate-400">{stat.label}</span>
                </div>
              )
            })}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#0f172a]">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <Image src="/logo.jpg" alt="Automanqanebi.ge" width={120} height={60} className="h-12 w-auto" />
              <p className="mt-4 text-sm leading-relaxed text-slate-400">საქართველოს უდიდესი ავტომობილების პლატფორმა.</p>
            </div>
            <div>
              <h4 className="mb-4 font-bold text-white">ბმულები</h4>
              <div className="flex flex-col gap-3">
                <Link href="/" className="text-sm text-slate-400 hover:text-orange-400">მთავარი</Link>
                <Link href="/add-car" className="text-sm text-slate-400 hover:text-orange-400">დამატება</Link>
                <Link href="/services" className="text-sm text-slate-400 hover:text-orange-400">სერვისები</Link>
                <Link href="/blog" className="text-sm text-slate-400 hover:text-orange-400">ბლოგი</Link>
              </div>
            </div>
            <div>
              <h4 className="mb-4 font-bold text-white">სერვისები</h4>
              <div className="flex flex-col gap-3">
                <Link href="/compare" className="text-sm text-slate-400 hover:text-orange-400">შედარება</Link>
                <Link href="/favorites" className="text-sm text-slate-400 hover:text-orange-400">რჩეულები</Link>
                <Link href="/profile" className="text-sm text-slate-400 hover:text-orange-400">პროფილი</Link>
              </div>
            </div>
            <div>
              <h4 className="mb-4 font-bold text-white">კონტაქტი</h4>
              <div className="flex flex-col gap-3 text-sm text-slate-400">
                <span>info@automanqanebi.ge</span>
                <span>+995 555 123 456</span>
              </div>
            </div>
          </div>
          <div className="mt-10 border-t border-white/10 pt-8 text-center">
            <p className="text-sm text-slate-500">{"© 2024 AUTOMANQANEBI.GE"}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
