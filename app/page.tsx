'use client'

import { useEffect, useState, useMemo } from 'react'
import CarCard from '@/components/CarCard'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import { Car as CarIcon, Loader2 } from 'lucide-react'

type Car = {
  id?: string
  name?: string
  brand?: string
  model?: string
  price?: number
  image?: string
  year?: number
  description?: string
}

export default function Home() {
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

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
    if (!searchQuery.trim()) return cars
    const q = searchQuery.toLowerCase()
    return cars.filter(car =>
      (car.name?.toLowerCase().includes(q)) ||
      (car.brand?.toLowerCase().includes(q)) ||
      (car.model?.toLowerCase().includes(q))
    )
  }, [cars, searchQuery])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection onSearch={setSearchQuery} />

      {/* Car listings section */}
      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-16">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {searchQuery ? 'ძებნის შედეგები' : 'ბოლო განცხადებები'}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {filteredCars.length > 0
                ? `${filteredCars.length} ავტომობილი ნაპოვნია`
                : 'ავტომობილები ვერ მოიძებნა'}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">იტვირთება...</p>
            </div>
          </div>
        ) : filteredCars.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCars.map((car, i) => (
              <CarCard key={car.id || i} car={car} index={i} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 py-24">
            <CarIcon className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">ავტომობილები არ მოიძებნა</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {searchQuery ? 'სცადეთ სხვა საძიებო სიტყვა' : 'ჯერ არცერთი განცხადება არ არის'}
            </p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row lg:px-8">
          <p>{"2024 AutoManqanebi. ყველა უფლება დაცულია."}</p>
          <div className="flex gap-6">
            <a href="#" className="transition-colors hover:text-foreground">კონფიდენციალურობა</a>
            <a href="#" className="transition-colors hover:text-foreground">პირობები</a>
            <a href="#" className="transition-colors hover:text-foreground">კონტაქტი</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
