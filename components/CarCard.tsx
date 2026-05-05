'use client'

import Link from 'next/link'
import { Calendar, MapPin, Gauge, Fuel, Clock, Heart, Check } from 'lucide-react'
import type { Car } from '@/types/car'
import { fuelTypeLabels, tierLabels } from '@/types/car'
import { useCurrency } from '@/context/CurrencyContext'
import { useState, useEffect } from 'react'

const tierStyles: Record<string, { bg: string; text: string }> = {
  platinum: { bg: 'bg-gradient-to-r from-violet-600 to-purple-600', text: 'SUPER VIP' },
  gold: { bg: 'bg-gradient-to-r from-amber-500 to-orange-500', text: 'VIP' },
  silver: { bg: 'bg-gradient-to-r from-gray-500 to-gray-600', text: 'VIP+' },
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
  const [timeAgo, setTimeAgo] = useState<string>('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (car?.createdAt) {
      setTimeAgo(formatTimeAgo(car.createdAt))
    }
  }, [car?.createdAt])

  if (!car) return null

  const displayName = car.name || (car.brand && car.model ? `${car.brand} ${car.model}` : 'უცნობი მანქანა')
  const displayPrice = car.price ? convertPrice(car.price) : null
  const formattedPrice = displayPrice ? `${displayPrice.toLocaleString()} ${currency === 'GEL' ? '₾' : '$'}` : 'ფასი შეთანხმებით'
  const tier = car.tier || 'standard'
  const showBadge = tier !== 'standard'
  const tierStyle = tierStyles[tier]

  return (
    <div
      className="animate-fade-in-up card-hover group overflow-hidden rounded-2xl border border-gray-200 bg-white"
      style={{ animationDelay: `${(index || 0) * 50}ms` }}
    >
      <Link href={`/car/${car.id || ''}`} className="block">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
          {car.image ? (
            <img
              src={car.image}
              alt={displayName}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Gauge className="h-16 w-16 text-gray-200" />
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

          {/* Tier badge */}
          {showBadge && tierStyle && (
            <span className={`absolute left-3 top-3 rounded-lg px-3 py-1.5 text-xs font-bold text-white shadow-lg ${tierStyle.bg}`}>
              {tierStyle.text}
            </span>
          )}

          {/* VIN verified badge */}
          {car.hasVIN && (
            <span className="absolute left-3 bottom-3 flex items-center gap-1 rounded-lg bg-green-500 px-2 py-1 text-xs font-medium text-white shadow-lg">
              <Check className="h-3 w-3" />
              VIN
            </span>
          )}

          {/* Favorite button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              setIsFavorite(!isFavorite)
            }}
            className={`absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full shadow-lg backdrop-blur-md transition-all ${
              isFavorite 
                ? 'bg-red-500 text-white' 
                : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500 hover:scale-110'
            }`}
          >
            <Heart className={`h-5 w-5 transition-transform ${isFavorite ? 'fill-current scale-110' : ''}`} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Price */}
          <div className="mb-2">
            <span className="text-xl font-bold text-gray-900">{formattedPrice}</span>
          </div>

          {/* Title */}
          <h3 className="mb-3 line-clamp-1 text-base font-semibold text-gray-800 group-hover:text-primary transition-colors">
            {displayName}
          </h3>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {car.year && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>{car.year} წ.</span>
              </div>
            )}
            {car.mileage !== undefined && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Gauge className="h-4 w-4 text-gray-400" />
                <span>{car.mileage.toLocaleString()} კმ</span>
              </div>
            )}
            {car.fuelType && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Fuel className="h-4 w-4 text-gray-400" />
                <span>{fuelTypeLabels[car.fuelType] || car.fuelType}</span>
              </div>
            )}
            {car.location && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="truncate">{car.location}</span>
              </div>
            )}
          </div>

          {/* Footer */}
          {mounted && timeAgo && (
            <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-3">
              <Clock className="h-4 w-4 text-gray-300" />
              <span className="text-xs text-gray-400">{timeAgo}</span>
            </div>
          )}
        </div>
      </Link>
    </div>
  )
}
