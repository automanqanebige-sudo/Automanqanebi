'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  Crown,
  Fuel,
  Gauge,
  Heart,
  MapPin,
  MessageCircle,
  Settings2,
  Calendar,
} from 'lucide-react'
import type { Car } from '@/components/CarCard'
import { getCarById } from '@/data/cars'
import { useLanguage } from '@/context/LanguageContext'

export default function CarPage({ params }: { params: { id: string } }) {
  const { t } = useLanguage()
  const [car, setCar] = useState<Car | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    const found = getCarById(params.id)
    if (found) {
      setCar(found)
      setIsFavorite(Boolean(found.isFavorite))
      setLoading(false)
      return
    }

    fetch(`/api/cars/${params.id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setCar(data)
          setIsFavorite(Boolean(data.isFavorite))
        }
      })
      .finally(() => setLoading(false))
  }, [params.id])

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)

  const formatMileage = (mileage: number) =>
    new Intl.NumberFormat('en-US').format(mileage) + ' km'

  const label = (prefix: string, value?: string) => {
    if (!value) return '—'
    const key = `${prefix}.${value}`
    const translated = t(key)
    return translated !== key ? translated : value
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-muted-foreground">
        {t('car.loading')}
      </div>
    )
  }

  if (!car) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground">{t('car.notFound')}</h1>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('car.back')}
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('car.back')}
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-muted">
          {!imageError ? (
            <Image
              src={car.image}
              alt={`${car.year} ${car.brand} ${car.model}`}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              {t('car.noImage')}
            </div>
          )}
          {car.isVip && (
            <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-sm font-semibold text-white shadow-lg">
              <Crown className="h-4 w-4" />
              VIP
            </div>
          )}
        </div>

        <div>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-primary">
                {car.year} · {label('fuel', car.fuelType)}
              </p>
              <h1 className="mt-1 text-3xl font-bold text-foreground">
                {car.brand} {car.model}
              </h1>
              <p className="mt-2 flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {car.location}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsFavorite(!isFavorite)}
              className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
            >
              <Heart
                className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`}
              />
              {isFavorite ? t('car.removeFavorite') : t('car.addFavorite')}
            </button>
          </div>

          <p className="mt-6 text-4xl font-bold text-primary">{formatPrice(car.price)}</p>

          <div className="mt-8 rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
              <Settings2 className="h-5 w-5 text-primary" />
              {t('car.specs')}
            </h2>
            <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-secondary/60 p-4">
                <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  {t('car.year')}
                </dt>
                <dd className="mt-1 text-lg font-semibold text-foreground">{car.year}</dd>
              </div>
              <div className="rounded-xl bg-secondary/60 p-4">
                <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Gauge className="h-3.5 w-3.5" />
                  {t('car.mileage')}
                </dt>
                <dd className="mt-1 text-lg font-semibold text-foreground">
                  {formatMileage(car.mileage)}
                </dd>
              </div>
              <div className="rounded-xl bg-secondary/60 p-4">
                <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Fuel className="h-3.5 w-3.5" />
                  {t('car.fuel')}
                </dt>
                <dd className="mt-1 text-lg font-semibold text-foreground">
                  {label('fuel', car.fuelType)}
                </dd>
              </div>
              {car.transmission && (
                <div className="rounded-xl bg-secondary/60 p-4">
                  <dt className="text-xs text-muted-foreground">{t('car.transmission')}</dt>
                  <dd className="mt-1 text-lg font-semibold text-foreground">
                    {label('transmission', car.transmission)}
                  </dd>
                </div>
              )}
              <div className="rounded-xl bg-secondary/60 p-4 sm:col-span-2">
                <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  {t('car.location')}
                </dt>
                <dd className="mt-1 text-lg font-semibold text-foreground">{car.location}</dd>
              </div>
            </dl>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/chat"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <MessageCircle className="h-5 w-5" />
              {t('car.contact')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
