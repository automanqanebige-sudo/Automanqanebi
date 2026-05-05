'use client'

import { useRef } from 'react'
import { ChevronLeft, ChevronRight, Crown, Sparkles } from 'lucide-react'
import VipCarCard from './VipCarCard'
import { Car } from './CarCard'

interface VipListingsSectionProps {
  cars: Car[]
  onFavoriteToggle?: (id: string) => void
}

export default function VipListingsSection({ cars, onFavoriteToggle }: VipListingsSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return
    
    const scrollAmount = 400
    const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount)
    
    scrollContainerRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    })
  }

  if (cars.length === 0) return null

  return (
    <section className="relative py-10 overflow-hidden">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/80 via-background to-amber-50/50" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
      
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-amber-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-amber-400/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
                VIP Listings
                <Sparkles className="h-5 w-5 text-amber-500" />
              </h2>
              <p className="text-muted-foreground mt-0.5">Premium vehicles from verified sellers</p>
            </div>
          </div>

          {/* Navigation Arrows - Desktop */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-3 rounded-xl bg-card border border-border hover:border-amber-300 hover:bg-amber-50 transition-all duration-200 shadow-sm hover:shadow-md group"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5 text-muted-foreground group-hover:text-amber-600 transition-colors" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-3 rounded-xl bg-card border border-border hover:border-amber-300 hover:bg-amber-50 transition-all duration-200 shadow-sm hover:shadow-md group"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-amber-600 transition-colors" />
            </button>
          </div>
        </div>

        {/* Scrollable Container */}
        <div className="relative">
          {/* Left Fade Gradient */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-amber-50/80 to-transparent z-10 pointer-events-none" />
          
          {/* Right Fade Gradient */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-amber-50/80 to-transparent z-10 pointer-events-none" />

          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-4 pt-2 px-2 scroll-smooth scrollbar-hide"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {cars.map((car) => (
              <VipCarCard 
                key={car.id} 
                car={car} 
                onFavoriteToggle={onFavoriteToggle}
              />
            ))}
          </div>
        </div>

        {/* View All Button */}
        <div className="mt-8 text-center">
          <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300 hover:-translate-y-0.5">
            <Crown className="h-4 w-4" />
            View All VIP Listings
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
