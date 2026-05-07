'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { ArrowLeft, Calendar, Loader2, Heart, Share2, Phone, MapPin, Gauge, Fuel, Settings, Eye, Clock, GitCompare } from 'lucide-react'
import type { Car } from '@/types/car'
import { tierColors, tierLabels } from '@/types/car'
import { useTranslations } from 'next-intl'

export default function CarPage({ params }: { params: { id: string } }) {
  const t = useTranslations()
  const [car, setCar] = useState<Car | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [timeAgo, setTimeAgo] = useState('')

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setLoading(true)
    fetch(`/api/cars/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setCar(data)
        setLoading(false)
        if (data?.createdAt) {
          const now = new Date()
          const past = new Date(data.createdAt)
          const diffMs = now.getTime() - past.getTime()
          const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
          if (diffDays === 0) setTimeAgo(t('common.today'))
          else if (diffDays === 1) setTimeAgo(t('common.yesterday'))
          else setTimeAgo(`${diffDays} ${t('common.daysAgo')}`)
        }
      })
      .catch(() => setLoading(false))
  }, [params.id, t])

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
  }

  const shareCar = () => {
    if (navigator.share) {
      navigator.share({
        title: car?.name || t('car.unknownCar'),
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert(t('common.linkCopied'))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">{t('common.loading')}</p>
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
          <h2 className="text-xl font-bold text-foreground">{t('car.notFound')}</h2>
          <Link
            href="/"
            className="mt-4 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t('common.backToHome')}
          </Link>
        </div>
      </div>
    )
  }

  const displayName = car.name || (car.brand && car.model ? `${car.brand} ${car.model}` : t('car.unknownCar'))
  const fullName = car.year ? `${car.year} ${displayName}` : displayName
  const tier = car.tier || 'standard'
  const showBadge = tier !== 'standard'

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('common.back')}
        </Link>

        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-secondary">
              {showBadge && (
                <div className={`absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-bold text-white ${tierColors[tier]}`}>
                  {tierLabels[tier]}
                  {car.views && (
                    <span className="flex items-center gap-1 rounded bg-black/20 px-1.5 py-0.5 text-xs">
                      <Eye className="h-3 w-3" />
                      {car.views}
                    </span>
                  )}
                </div>
              )}
              
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

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {car.year && (
                <div className="rounded-xl border border-border bg-card p-4">
                  <Calendar className="h-5 w-5 text-primary" />
                  <p className="mt-2 text-lg font-bold text-foreground">{car.year}</p>
                  <p className="text-xs text-muted-foreground">{t('car.year')}</p>
                </div>
              )}
              {car.mileage !== undefined && (
                <div className="rounded-xl border border-border bg-card p-4">
                  <Gauge className="h-5 w-5 text-primary" />
                  <p className="mt-2 text-lg font-bold text-foreground">{car.mileage.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{t('car.mileageKm')}</p>
                </div>
              )}
              {car.fuelType && (
                <div className="rounded-xl border border-border bg-card p-4">
                  <Fuel className="h-5 w-5 text-primary" />
                  <p className="mt-2 text-lg font-bold text-foreground">{t(`filters.fuelTypes.${car.fuelType}`)}</p>
                  <p className="text-xs text-muted-foreground">{t('car.fuelType')}</p>
                </div>
              )}
              {car.transmission && (
                <div className="rounded-xl border border-border bg-card p-4">
                  <Settings className="h-5 w-5 text-primary" />
                  <p className="mt-2 text-lg font-bold text-foreground">
                    {car.transmission === 'Automatic' ? t('filters.transmissionTypes.automatic') : t('filters.transmissionTypes.manual')}
                  </p>
                  <p className="text-xs text-muted-foreground">{t('car.transmission')}</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-4">
              <div className="rounded-2xl border border-border bg-card p-6">
                <h1 className="text-2xl font-bold text-foreground">{fullName}</h1>

                {car.location && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{car.location}</span>
                  </div>
                )}

                {mounted && timeAgo && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{t('car.addedTime')} {timeAgo}</span>
                  </div>
                )}

                <div className="mt-6 rounded-xl bg-primary/10 p-4">
                  <p className="text-xs font-medium text-primary">{t('car.price')}</p>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-foreground">
                      {car.price ? car.price.toLocaleString() : '---'}
                    </span>
                    <span className="text-lg text-muted-foreground">$</span>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button 
                    onClick={toggleFavorite}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${
                      isFavorite 
                        ? 'bg-rose-500 text-white' 
                        : 'bg-primary text-primary-foreground hover:bg-primary/90'
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                    {isFavorite ? t('favorites.inFavorites') : t('favorites.add')}
                  </button>
                  <button 
                    onClick={shareCar}
                    className="flex h-12 w-12 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>

                <Link
                  href="/compare"
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-border py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <GitCompare className="h-4 w-4" />
                  {t('compare.compareWith')}
                </Link>
              </div>

              {car.phone && (
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="text-sm font-semibold text-foreground">{t('car.contactSeller')}</h3>
                  <a
                    href={`tel:${car.phone}`}
                    className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
                  >
                    <Phone className="h-4 w-4" />
                    {car.phone}
                  </a>
                </div>
              )}

              {car.description && (
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="text-sm font-semibold text-foreground">{t('car.description')}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
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
