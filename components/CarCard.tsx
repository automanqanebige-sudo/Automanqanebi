'use client'

import Link from 'next/link'
import { Calendar, DollarSign, Eye } from 'lucide-react'
import { motion } from 'framer-motion'

type Car = {
  id?: string
  name?: string
  brand?: string
  model?: string
  price?: number
  image?: string
  year?: number
  description?: string
}

export default function CarCard({ car, index = 0 }: { car?: Car; index?: number }) {
  if (!car) return null

  const displayName = car.name || (car.brand && car.model ? `${car.brand} ${car.model}` : 'უცნობი მანქანა')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
    >
      <Link
        href={car.id ? `/car/${car.id}` : '#'}
        className="group block overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
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
            <div className="flex h-full w-full items-center justify-center">
              <svg className="h-16 w-16 text-muted-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
              </svg>
            </div>
          )}

          {/* Year badge */}
          {car.year && (
            <div className="absolute left-3 top-3 flex items-center gap-1 rounded-md bg-background/80 px-2 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
              <Calendar className="h-3 w-3" />
              {car.year}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-base font-semibold text-card-foreground group-hover:text-primary transition-colors">
            {displayName}
          </h3>

          {car.description && (
            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {car.description}
            </p>
          )}

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-primary" />
              <span className="text-lg font-bold text-foreground">
                {car.price ? car.price.toLocaleString() : '---'}
              </span>
            </div>

            <span className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <Eye className="h-3.5 w-3.5" />
              ნახვა
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
