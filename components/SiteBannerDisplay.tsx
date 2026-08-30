'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { SiteBanner } from '@/types/site-banner'
import { bannerHasMedia, bannerSizeClass } from '@/lib/site-banner-utils'
import { useLanguage } from '@/context/LanguageContext'

type SiteBannerDisplayProps = {
  banner: SiteBanner
  className?: string
}

export default function SiteBannerDisplay({ banner, className = '' }: SiteBannerDisplayProps) {
  const { t } = useLanguage()
  const sizeClass = bannerSizeClass(banner.size)
  const placeholderText = t('banner.placeholder')
  const label = banner.altText || banner.title || banner.name || placeholderText

  if (!bannerHasMedia(banner) && !banner.title) {
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden rounded-xl bg-white px-4 text-center ${sizeClass} ${className}`}
      >
        <p className="text-sm font-medium text-muted-foreground sm:text-base">{placeholderText}</p>
      </div>
    )
  }

  const inner = (
    <div
      className={`relative overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm ${sizeClass} ${className}`}
      style={banner.backgroundColor ? { backgroundColor: banner.backgroundColor } : undefined}
    >
      {banner.mediaType === 'video' && banner.videoUrl ? (
        <video
          src={banner.videoUrl}
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          aria-label={label}
        />
      ) : banner.mediaType === 'slideshow' && (banner.slideUrls?.length ?? 0) > 0 ? (
        <BannerSlideshow urls={banner.slideUrls!} alt={label} />
      ) : banner.imageUrl ? (
        <Image
          src={banner.imageUrl}
          alt={label}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 1200px"
        />
      ) : (
        <div className="flex h-full min-h-[80px] items-center justify-center bg-secondary/40 px-4 text-center text-sm font-medium text-muted-foreground sm:text-base">
          {banner.title || placeholderText}
        </div>
      )}

      {(banner.title || banner.subtitle || banner.linkLabel) && bannerHasMedia(banner) && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-3 sm:p-4">
          {banner.title && (
            <p className="text-sm font-bold text-white sm:text-base">{banner.title}</p>
          )}
          {banner.subtitle && (
            <p className="mt-0.5 line-clamp-2 text-xs text-white/90 sm:text-sm">{banner.subtitle}</p>
          )}
          {banner.linkLabel && banner.linkUrl && (
            <span className="mt-2 inline-block rounded-lg bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
              {banner.linkLabel}
            </span>
          )}
        </div>
      )}

      <span className="absolute right-2 top-2 rounded bg-black/50 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white/90">
        {t('banner.adBadge')}
      </span>
    </div>
  )

  if (banner.linkUrl) {
    return (
      <Link
        href={banner.linkUrl}
        target={banner.openInNewTab ? '_blank' : undefined}
        rel={banner.openInNewTab ? 'noopener noreferrer' : undefined}
        className="block transition-opacity hover:opacity-95"
      >
        {inner}
      </Link>
    )
  }

  return inner
}

function BannerSlideshow({ urls, alt }: { urls: string[]; alt: string }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (urls.length <= 1) return
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % urls.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [urls.length])

  const prev = () => setIndex((i) => (i - 1 + urls.length) % urls.length)
  const next = () => setIndex((i) => (i + 1) % urls.length)

  return (
    <div className="relative h-full w-full">
      <Image
        src={urls[index]!}
        alt={`${alt} ${index + 1}`}
        fill
        className="object-cover transition-opacity duration-500"
        sizes="(max-width: 768px) 100vw, 1200px"
      />
      {urls.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              prev()
            }}
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-1 text-white hover:bg-black/60"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              next()
            }}
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-1 text-white hover:bg-black/60"
            aria-label="Next slide"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
            {urls.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full ${i === index ? 'bg-white' : 'bg-white/40'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
