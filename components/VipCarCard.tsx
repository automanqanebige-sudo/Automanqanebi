'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, MapPin, Gauge, Fuel, Columns2 } from 'lucide-react'
import { Car } from './CarCard'
import { useLanguage } from '@/context/LanguageContext'
import { useCurrency } from '@/context/CurrencyContext'
import { useFavorites } from '@/context/FavoritesContext'
import { useCompare } from '@/context/CompareContext'

interface VipCarCardProps {
  car: Car
  onFavoriteToggle?: (id: string) => void
}

export default function VipCarCard({ car, onFavoriteToggle }: VipCarCardProps) {
  const { t } = useLanguage()
  const { formatPrice } = useCurrency()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { isComparing, toggleCompare } = useCompare()
  const favorited = isFavorite(car.id)
  const comparing = isComparing(car.id)
  const [imageError, setImageError] = useState(false)

  const fuelLabel = t(`fuel.${car.fuelType}`) !== `fuel.${car.fuelType}` ? t(`fuel.${car.fuelType}`) : car.fuelType

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(car.id)
    onFavoriteToggle?.(car.id)
  }

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleCompare(car.id)
  }

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat('en-US').format(mileage) + ' km'
  }

  return (
    <Link href={`/car/${car.id}`} className="block group flex-shrink-0">
      <article className="card-premium relative w-80 flex-shrink-0 overflow-hidden border-primary/25 sm:w-96">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-transparent" />

        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          {!imageError ? (
            <Image
              src={car.image}
              alt={`${car.year} ${car.brand} ${car.model}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImageError(true)}
              sizes="(max-width: 640px) 320px, 384px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <span className="text-sm text-muted-foreground">{t('car.noImage')}</span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

          <div className="badge-premium absolute left-4 top-4 bg-primary px-3 py-1.5 text-primary-foreground shadow-md">
            VIP
          </div>

          <div className="absolute right-4 top-4 flex flex-col gap-2">
            <button
              type="button"
              onClick={handleFavoriteClick}
              className="rounded-full bg-card/95 p-3 shadow-xl transition-all duration-300 hover:scale-110 hover:bg-card group/heart"
              aria-label={favorited ? t('favorites.remove') : t('favorites.add')}
            >
              <Heart
                className={`h-6 w-6 transition-all duration-300 ${
                  favorited
                    ? 'scale-110 fill-red-500 text-red-500'
                    : 'text-muted-foreground group-hover/heart:text-red-500'
                }`}
              />
            </button>
            <button
              type="button"
              onClick={handleCompareClick}
              className={`rounded-full bg-card/95 p-3 shadow-xl transition-all duration-300 hover:scale-110 hover:bg-card ${
                comparing ? 'ring-2 ring-primary' : ''
              }`}
              aria-label={comparing ? t('compare.remove') : t('compare.add')}
              title={comparing ? t('compare.remove') : t('compare.add')}
            >
              <Columns2 className={`h-5 w-5 ${comparing ? 'text-primary' : 'text-muted-foreground'}`} />
            </button>
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <p className="price-display inline-block rounded-xl bg-surface-elevated/90 px-4 py-2 text-white shadow-lg backdrop-blur-sm">
              {formatPrice(car.price)}
            </p>
          </div>
        </div>

        <div className="relative p-5">
          <h3 className="line-clamp-1 text-xl font-bold text-card-foreground transition-colors duration-300 group-hover:text-primary">
            {car.year} {car.brand} {car.model}
          </h3>

          <div className="mt-3 flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0 text-primary" />
            <span className="truncate text-sm">{car.location}</span>
          </div>

          <div className="mt-4 flex items-center gap-5 border-t border-primary/20 pt-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="rounded-lg bg-secondary p-1.5">
                <Gauge className="h-4 w-4 shrink-0 text-primary" />
              </div>
              <span className="text-sm font-medium">{formatMileage(car.mileage)}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="rounded-lg bg-secondary p-1.5">
                <Fuel className="h-4 w-4 shrink-0 text-primary" />
              </div>
              <span className="text-sm font-medium">{fuelLabel}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
