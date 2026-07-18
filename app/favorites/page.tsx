'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import CarCard, { type Car } from '@/components/CarCard'
import { CarCardSkeletonGrid } from '@/components/ui/Skeleton'
import { useLanguage } from '@/context/LanguageContext'
import { useFavorites } from '@/context/FavoritesContext'
import { loadAllCars } from '@/lib/cars-firestore'
import { Heart } from 'lucide-react'

export default function FavoritesPage() {
  const { t } = useLanguage()
  const { favoriteIds, ready } = useFavorites()
  const [allCars, setAllCars] = useState<Car[]>([])
  const [loadingCars, setLoadingCars] = useState(true)

  useEffect(() => {
    loadAllCars()
      .then(setAllCars)
      .catch(() => setAllCars([]))
      .finally(() => setLoadingCars(false))
  }, [])

  const cars = useMemo(
    () => allCars.filter((car) => favoriteIds.has(car.id)),
    [allCars, favoriteIds]
  )

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-2 flex items-center gap-3 text-2xl font-bold text-foreground">
          <Heart className="h-7 w-7 text-primary" />
          {t('favorites.title')}
        </h1>
        <p className="mb-8 text-sm text-muted-foreground">{t('favorites.hint')}</p>

        {!ready || loadingCars ? (
          <CarCardSkeletonGrid count={4} />
        ) : cars.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-card px-6 py-12 text-center">
            <p className="text-muted-foreground">{t('favorites.empty')}</p>
            <Link
              href="/"
              className="mt-4 inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              {t('nav.home')}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
