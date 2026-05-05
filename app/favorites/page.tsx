'use client'

import { useEffect, useState } from 'react'
import CarCard from '@/components/CarCard'
import Navbar from '@/components/Navbar'
import { Heart, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function FavoritesPage() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch('/api/favorites')
      .then(res => res.json())
      .then(data => {
        setCars(data || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Heart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">ფავორიტები</h1>
              <p className="text-sm text-muted-foreground">თქვენი შენახული განცხადებები</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">იტვირთება...</p>
            </div>
          </div>
        ) : cars.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cars.map((car: any, i: number) => (
              <CarCard key={car.id || i} car={car} index={i} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 py-24">
            <Heart className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">ფავორიტები ცარიელია</h3>
            <p className="mt-1 text-sm text-muted-foreground">ჯერ არცერთი განცხადება არ გაქვთ შენახული</p>
            <Link
              href="/"
              className="mt-6 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              განცხადებების ნახვა
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
