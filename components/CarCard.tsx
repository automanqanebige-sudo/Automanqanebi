'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, Columns2 } from 'lucide-react'
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
  /** Admin/demo/sample listing — shown as სატესტო */
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

  const fuelLabel = t(`fuel.${car.fuelType}`) !== `fuel.${car.fuelType}` ? t(`fuel.${car.fuelType}`) : car.fuelType

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(car.id)
    onFavoriteToggle?.(car.id)
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

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat('en-US').format(mileage) + ' km'
  }

  return (
    <Link href={`/car/${car.id}`} className="block group">
      <article className="relative overflow-hidden rounded-lg border border-border bg-card transition-colors duration-200 group-hover:border-primary/40">
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
              <span className="text-muted-foreground text-sm">{t('car.noImage')}</span>
            </div>
          )}

          {/* VIP Badge */}
          {car.isVip && (
            <div className="absolute top-3 left-3 rounded-md bg-primary px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary-foreground">
              VIP
            </div>
          )}

          {/* Test vs verified seller listing */}
          {isTestListing(car) ? (
            <div
              className={`absolute left-3 rounded-md bg-amber-700/95 px-2 py-1 text-[11px] font-semibold text-white shadow-md ${
                car.isVip ? 'top-12' : 'top-3'
              }`}
            >
              {t('car.badge.test')}
            </div>
          ) : isVerifiedListing(car) ? (
            <div
              className={`absolute left-3 rounded-md bg-emerald-700/95 px-2 py-1 text-[11px] font-semibold text-white shadow-md ${
                car.isVip ? 'top-12' : 'top-3'
              }`}
            >
              {t('car.badge.verified')}
            </div>
          ) : null}

          {/* Favorite + Compare */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <button
              onClick={handleFavoriteClick}
              className="rounded-md bg-background/90 p-1.5 transition-colors hover:bg-background"
              aria-label={favorited ? t('favorites.remove') : t('favorites.add')}
            >
              <Heart
                className={`h-5 w-5 transition-colors ${
                  favorited
                    ? 'fill-red-500 text-red-500'
                    : 'text-muted-foreground hover:text-red-500'
                }`}
              />
            </button>
            <button
              onClick={handleCompareClick}
              className={`rounded-md bg-background/90 p-1.5 transition-colors hover:bg-background ${
                comparing ? 'ring-2 ring-primary' : ''
              }`}
              aria-label={comparing ? t('compare.remove') : t('compare.add')}
              title={compareHint ? t('compare.full') : comparing ? t('compare.remove') : t('compare.add')}
            >
              <Columns2
                className={`h-5 w-5 transition-colors ${
                  comparing ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-xl font-bold text-primary">
            {formatPrice(car.price)}
            {car.offerType === 'rent' && (
              <span className="ml-1 text-xs font-medium text-muted-foreground">
                / {t('filter.offer.perMonth')}
              </span>
            )}
          </p>

          {/* Title */}
          <h3 className="mt-1 line-clamp-1 text-base font-semibold text-card-foreground transition-colors group-hover:text-primary">
            {car.year} {car.brand} {car.model}
          </h3>

          {/* Location */}
          <div className="mt-2 text-sm text-muted-foreground truncate">{car.location}</div>

          <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-border pt-3 text-sm text-muted-foreground">
            <span>{formatMileage(car.mileage)}</span>
            <span>{fuelLabel}</span>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {car.createdAt && (
              <span title={t('car.postedDate')}>
                {t('car.postedDate')}: {formatListingDate(car.createdAt)}
              </span>
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
