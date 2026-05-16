'use client'

import { useEffect, useState } from 'react'
import CarCard, { type Car } from '@/components/CarCard'
import { sampleCars } from '@/data/cars'
import { useLanguage } from '@/context/LanguageContext'
import { Heart } from 'lucide-react'

export default function FavoritesPage() {
  const { t } = useLanguage()
  const [cars, setCars] = useState<Car[]>([])

  useEffect(() => {
    fetch('/api/favorites')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCars(data)
          return
        }
        setCars(sampleCars.filter((car) => car.isFavorite))
      })
      .catch(() => {
        setCars(sampleCars.filter((car) => car.isFavorite))
      })
  }, [])

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 flex items-center gap-3 text-2xl font-bold text-foreground">
          <Heart className="h-7 w-7 text-primary" />
          {t('favorites.title')}
        </h1>

        {cars.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-border bg-card px-6 py-12 text-center text-muted-foreground">
            {t('favorites.empty')}
          </p>
        )}
      </div>
    </div>
  )
}
