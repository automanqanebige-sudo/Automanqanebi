'use client'

import { useEffect, useState, useMemo } from 'react'
import CarCard, { type Car } from '@/components/CarCard'
import { CarCardSkeletonGrid } from '@/components/ui/Skeleton'
import { useLanguage } from '@/context/LanguageContext'
import { useFavorites } from '@/context/FavoritesContext'
import { loadAllCars } from '@/lib/cars-firestore'
import { Heart } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import EmptyState from '@/components/ui/EmptyState'

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
    <div className="min-h-screen bg-background section-padding">
      <div className="mx-auto max-w-7xl">
        <PageHeader
          icon={<Heart className="h-7 w-7 text-primary" aria-hidden />}
          title={t('favorites.title')}
          subtitle={t('favorites.hint')}
        />

        {!ready || loadingCars ? (
          <CarCardSkeletonGrid count={4} />
        ) : cars.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Heart className="h-8 w-8 text-muted-foreground" aria-hidden />}
            title={t('favorites.empty')}
            actionLabel={t('nav.home')}
            actionHref="/"
          />
        )}
      </div>
    </div>
  )
}
