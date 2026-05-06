'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Gauge, Heart, Fuel, Calendar } from 'lucide-react'
import type { Car } from '@/types/car'
import { fuelTypeLabels } from '@/types/car'
import { useCurrency } from '@/context/CurrencyContext'
import { useState, useEffect } from 'react'

const tierConfig: Record<string, { gradient: string; label: string }> = {
  platinum: { gradient: 'from-purple-600 to-indigo-600', label: 'SUPER VIP' },
  gold: { gradient: 'from-amber-500 to-orange-500', label: 'VIP' },
  silver: { gradient: 'from-slate-400 to-slate-500', label: 'VIP+' },
}

export default function CarCard({ car, index = 0 }: { car?: Car; index?: number }) {
  const { currency, convertPrice } = useCurrency()
  const [isFavorite, setIsFavorite] = useState(false)
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  if (!car) return null

  const title = car.year && car.brand && car.model 
    ? `${car.year} ${car.brand} ${car.model}` 
    : car.name || 'უცნობი მანქანა'
  
  const price = car.price ? convertPrice(car.price) : null
  const formattedPrice = price 
    ? `${price.toLocaleString()} ${currency === 'GEL' ? '₾' : '$'}` 
    : 'ფასი შეთანხმებით'
  
  const tier = car.tier || 'standard'
  const tierStyle = tierConfig[tier]

  return (
    <div 
      className="group relative overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200 transition-all duration-300 hover:shadow-xl hover:ring-gray-300 hover:-translate-y-1"
      style={{ 
        animationDelay: `${index * 50}ms`,
        animation: 'fadeInUp 0.4s ease-out forwards',
        opacity: 0
      }}
    >
      <Link href={`/car/${car.id || ''}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          {car.image ? (
            <img
              src={car.image}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              onLoad={() => setIsImageLoaded(true)}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
              <Gauge className="h-12 w-12 text-gray-300" />
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* VIP Badge */}
          {tierStyle && (
            <div className={`absolute left-3 top-3 rounded-md bg-gradient-to-r ${tierStyle.gradient} px-2.5 py-1 shadow-lg`}>
              <span className="text-[11px] font-bold tracking-wide text-white">
                {tierStyle.label}
              </span>
            </div>
          )}

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIsFavorite(!isFavorite)
            }}
            className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full shadow-lg transition-all duration-200 ${
              isFavorite 
                ? 'bg-red-500 text-white scale-110' 
                : 'bg-white/95 text-gray-500 hover:bg-white hover:text-red-500 hover:scale-110'
            }`}
          >
            <Heart className={`h-4.5 w-4.5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          {/* Photo Count */}
          {car.images && car.images.length > 1 && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 text-xs font-medium text-white">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {car.images.length}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Price */}
          <div className="mb-2">
            <span className="text-xl font-bold text-gray-900">
              {formattedPrice}
            </span>
          </div>

          {/* Title */}
          <h3 className="mb-3 line-clamp-1 text-[15px] font-semibold text-gray-800 transition-colors group-hover:text-orange-500">
            {title}
          </h3>

          {/* Info Row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] text-gray-500">
            {car.mileage !== undefined && (
              <div className="flex items-center gap-1.5">
                <Gauge className="h-4 w-4 text-gray-400" />
                <span>{car.mileage.toLocaleString()} კმ</span>
              </div>
            )}
            {car.fuelType && (
              <div className="flex items-center gap-1.5">
                <Fuel className="h-4 w-4 text-gray-400" />
                <span>{fuelTypeLabels[car.fuelType] || car.fuelType}</span>
              </div>
            )}
          </div>

          {/* Location */}
          {car.location && (
            <div className="mt-3 flex items-center gap-1.5 border-t border-gray-100 pt-3 text-[13px] text-gray-500">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="truncate">{car.location}</span>
            </div>
          )}
        </div>
      </Link>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
