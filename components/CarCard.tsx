'use client'

import Link from 'next/link'
import { Calendar, MapPin, Gauge, Fuel, ArrowRight, Clock } from 'lucide-react'
import type { Car } from '@/types/car'
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
  if (km >= 1000) return `${Math.round(km / 1000)}k კმ`
  return `${km} კმ`
}

export default function CarCard({ car, index = 0 }: { car?: Car; index?: number }) {
  if (!car) return null

  const displayName = car.name || (car.brand && car.model ? `${car.brand} ${car.model}` : 'უცნობი მანქანა')
  const fullName = car.year ? `${car.year} ${displayName}` : displayName
  const tier = car.tier || 'standard'
  const showBadge = tier !== 'standard'

  return (
    <div
      className="animate-fade-in-up h-full"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <Link
        href={car.id ? `/car/${car.id}` : '#'}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5"
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
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-secondary to-secondary/50">
              <svg className="h-16 w-16 text-muted-foreground/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
              </svg>
            </div>
          )}

          {/* Tier badge */}
          {showBadge && (
            <div className={`absolute left-3 top-3 flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-lg ${tierColors[tier]}`}>
              {tierLabels[tier]}
            </div>
          )}

          {/* Time badge */}
          {car.createdAt && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-lg bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
              <Clock className="h-3 w-3" />
              {formatTimeAgo(car.createdAt)}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-4">
          {/* Title */}
          <h3 className="line-clamp-1 text-base font-semibold text-card-foreground transition-colors group-hover:text-primary">
            {fullName}
          </h3>

          {/* Price */}
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">
              {car.price ? `${car.price.toLocaleString()}` : '---'}
            </span>
            <span className="text-lg font-semibold text-primary">₾</span>
          </div>

          {/* Details */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            {car.year && (
              <div className="flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-2 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5 text-primary" />
                <span>{car.year} წ.</span>
              </div>
            )}
            {car.mileage !== undefined && (
              <div className="flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-2 text-xs text-muted-foreground">
                <Gauge className="h-3.5 w-3.5 text-primary" />
                <span>{formatMileage(car.mileage)}</span>
              </div>
            )}
            {car.fuelType && (
              <div className="flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-2 text-xs text-muted-foreground">
                <Fuel className="h-3.5 w-3.5 text-primary" />
                <span>{fuelTypeLabels[car.fuelType] || car.fuelType}</span>
              </div>
            )}
            {car.location && (
              <div className="flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-2 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span className="truncate">{car.location}</span>
              </div>
            )}
          </div>

          {/* Action button */}
          <div className="mt-auto pt-4">
            <div className="flex items-center justify-center gap-2 rounded-xl bg-primary/10 py-2.5 text-sm font-medium text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground">
              დეტალურად
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
