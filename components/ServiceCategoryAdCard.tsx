'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, MapPin, Megaphone, Phone } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useCurrency } from '@/context/CurrencyContext'
import type { ServiceCategoryAd } from '@/types/service-category-ad'
import type { ServiceCategory } from '@/types/service'

type ServiceCategoryAdCardProps = {
  ad: ServiceCategoryAd
  categoryLabel: (cat: ServiceCategory) => string
}

export default function ServiceCategoryAdCard({ ad, categoryLabel }: ServiceCategoryAdCardProps) {
  const { t } = useLanguage()
  const { formatPrice } = useCurrency()

  const displayPrice = ad.newPrice ?? ad.price
  const isExternal = ad.linkUrl?.startsWith('http')
  const wrapperClass =
    'group relative block overflow-hidden rounded-xl border border-primary/25 bg-gradient-to-br from-card to-primary/5 shadow-sm transition-all hover:border-primary/40 hover:shadow-lg'

  const inner = (
    <>
      <div className="absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary-foreground shadow-sm">
        <Megaphone className="h-3 w-3" />
        {t('services.adBadge')}
      </div>

      {ad.image && (
        <div className="relative aspect-[16/9] bg-muted">
          <Image
            src={ad.image}
            alt={ad.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      )}

      <div className="p-5">
        <div className="mb-3 flex items-start justify-between gap-2 pr-16">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary">{ad.name}</h3>
          {ad.category !== 'all' && (
            <span className="shrink-0 rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
              {categoryLabel(ad.category)}
            </span>
          )}
        </div>

        {displayPrice != null && (
          <div className="mb-3 flex flex-wrap items-baseline gap-2">
            <span className="text-lg font-bold text-primary">{formatPrice(displayPrice)}</span>
            {ad.oldPrice != null && ad.oldPrice > displayPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(ad.oldPrice)}
              </span>
            )}
            {ad.promoUntil && (
              <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
                {t('services.promoUntil')}: {ad.promoUntil}
              </span>
            )}
          </div>
        )}

        {ad.description && (
          <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">{ad.description}</p>
        )}

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            {ad.location}
          </div>
          <a
            href={`tel:${ad.phone.replace(/\s/g, '')}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 font-medium text-primary hover:underline"
          >
            <Phone className="h-4 w-4 shrink-0" />
            {ad.phone}
          </a>
          {ad.linkUrl && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
              <ExternalLink className="h-3.5 w-3.5" />
              {isExternal ? t('services.adExternalLink') : t('services.adMore')}
            </span>
          )}
        </div>
      </div>
    </>
  )

  if (ad.linkUrl) {
    if (isExternal) {
      return (
        <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer" className={wrapperClass}>
          {inner}
        </a>
      )
    }
    return (
      <Link href={ad.linkUrl} className={wrapperClass}>
        {inner}
      </Link>
    )
  }

  return <article className={wrapperClass}>{inner}</article>
}
