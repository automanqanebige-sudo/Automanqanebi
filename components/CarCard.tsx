'use client'

import Link from 'next/link'
import { Calendar, MapPin, Gauge, Fuel, Eye, Clock } from 'lucide-react'
import type { Car, ListingTier } from '@/types/car'
import { fuelTypeLabels, tierColors, tierLabels } from '@/types/car'

function formatTimeAgo(date: Date | string | undefined): string {
  if (!date) return ''
  const now = new Date()
  const past = new Date(date)
  const diffMs = now.getTime() - past.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'დღეს'
  if (diffDays === 1) return 'გუშინ'
  return `${diffDays} დღის წინ`
}

function formatMileage(km: number | undefined): string {
  if (!km) return ''
  if (km >= 1000) return `${Math.round(km / 1000)}k`
  return `${km}`
}

export default function CarCard({ car, index = 0 }: { car?: Car; index?: number }) {
  if (!car) return null

  const displayName = car.name || (car.brand && car.model ? `${car.brand} ${car.model}` : 'უცნობი მანქანა')
  const fullName = car.year ? `${car.year} ${displayName}` : displayName
  const tier = car.tier || 'standard'
  const showBadge = tier !== 'standard'

  return (
    <div
      className="animate-fade-in-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <Link
        href={car.id ? `/car/${car.id}` : '#'}
        className="group block overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
      >
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
          {car.image ? (
            <img
              src={car.image}
              alt={displayName}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <svg className="h-16 w-16 text-muted-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
              </svg>
            </div>
          )}

          {/* Tier badge */}
          {showBadge && (
            <div className={`absolute left-3 top-3 flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-bold text-white ${tierColors[tier]}`}>
              {tierLabels[tier]}
              {car.views && (
                <span className="flex items-center gap-0.5 rounded bg-black/20 px-1 py-0.5 text-[10px]">
                  {car.views}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="line-clamp-1 text-base font-semibold text-card-foreground group-hover:text-primary transition-colors">
            {fullName}
          </h3>

          {/* Price */}
          <div className="mt-2 text-xl font-bold text-foreground">
            {car.price ? `${car.price.toLocaleString()} ₾` : '---'}
          </div>

          {/* Details row */}
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
            {car.year && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {car.year}
              </span>
            )}
            {car.mileage !== undefined && (
              <span className="flex items-center gap-1">
                <Gauge className="h-3.5 w-3.5" />
                {formatMileage(car.mileage)}
              </span>
            )}
            {car.fuelType && (
              <span className="flex items-center gap-1">
                <Fuel className="h-3.5 w-3.5" />
                {fuelTypeLabels[car.fuelType] || car.fuelType}
              </span>
            )}
            {car.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {car.location}
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
            {car.createdAt && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {formatTimeAgo(car.createdAt)}
              </span>
            )}
            <span className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <Eye className="h-3.5 w-3.5" />
              ნახვა
            </span>
          </div>
        </div>
      </Link>
    </div>
  )
}
