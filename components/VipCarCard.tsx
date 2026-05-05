'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, MapPin, Gauge, Fuel, Crown, Sparkles } from 'lucide-react'
import { Car } from './CarCard'

interface VipCarCardProps {
  car: Car
  onFavoriteToggle?: (id: string) => void
}

export default function VipCarCard({ car, onFavoriteToggle }: VipCarCardProps) {
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
    <Link href={`/car/${car.id}`} className="block group flex-shrink-0">
      <article className="relative w-80 sm:w-96 bg-gradient-to-br from-amber-50 via-card to-amber-50/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 group-hover:scale-[1.02] border-2 border-amber-200/60">
        {/* Premium Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 via-transparent to-amber-400/5 pointer-events-none" />
        
        {/* Decorative Corner Accent */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-400/20 to-transparent pointer-events-none" />

        {/* Image Container - Larger aspect ratio for VIP */}
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          {!imageError ? (
            <Image
              src={car.image}
              alt={`${car.year} ${car.brand} ${car.model}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              onError={() => setImageError(true)}
              sizes="(max-width: 640px) 320px, 384px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <span className="text-muted-foreground text-sm">No image</span>
            </div>
          )}

          {/* Premium Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          {/* VIP Badge - Premium Design */}
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl shadow-amber-500/30">
            <Crown className="h-4 w-4" />
            <span>VIP</span>
            <Sparkles className="h-3.5 w-3.5" />
          </div>

          {/* Favorite Button - Larger for VIP */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-4 right-4 p-3 rounded-full bg-white/95 hover:bg-white shadow-xl transition-all duration-300 hover:scale-110 group/heart"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              className={`h-6 w-6 transition-all duration-300 ${
                isFavorite
                  ? 'fill-red-500 text-red-500 scale-110'
                  : 'text-muted-foreground group-hover/heart:text-red-500'
              }`}
            />
          </button>

          {/* Price Tag - Premium Styling */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground px-5 py-2.5 rounded-xl shadow-xl shadow-primary/30">
              <span className="text-2xl font-bold tracking-tight">{formatPrice(car.price)}</span>
            </div>
          </div>
        </div>

        {/* Content - Enhanced for VIP */}
        <div className="relative p-5">
          {/* Title - Larger for VIP */}
          <h3 className="text-xl font-bold text-card-foreground line-clamp-1 group-hover:text-primary transition-colors duration-300">
            {car.year} {car.brand} {car.model}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-2 mt-3 text-muted-foreground">
            <MapPin className="h-4 w-4 flex-shrink-0 text-primary" />
            <span className="text-sm truncate">{car.location}</span>
          </div>

          {/* Specs Row - Enhanced styling */}
          <div className="flex items-center gap-5 mt-4 pt-4 border-t border-amber-200/60">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="p-1.5 rounded-lg bg-secondary">
                <Gauge className="h-4 w-4 flex-shrink-0 text-primary" />
              </div>
              <span className="text-sm font-medium">{formatMileage(car.mileage)}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="p-1.5 rounded-lg bg-secondary">
                <Fuel className="h-4 w-4 flex-shrink-0 text-primary" />
              </div>
              <span className="text-sm font-medium">{car.fuelType}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
