'use client'

import Link from 'next/link'
import { Calendar, MapPin, Gauge, Fuel, Clock, Heart } from 'lucide-react'
import type { Car } from '@/types/car'
import { fuelTypeLabels, tierLabels } from '@/types/car'
import { useCurrency } from '@/context/CurrencyContext'
import { useState } from 'react'

const tierStyles: Record<string, string> = {
  platinum: 'bg-gradient-to-r from-violet-500 to-purple-600',
  gold: 'bg-gradient-to-r from-amber-400 to-orange-500',
  silver: 'bg-gradient-to-r from-gray-400 to-gray-500',
}

function formatTimeAgo(date: Date | string | undefined): string {
  if (!date) return ''
  const now = new Date()
  const past = new Date(date)
  const diffMs = now.getTime() - past.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 60) return `${diffMins} წუთის წინ`
  if (diffHours < 24) return `${diffHours} საათის წინ`
  if (diffDays === 1) return 'გუშინ'
  if (diffDays < 7) return `${diffDays} დღის წინ`
  return `${Math.floor(diffDays / 7)} კვირის წინ`
}

export default function CarCard({ car, index = 0 }: { car?: Car; index?: number }) {
  const { currency, convertPrice } = useCurrency()
  const [isFavorite, setIsFavorite] = useState(false)

  if (!car) return null

  const displayName = car.name || (car.brand && car.model ? `${car.brand} ${car.model}` : 'უცნობი მანქანა')
  const displayPrice = car.price ? convertPrice(car.price) : null
  const formattedPrice = displayPrice ? `${displayPrice.toLocaleString()} ${currency === 'GEL' ? '₾' : '$'}` : 'ფასი შეთანხმებით'
  const tier = car.tier || 'standard'
  const showBadge = tier !== 'standard'

  return (
    <div
      className="animate-fade-in-up group overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:shadow-lg"
      style={{ animationDelay: `${(index || 0) * 50}ms` }}
    >
      <Link href={`/car/${car.id || ''}`} className="block">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
          {car.image ? (
            <img
              src={car.image}
              alt={displayName}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-300">
              <Gauge className="h-12 w-12" />
            </div>
          )}

          {/* Tier badge */}
          {showBadge && (
            <span className={`absolute left-3 top-3 rounded-md px-2 py-1 text-xs font-bold text-white ${tierStyles[tier]}`}>
              {tierLabels[tier]}
            </span>
          )}

          {/* Favorite button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              setIsFavorite(!isFavorite)
            }}
            className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full transition-all ${
              isFavorite ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500'
            }`}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title & Price */}
          <div className="mb-3 flex items-start justify-between gap-3">
            <h3 className="line-clamp-1 font-semibold text-gray-900">{displayName}</h3>
            <span className="shrink-0 text-lg font-bold text-primary">{formattedPrice}</span>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            {car.year && (
              <div className="flex items-center gap-2 text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>{car.year} წ.</span>
              </div>
            )}
            {car.mileage && (
              <div className="flex items-center gap-2 text-gray-500">
                <Gauge className="h-4 w-4" />
                <span>{car.mileage.toLocaleString()} კმ</span>
              </div>
            )}
            {car.fuelType && (
              <div className="flex items-center gap-2 text-gray-500">
                <Fuel className="h-4 w-4" />
                <span>{fuelTypeLabels[car.fuelType] || car.fuelType}</span>
              </div>
            )}
            {car.location && (
              <div className="flex items-center gap-2 text-gray-500">
                <MapPin className="h-4 w-4" />
                <span className="truncate">{car.location}</span>
              </div>
            )}
          </div>

          {/* Time ago */}
          {car.createdAt && (
            <div className="mt-3 flex items-center gap-1.5 border-t border-gray-100 pt-3 text-xs text-gray-400">
              <Clock className="h-3.5 w-3.5" />
              {formatTimeAgo(car.createdAt)}
            </div>
          )}
        </div>
      </Link>
    </div>
  )
}
