'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, ImagePlus, X, ZoomIn } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

type CarImageGalleryProps = {
  images: string[]
  alt: string
  badges?: React.ReactNode
}

export default function CarImageGallery({ images, alt, badges }: CarImageGalleryProps) {
  const { t } = useLanguage()
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const [imageError, setImageError] = useState<Record<number, boolean>>({})

  const urls = images.length > 0 ? images : []
  const activeUrl = urls[activeIndex]
  const imagesKey = urls.join('|')

  useEffect(() => {
    setActiveIndex(0)
    setImageError({})
  }, [imagesKey])

  const go = (delta: number) => {
    if (urls.length <= 1) return
    setActiveIndex((i) => (i + delta + urls.length) % urls.length)
  }

  if (!activeUrl) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-border bg-muted text-muted-foreground">
        {t('car.noImage')}
      </div>
    )
  }

  return (
    <>
      <div className="space-y-3">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-muted">
          {!imageError[activeIndex] ? (
            <Image
              src={activeUrl}
              alt={`${alt} — ${activeIndex + 1}/${urls.length}`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              onError={() => setImageError((prev) => ({ ...prev, [activeIndex]: true }))}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              {t('car.noImage')}
            </div>
          )}

          {badges}

          {urls.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-background/90 p-2 shadow-md transition-colors hover:bg-background"
                aria-label={t('gallery.prev')}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-background/90 p-2 shadow-md transition-colors hover:bg-background"
                aria-label={t('gallery.next')}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <span className="absolute bottom-3 right-3 rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-foreground shadow-md">
                {activeIndex + 1} / {urls.length}
              </span>
            </>
          )}

          <button
            type="button"
            onClick={() => setLightbox(true)}
            className="absolute bottom-3 left-3 rounded-full bg-background/90 p-2 shadow-md transition-colors hover:bg-background"
            aria-label={t('gallery.zoom')}
          >
            <ZoomIn className="h-5 w-5" />
          </button>
        </div>

        {urls.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {urls.map((url, index) => (
              <button
                key={`${url}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                  index === activeIndex ? 'border-primary' : 'border-border hover:border-primary/40'
                }`}
              >
                <Image
                  src={url}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="96px"
                  unoptimized={url.startsWith('blob:')}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={t('gallery.lightbox')}
          onClick={() => setLightbox(false)}
        >
          <button
            type="button"
            onClick={() => setLightbox(false)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label={t('gallery.close')}
          >
            <X className="h-6 w-6" />
          </button>

          {urls.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  go(-1)
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
                aria-label={t('gallery.prev')}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  go(1)
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
                aria-label={t('gallery.next')}
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <div
            className="relative h-[min(80vh,720px)] w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={activeUrl}
              alt={alt}
              fill
              className="object-contain"
              sizes="100vw"
              unoptimized={activeUrl.startsWith('blob:')}
            />
          </div>
        </div>
      )}
    </>
  )
}
