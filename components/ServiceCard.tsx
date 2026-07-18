'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Phone } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useCurrency } from '@/context/CurrencyContext'
import type { Service, ServiceCategory } from '@/types/service'
import { RENTAL_TRANSPORT_EMOJI } from '@/lib/filter-emojis'
import { getServiceImages, primaryServiceImage } from '@/lib/service-images'

type ServiceCardProps = {
  service: Service
  categoryLabel: (cat: ServiceCategory) => string
}

export default function ServiceCard({ service, categoryLabel }: ServiceCardProps) {
  const { t } = useLanguage()
  const { formatPrice } = useCurrency()

  const displayPrice = service.newPrice ?? service.price
  const bio = service.bio || service.description
  const coverImage = primaryServiceImage(service)
  const imageCount = getServiceImages(service).length
  const mapUrl =
    service.latitude != null && service.longitude != null
      ? `https://www.openstreetmap.org/?mlat=${service.latitude}&mlon=${service.longitude}#map=16/${service.latitude}/${service.longitude}`
      : null

  return (
    <Link
      href={`/services/${service.id}`}
      className="group block overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-lg"
    >
      {coverImage && (
        <div className="relative aspect-[16/9] bg-muted">
          <Image
            src={coverImage}
            alt={service.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          {imageCount > 1 && (
            <span className="absolute bottom-2 right-2 rounded-full bg-background/90 px-2 py-0.5 text-[10px] font-semibold text-foreground shadow-sm">
              {imageCount} {t('upload.photos')}
            </span>
          )}
        </div>
      )}

      <div className="p-5">
        <div className="mb-3 flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary">
            {service.name}
          </h3>
          <span className="shrink-0 rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
            {categoryLabel(service.category)}
          </span>
        </div>

        {displayPrice != null && (
          <div className="mb-3 flex flex-wrap items-baseline gap-2">
            <span className="text-lg font-bold text-primary">
              {formatPrice(displayPrice)}
              {service.category === 'rental' && service.rentalPricePerDay != null && (
                <span className="ml-1 text-xs font-medium opacity-90">/ {t('services.rentalPerDay')}</span>
              )}
            </span>
            {service.oldPrice != null && service.oldPrice > displayPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(service.oldPrice)}
              </span>
            )}
            {service.promoUntil && (
              <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
                {t('services.promoUntil')}: {service.promoUntil}
              </span>
            )}
          </div>
        )}

        {service.category === 'rental' && (service.rentalTransportTypes?.length ?? 0) > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {service.rentalTransportTypes!.map((type) => (
              <span
                key={type}
                className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
              >
                {RENTAL_TRANSPORT_EMOJI[type]} {t(`services.rentalTransport.${type}`)}
              </span>
            ))}
            {service.withDriver && (
              <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400">
                🧑‍✈️ {t('services.rentalWithDriverYes')}
              </span>
            )}
          </div>
        )}

        {bio && <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">{bio}</p>}

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            {service.location}
          </div>
          {mapUrl && (
            <span
              role="presentation"
              onClick={(e) => e.stopPropagation()}
              className="inline-block"
            >
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
              >
                <MapPin className="h-3.5 w-3.5" />
                {t('services.viewOnMap')}
              </a>
            </span>
          )}
          <span
            role="presentation"
            onClick={(e) => e.stopPropagation()}
            className="block"
          >
            <a
              href={`tel:${service.phone.replace(/\s/g, '')}`}
              className="flex items-center gap-2 font-medium text-primary hover:underline"
            >
              <Phone className="h-4 w-4 shrink-0" />
              {service.phone}
            </a>
          </span>
        </div>
      </div>
    </Link>
  )
}
