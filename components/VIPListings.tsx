'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Crown, ChevronLeft, ChevronRight, Heart, Gauge, MapPin, Fuel, Sparkles, Star } from 'lucide-react'
import type { Car } from '@/types/car'
import { useCurrency } from '@/context/CurrencyContext'

interface VIPListingsProps {
  cars: Car[]
}

export default function VIPListings({ cars }: VIPListingsProps) {
  const t = useTranslations()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const scrollAmount = 400
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    })
    setTimeout(checkScroll, 300)
  }

  if (cars.length === 0) return null

  return (
    <section className="relative">
      {/* Background glow effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 top-0 h-96 w-1/2 rounded-full bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-transparent blur-3xl" />
        <div className="absolute -right-1/4 top-0 h-96 w-1/2 rounded-full bg-gradient-to-l from-purple-500/10 via-violet-500/10 to-transparent blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-8 lg:px-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 shadow-xl shadow-orange-500/30">
                <Crown className="h-7 w-7 text-white" />
              </div>
              <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white">
                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-white">{t('vip.title')}</h2>
                <span className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 text-xs font-bold text-white">
                  PREMIUM
                </span>
              </div>
              <p className="mt-1 text-slate-400">{t('vip.subtitle')}</p>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`flex h-12 w-12 items-center justify-center rounded-xl border transition-all duration-200 ${
                canScrollLeft
                  ? 'border-white/20 bg-white/10 text-white hover:bg-white/20'
                  : 'cursor-not-allowed border-white/5 bg-white/5 text-slate-600'
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`flex h-12 w-12 items-center justify-center rounded-xl border transition-all duration-200 ${
                canScrollRight
                  ? 'border-white/20 bg-white/10 text-white hover:bg-white/20'
                  : 'cursor-not-allowed border-white/5 bg-white/5 text-slate-600'
              }`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable container */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="scrollbar-hide -mx-4 flex gap-5 overflow-x-auto px-4 pb-4"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {cars.map((car, index) => (
            <VIPCard key={car.id || index} car={car} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

function VIPCard({ car, index }: { car: Car; index: number }) {
  const t = useTranslations()
  const { currency, convertPrice } = useCurrency()
  const [isFavorite, setIsFavorite] = useState(false)

  const title = car.year
    ? `${car.year} ${car.brand || ''} ${car.model || ''}`.trim()
    : car.name || `${car.brand || ''} ${car.model || ''}`.trim() || t('common.unknown')

  const price = car.price ? convertPrice(car.price) : null
  const priceText = price
    ? `${price.toLocaleString()} ${currency === 'GEL' ? '₾' : '$'}`
    : t('car.negotiable')

  const isSuper = car.tier === 'platinum'

  return (
    <div
      className="group w-[340px] flex-shrink-0 animate-fade-in-up"
      style={{ 
        animationDelay: `${index * 100}ms`,
        scrollSnapAlign: 'start'
      }}
    >
      <Link href={`/car/${car.id || ''}`} className="block">
        <div className={`overflow-hidden rounded-3xl border-2 bg-[#1e293b] transition-all duration-300 ${
          isSuper 
            ? 'border-purple-500/50 shadow-2xl shadow-purple-500/20 hover:border-purple-400 hover:shadow-purple-500/30'
            : 'border-orange-500/50 shadow-2xl shadow-orange-500/20 hover:border-orange-400 hover:shadow-orange-500/30'
        } hover:-translate-y-2`}>
          
          {/* Image section - larger */}
          <div className="relative aspect-[16/10] overflow-hidden">
            {car.image ? (
              <img
                src={car.image}
                alt={title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800">
                <Gauge className="h-20 w-20 text-slate-600" />
              </div>
            )}

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className={`absolute inset-0 bg-gradient-to-br opacity-20 ${
              isSuper ? 'from-purple-500 to-transparent' : 'from-orange-500 to-transparent'
            }`} />

            {/* VIP Badge - prominent */}
            <div className="absolute left-4 top-4">
              <div className={`flex items-center gap-2 rounded-xl px-4 py-2 backdrop-blur-md ${
                isSuper 
                  ? 'bg-gradient-to-r from-violet-600 to-purple-600 shadow-lg shadow-purple-500/50'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg shadow-orange-500/50'
              }`}>
                {isSuper ? (
                  <Sparkles className="h-4 w-4 text-white" />
                ) : (
                  <Crown className="h-4 w-4 text-white" />
                )}
                <span className="text-sm font-bold text-white">
                  {isSuper ? t('car.superVip') : t('car.vip')}
                </span>
              </div>
            </div>

            {/* Favorite button */}
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setIsFavorite(!isFavorite)
              }}
              className={`absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 ${
                isFavorite
                  ? 'scale-110 bg-red-500 text-white'
                  : 'bg-black/50 text-white hover:scale-110 hover:bg-red-500'
              }`}
            >
              <Heart className={`h-6 w-6 transition-transform ${isFavorite ? 'scale-110 fill-current' : ''}`} />
            </button>

            {/* Price - large and prominent */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className={`inline-block rounded-2xl px-5 py-3 ${
                isSuper 
                  ? 'bg-gradient-to-r from-violet-600 to-purple-600'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500'
              } shadow-xl`}>
                <span className="text-2xl font-bold text-white">{priceText}</span>
              </div>
            </div>
          </div>

          {/* Content section */}
          <div className="p-5">
            {/* Title */}
            <h3 className="mb-4 text-xl font-bold text-white transition-colors group-hover:text-orange-400">
              {title}
            </h3>

            {/* Details - horizontal layout */}
            <div className="flex flex-wrap gap-4">
              {car.mileage !== undefined && (
                <div className="flex items-center gap-2 text-slate-400">
                  <Gauge className="h-4 w-4" />
                  <span className="text-sm">{car.mileage.toLocaleString()} {t('common.km')}</span>
                </div>
              )}

              {car.fuelType && (
                <div className="flex items-center gap-2 text-slate-400">
                  <Fuel className="h-4 w-4" />
                  <span className="text-sm">{t(`filters.${car.fuelType.toLowerCase()}`)}</span>
                </div>
              )}

              {car.location && (
                <div className="flex items-center gap-2 text-slate-400">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{car.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
