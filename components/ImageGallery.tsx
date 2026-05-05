'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react'

interface ImageGalleryProps {
  images: string[]
  alt: string
}

export default function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const goToPrevious = useCallback(() => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }, [images.length])

  const goToNext = useCallback(() => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }, [images.length])

  return (
    <>
      {/* Main Gallery */}
      <div className="flex flex-col gap-3">
        {/* Main Image */}
        <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-muted group cursor-pointer" onClick={() => setLightboxOpen(true)}>
          <Image
            src={images[selectedIndex]}
            alt={`${alt} - Photo ${selectedIndex + 1}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 60vw"
            priority
          />

          {/* Zoom hint overlay */}
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-foreground/60 text-background rounded-full p-3">
              <ZoomIn className="h-6 w-6" />
            </div>
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goToPrevious() }}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background text-foreground shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goToNext() }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background text-foreground shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-3 right-3 bg-foreground/60 text-background px-3 py-1 rounded-full text-sm font-medium">
            {selectedIndex + 1} / {images.length}
          </div>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`relative flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden transition-all duration-200 ${
                  index === selectedIndex
                    ? 'ring-2 ring-primary ring-offset-2 ring-offset-background opacity-100'
                    : 'opacity-60 hover:opacity-90'
                }`}
                aria-label={`View photo ${index + 1}`}
              >
                <Image
                  src={img}
                  alt={`${alt} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-foreground/95 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          {/* Close Button */}
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-background/20 hover:bg-background/40 text-background transition-colors z-10"
            aria-label="Close lightbox"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Lightbox Image */}
          <div className="relative w-full h-full max-w-5xl max-h-[85vh] m-8" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[selectedIndex]}
              alt={`${alt} - Photo ${selectedIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          {/* Lightbox Navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goToPrevious() }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/20 hover:bg-background/40 text-background transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goToNext() }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/20 hover:bg-background/40 text-background transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            </>
          )}

          {/* Lightbox Counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-background/20 text-background px-4 py-2 rounded-full text-sm font-medium">
            {selectedIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  )
}
