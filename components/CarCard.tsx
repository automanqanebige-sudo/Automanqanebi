'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, MapPin, Gauge, Fuel, Crown } from 'lucide-react'

export type Car = {
  id: string
  image: string
  price: number
  year: number
  brand: string
  model: string
  location: string
  mileage: number
  fuelType: string
  transmission?: string
  isVip?: boolean
  isFavorite?: boolean
}

interface CarCardProps {
  car: Car
  onFavoriteToggle?: (id: string) => void
}

export default function CarCard({ car, onFavoriteToggle }: CarCardProps) {
  const [isFavorite, setIsFavorite] = useState(car.isFavorite || false)
  const [imageError, setImageError] = useState(false)

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFavorite(!isFavorite)
    onFavoriteToggle?.(car.id)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat('en-US').format(mileage) + ' km'
  }

  return (
    <Link href={`/car/${car.id}`} className="block group">
      <article className="relative bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 border border-border">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {!imageError ? (
            <Image
              src={car.image}
              alt={`${car.year} ${car.brand} ${car.model}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImageError(true)}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <span className="text-muted-foreground text-sm">No image</span>
            </div>
          )}

          {/* VIP Badge */}
          {car.isVip && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-amber-500 text-white px-2.5 py-1 rounded-full text-xs font-semibold shadow-lg">
              <Crown className="h-3.5 w-3.5" />
              <span>VIP</span>
            </div>
          )}

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white shadow-md transition-all duration-200 hover:scale-110"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              className={`h-5 w-5 transition-colors ${
                isFavorite
                  ? 'fill-red-500 text-red-500'
                  : 'text-muted-foreground hover:text-red-500'
              }`}
            />
          </button>

          {/* Price Tag */}
          <div className="absolute bottom-3 left-3 bg-primary text-primary-foreground px-3 py-1.5 rounded-lg shadow-lg">
            <span className="text-lg font-bold">{formatPrice(car.price)}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="text-lg font-semibold text-card-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {car.year} {car.brand} {car.model}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1.5 mt-2 text-muted-foreground">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm truncate">{car.location}</span>
          </div>

          {/* Specs Row */}
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Gauge className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">{formatMileage(car.mileage)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Fuel className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">{car.fuelType}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
