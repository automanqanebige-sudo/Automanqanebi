'use client'

import Link from 'next/link'
import { MapPin, Gauge, Heart, Fuel, Calendar } from 'lucide-react'
import type { Car } from '@/types/car'
import { fuelTypeLabels } from '@/types/car'
import { useCurrency } from '@/context/CurrencyContext'
import { useState } from 'react'

const tierConfig: Record<string, { gradient: string; label: string }> = {
  platinum: { gradient: 'from-violet-600 to-purple-600', label: 'SUPER VIP' },
  gold: { gradient: 'from-amber-500 to-orange-500', label: 'VIP' },
  silver: { gradient: 'from-slate-400 to-slate-500', label: 'VIP+' },
}

export default function CarCard({ car, index = 0 }: { car?: Car; index?: number }) {
  const { currency, convertPrice } = useCurrency()
  const [isFavorite, setIsFavorite] = useState(false)

  if (!car) return null

  const title = car.year 
    ? `${car.year} ${car.brand || ''} ${car.model || ''}`.trim()
    : car.name || `${car.brand || ''} ${car.model || ''}`.trim() || 'უცნობი'
  
  const price = car.price ? convertPrice(car.price) : null
  const priceText = price 
    ? `${price.toLocaleString()} ${currency === 'GEL' ? '₾' : '$'}` 
    : 'ფასი შეთანხმებით'
  
  const tier = car.tier && car.tier !== 'standard' ? tierConfig[car.tier] : null

  return (
    <div
      className="animate-fade-in-up card-hover group overflow-hidden rounded-2xl border border-white/10 bg-[#1e293b]"
      style={{ animationDelay: `${(index || 0) * 60}ms` }}
    >
      <Link href={`/car/${car.id || ''}`} className="block">
        {/* Image section */}
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-800">
          {car.image ? (
            <img
              src={car.image}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800">
              <Gauge className="h-16 w-16 text-slate-600" />
            </div>
          )}

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* VIP Badge */}
          {tier && (
            <div className={`absolute left-3 top-3 rounded-lg bg-gradient-to-r ${tier.gradient} px-3 py-1.5 text-xs font-bold text-white shadow-lg`}>
              {tier.label}
            </div>
          )}

          {/* Favorite button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIsFavorite(!isFavorite)
            }}
            className={`absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md transition-all duration-200 ${
              isFavorite
                ? 'bg-red-500 text-white scale-110'
                : 'bg-black/40 text-white hover:bg-red-500 hover:scale-110'
            }`}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          {/* Price badge on image */}
          <div className="absolute bottom-3 left-3">
            <span className="rounded-lg bg-orange-500 px-4 py-2 text-lg font-bold text-white shadow-lg">
              {priceText}
            </span>
          </div>
        </div>

        {/* Content section */}
        <div className="p-4">
          {/* Title */}
          <h3 className="mb-3 line-clamp-1 text-lg font-semibold text-white transition-colors group-hover:text-orange-400">
            {title}
          </h3>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-3">
            {car.mileage !== undefined && (
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
                  <Gauge className="h-4 w-4 text-slate-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">გარბენი</p>
                  <p className="text-sm font-medium text-white">{car.mileage.toLocaleString()} კმ</p>
                </div>
              </div>
            )}

            {car.fuelType && (
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
                  <Fuel className="h-4 w-4 text-slate-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">საწვავი</p>
                  <p className="text-sm font-medium text-white">{fuelTypeLabels[car.fuelType] || car.fuelType}</p>
                </div>
              </div>
            )}

            {car.year && (
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
                  <Calendar className="h-4 w-4 text-slate-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">წელი</p>
                  <p className="text-sm font-medium text-white">{car.year}</p>
                </div>
              </div>
            )}

            {car.location && (
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
                  <MapPin className="h-4 w-4 text-slate-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">ადგილი</p>
                  <p className="text-sm font-medium text-white truncate">{car.location}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}
