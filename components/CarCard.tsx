'use client'

import Link from 'next/link'
import { Calendar, MapPin, Gauge, Fuel, Clock, Heart, Settings2 } from 'lucide-react'
import type { Car } from '@/types/car'
import { fuelTypeLabels, tierLabels } from '@/types/car'
import { useCurrency } from '@/context/CurrencyContext'
import { useState, useEffect } from 'react'

const tierStyles: Record<string, { bg: string; text: string; label: string }> = {
  platinum: { bg: 'bg-gradient-to-r from-violet-500 to-purple-600', text: 'text-white', label: 'SUPER VIP' },
  gold: { bg: 'bg-gradient-to-r from-amber-400 to-orange-500', text: 'text-white', label: 'VIP' },
  silver: { bg: 'bg-[#8E9BAE]', text: 'text-white', label: 'VIP' },
}

function formatTimeAgo(date: Date | string | undefined): string {
  if (!date) return ''
  const now = new Date()
  const past = new Date(date)
  const diffMs = now.getTime() - past.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 60) return `${diffMins} წთ`
  if (diffHours < 24) return `${diffHours} სთ`
  if (diffDays === 1) return 'გუშინ'
  if (diffDays < 7) return `${diffDays} დღე`
  return `${Math.floor(diffDays / 7)} კვ`
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
  const tierStyle = tierStyles[tier]

  return (
    <div
      className="animate-fade-in-up group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md"
      style={{ animationDelay: `${(index || 0) * 40}ms` }}
    >
      <Link href={`/car/${car.id || ''}`} className="block">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
          {car.image ? (
            <img
              src={car.image}
              alt={displayName}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-300">
              <Settings2 className="h-12 w-12" />
            </div>
          )}

          {/* Tier badge */}
          {tierStyle && (
            <span className={`absolute left-3 top-3 flex items-center gap-1 rounded px-2 py-1 text-[11px] font-bold ${tierStyle.bg} ${tierStyle.text}`}>
              {tier === 'platinum' && (
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
              )}
              {tierStyle.label}
            </span>
          )}

          {/* Favorite button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              setIsFavorite(!isFavorite)
            }}
            className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm transition-all ${
              isFavorite ? 'bg-[#FD4100] text-white' : 'bg-black/30 text-white hover:bg-black/40'
            }`}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          {/* Bottom gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/30 to-transparent" />
        </div>

        {/* Content */}
        <div className="p-3.5">
          {/* Price */}
          <div className="mb-2 text-[18px] font-bold text-gray-900">{formattedPrice}</div>

          {/* Title */}
          <h3 className="mb-3 line-clamp-1 text-[14px] font-medium text-gray-700">{displayName}</h3>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[12px]">
            {car.year && (
              <div className="flex items-center gap-1.5 text-gray-500">
                <Calendar className="h-3.5 w-3.5 text-gray-400" />
                <span>{car.year} წ.</span>
              </div>
            )}
            {car.mileage !== undefined && (
              <div className="flex items-center gap-1.5 text-gray-500">
                <Gauge className="h-3.5 w-3.5 text-gray-400" />
                <span>{car.mileage.toLocaleString()} კმ</span>
              </div>
            )}
            {car.fuelType && (
              <div className="flex items-center gap-1.5 text-gray-500">
                <Fuel className="h-3.5 w-3.5 text-gray-400" />
                <span>{fuelTypeLabels[car.fuelType] || car.fuelType}</span>
              </div>
            )}
            {car.transmission && (
              <div className="flex items-center gap-1.5 text-gray-500">
                <Settings2 className="h-3.5 w-3.5 text-gray-400" />
                <span>{car.transmission === 'Automatic' ? 'ავტომატიკა' : 'მექანიკა'}</span>
              </div>
            )}
          </div>

          {/* Bottom row: Location + Time */}
          <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 text-[11px] text-gray-400">
            {car.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{car.location}</span>
              </div>
            )}
            {mounted && timeAgo && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{timeAgo}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}
