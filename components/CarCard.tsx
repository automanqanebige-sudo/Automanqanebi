'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, Columns2, MapPin, Gauge, Fuel } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useCurrency } from '@/context/CurrencyContext'
import { useFavorites } from '@/context/FavoritesContext'
import { useCompare } from '@/context/CompareContext'
import { formatListingDate } from '@/lib/listing-lifecycle'
import { isTestListing, isVerifiedListing } from '@/lib/listing-trust'

export type Car = {
  id: string
  image: string
  images?: string[]
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
  category?: string
  vehicleGroup?: string
  bodyType?: string
  driveType?: string
  steering?: string
  engineVolume?: number
  cylinders?: number
  doors?: number
  color?: string
  listingType?:
    | 'vip'
    | 'vip_plus'
    | 'super_vip'
    | 'silver'
    | 'gold'
    | 'platinum'
    | 'dealer'
    | 'salon'
    | 'standard'
  offerType?: 'sale' | 'rent'
  importRegion?: string
  customsStatus?: string
  features?: string[]
  description?: string
  phone?: string
  contactWhatsApp?: boolean
  contactViber?: boolean
  userId?: string
  userEmail?: string
  isTest?: boolean
  createdAt?: string
  updatedAt?: string
  expiresAt?: string
  bumpedAt?: string
  views?: number
  favoriteCount?: number
  vipExpiresAt?: string
  renewalNotifiedAt?: string
  inAppRenewalNotifiedAt?: string
}

interface CarCardProps {
  car: Car
  onFavoriteToggle?: (id: string) => void
}

export default function CarCard({ car, onFavoriteToggle }: CarCardProps) {
  const { t } = useLanguage()
  const { formatPrice } = useCurrency()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { isComparing, toggleCompare } = useCompare()
  const favorited = isFavorite(car.id)
  const comparing = isComparing(car.id)
  const [imageError, setImageError] = useState(false)
  const [compareHint, setCompareHint] = useState(false)
  const [heartAnim, setHeartAnim] = useState(false)

  const fuelLabel =
    t(`fuel.${car.fuelType}`) !== `fuel.${car.fuelType}` ? t(`fuel.${car.fuelType}`) : car.fuelType

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(car.id)
    onFavoriteToggle?.(car.id)
    setHeartAnim(true)
    setTimeout(() => setHeartAnim(false), 350)
  }

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const res = toggleCompare(car.id)
    if (!res.ok && res.reason === 'full') {
      setCompareHint(true)
      setTimeout(() => setCompareHint(false), 2000)
    }
  }

  const formatMileage = (mileage: number) =>
    new Intl.NumberFormat('en-US').format(mileage) + ' km'

  return (
    <Link href={`/car/${car.id}`} className="group block">
      <article className="card-premium overflow-hidden">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {!imageError ? (
            <Image
              src={car.image}
              alt={`${car.year} ${car.brand} ${car.model}`}
              fill
              className="object-cover transition-transform duration-500 ease-premium group-hover:scale-[1.04]"
              onError={() => setImageError(true)}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <span className="text-sm text-muted-foreground">{t('car.noImage')}</span>
            </div>
          )}

          {/* Gradient overlay on hover */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Badges */}
          {car.isVip && (
            <div className="badge-premium absolute left-3 top-3 bg-primary text-primary-foreground shadow-sm">
              VIP
            </div>
          )}

          {isTestListing(car) ? (
            <div
              className={`badge-premium absolute left-3 bg-amber-600 text-white shadow-sm ${
                car.isVip ? 'top-10' : 'top-3'
              }`}
            >
              {t('car.badge.test')}
            </div>
          ) : isVerifiedListing(car) ? (
            <div
              className={`badge-premium absolute left-3 bg-emerald-600 text-white shadow-sm ${
                car.isVip ? 'top-10' : 'top-3'
              }`}
            >
              {t('car.badge.verified')}
            </div>
          ) : null}

          {/* Actions */}
          <div className="absolute right-3 top-3 flex flex-col gap-2">
            <button
              onClick={handleFavoriteClick}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface/90 shadow-sm backdrop-blur-sm transition-all hover:bg-surface hover:shadow-md active:scale-95"
              aria-label={favorited ? t('favorites.remove') : t('favorites.add')}
            >
              <Heart
                className={`h-[18px] w-[18px] transition-colors ${
                  heartAnim ? 'animate-heart-pop' : ''
                } ${
                  favorited
                    ? 'fill-red-500 text-red-500'
                    : 'text-muted-foreground hover:text-red-500'
                }`}
              />
            </button>
            <button
              onClick={handleCompareClick}
              className={`flex h-9 w-9 items-center justify-center rounded-xl bg-surface/90 shadow-sm backdrop-blur-sm transition-all hover:bg-surface hover:shadow-md active:scale-95 ${
                comparing ? 'ring-2 ring-primary ring-offset-1' : ''
              }`}
              aria-label={comparing ? t('compare.remove') : t('compare.add')}
              title={compareHint ? t('compare.full') : comparing ? t('compare.remove') : t('compare.add')}
            >
              <Columns2
                className={`h-[18px] w-[18px] transition-colors ${
                  comparing ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="price-display">
            {formatPrice(car.price)}
            {car.offerType === 'rent' && (
              <span className="ml-1 text-xs font-medium text-muted-foreground">
                / {t('filter.offer.perMonth')}
              </span>
            )}
          </p>

          <h3 className="mt-1 line-clamp-1 text-base font-semibold text-card-foreground transition-colors group-hover:text-primary">
            {car.year} {car.brand} {car.model}
          </h3>

          <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-primary/60" />
            <span className="truncate">{car.location}</span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-border pt-3">
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Gauge className="h-3.5 w-3.5 text-primary/50" />
              {formatMileage(car.mileage)}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Fuel className="h-3.5 w-3.5 text-primary/50" />
              {fuelLabel}
            </span>
            {car.transmission && (
              <span className="text-xs text-muted-foreground">{car.transmission}</span>
            )}
          </div>

          <div className="mt-2.5 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground/80">
            {car.createdAt && (
              <span>{formatListingDate(car.createdAt)}</span>
            )}
            <span>
              {car.views ?? 0} {t('car.views')}
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
