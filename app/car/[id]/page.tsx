'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { ArrowLeft, Calendar, DollarSign, Loader2, Heart, Share2 } from 'lucide-react'

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

export default function CarPage({ params }: { params: { id: string } }) {
  const [car, setCar] = useState<Car | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/cars/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setCar(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">იტვირთება...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32">
          <h2 className="text-xl font-bold text-foreground">ავტომობილი ვერ მოიძებნა</h2>
          <Link
            href="/"
            className="mt-4 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            მთავარზე დაბრუნება
          </Link>
        </div>
      </div>
    )
  }

  const displayName = car.name || (car.brand && car.model ? `${car.brand} ${car.model}` : 'უცნობი მანქანა')

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-5xl px-4 py-10 lg:px-8">
        {/* Back link */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          უკან დაბრუნება
        </Link>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Image */}
          <div className="lg:col-span-3">
            <div className="overflow-hidden rounded-2xl border border-border bg-secondary">
              {car.image ? (
                <img
                  src={car.image}
                  alt={displayName}
                  className="aspect-[16/10] w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[16/10] w-full items-center justify-center">
                  <svg className="h-20 w-20 text-muted-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h1 className="text-2xl font-bold text-foreground">{displayName}</h1>

              {car.year && (
                <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{car.year} წელი</span>
                </div>
              )}

              {/* Price */}
              <div className="mt-6 rounded-xl bg-primary/10 p-4">
                <p className="text-xs font-medium text-primary">ფასი</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <DollarSign className="h-6 w-6 text-primary" />
                  <span className="text-3xl font-bold text-foreground">
                    {car.price ? car.price.toLocaleString() : '---'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                  <Heart className="h-4 w-4" />
                  ფავორიტებში
                </button>
                <button className="flex h-11 w-11 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                  <Share2 className="h-4 w-4" />
                </button>
              </div>

              {/* Description */}
              {car.description && (
                <div className="mt-6 border-t border-border pt-6">
                  <h3 className="text-sm font-semibold text-foreground">აღწერა</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {car.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
