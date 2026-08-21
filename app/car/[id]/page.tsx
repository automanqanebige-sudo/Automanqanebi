'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Calendar,
  Columns2,
  Crown,
  Eye,
  Heart,
  MapPin,
  MessageCircle,
  Phone,
  Settings2,
  Tag,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import type { Car } from '@/components/CarCard'
import SimilarCarsSection from '@/components/SimilarCarsSection'
import MessengerContactButtons from '@/components/MessengerContactButtons'
import CarImageGallery from '@/components/CarImageGallery'
import ReportListingButton from '@/components/ReportListingButton'
import ShareListingButton from '@/components/ShareListingButton'
import VehicleToolsCalculators from '@/components/calculators/VehicleToolsCalculators'
import { SITE_URL } from '@/lib/site'
import { getCarById } from '@/data/cars'
import { fetchFirestoreCarById, loadAllCars } from '@/lib/cars-firestore'
import { incrementCarViews } from '@/lib/cars-lifecycle-actions'
import { formatListingDate } from '@/lib/listing-lifecycle'
import { findSimilarCars } from '@/lib/similar-cars'
import { getCarImages } from '@/lib/car-images'
import { FEATURE_EMOJI } from '@/lib/filter-emojis'
import { COLOR_EMOJI } from '@/types/filters'
import { useLanguage } from '@/context/LanguageContext'
import { useCurrency } from '@/context/CurrencyContext'
import { useFavorites } from '@/context/FavoritesContext'
import { useCompare } from '@/context/CompareContext'
import { CarDetailSkeleton } from '@/components/ui/Skeleton'
import type { CarFeature } from '@/types/filters'

type SpecItem = {
  label: string
  value: string
  emoji?: string
}

export default function CarPage({ params }: { params: { id: string } }) {
  const { t } = useLanguage()
  const { formatPrice } = useCurrency()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { isComparing, toggleCompare } = useCompare()
  const { user } = useAuth()
  const router = useRouter()
  const [car, setCar] = useState<Car | null>(null)
  const [allCars, setAllCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [compareFull, setCompareFull] = useState(false)

  const favorited = car ? isFavorite(car.id) : false
  const comparing = car ? isComparing(car.id) : false

  const handleCompare = () => {
    if (!car) return
    const res = toggleCompare(car.id)
    if (!res.ok && res.reason === 'full') {
      setCompareFull(true)
      setTimeout(() => setCompareFull(false), 2000)
    }
  }

  useEffect(() => {
    const found = getCarById(params.id)
    if (found) {
      setCar(found)
      setLoading(false)
    } else {
      fetch(`/api/cars/${params.id}`)
        .then((res) => (res.ok ? res.json() : null))
        .then(async (data) => {
          if (data) {
            setCar(data)
            return
          }
          const fromDb = await fetchFirestoreCarById(params.id)
          if (fromDb) setCar(fromDb)
        })
        .finally(() => setLoading(false))
    }

    loadAllCars()
      .then(setAllCars)
      .catch(() => setAllCars([]))

    void incrementCarViews(params.id)
  }, [params.id])

  const formatMileage = (mileage: number) =>
    new Intl.NumberFormat('en-US').format(mileage) + ' km'

  const translate = (candidates: string[], fallback?: string) => {
    if (!fallback) return '—'
    for (const key of candidates) {
      const translated = t(key)
      if (translated !== key) return translated
    }
    return fallback
  }

  const specValue = (group: string, value?: string) =>
    translate([`${group}.${value}`, `filter.${group}.${value}`, `filter.body.${value}`, `filter.color.${value}`, `filter.drive.${value}`, `filter.steering.${value}`, `filter.listing.${value}`, `filter.import.${value}`, `filter.customs.${value}`, `filter.category.${value}`, `filter.offer.${value}`], value)

  const phoneHref = useMemo(() => {
    if (!car?.phone) return null
    const digits = car.phone.replace(/\D/g, '')
    return digits ? `tel:+${digits.startsWith('995') ? digits : `995${digits}`}` : `tel:${car.phone}`
  }, [car?.phone])

  const similarCars = useMemo(
    () => (car ? findSimilarCars(allCars, car, 4) : []),
    [allCars, car]
  )

  if (loading) {
    return <CarDetailSkeleton />
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

  const offerBadge =
    car.offerType === 'rent'
      ? t('filter.offer.rent')
      : car.offerType === 'sale'
        ? t('filter.offer.sale')
        : null

  const specItems: SpecItem[] = [
    { label: t('car.year'), value: String(car.year) },
    { label: t('car.mileage'), value: formatMileage(car.mileage) },
    { label: t('car.fuel'), value: specValue('fuel', car.fuelType) },
  ]
  if (car.transmission) {
    specItems.push({ label: t('car.transmission'), value: specValue('transmission', car.transmission) })
  }
  if (car.bodyType) {
    specItems.push({ label: t('filter.body'), value: specValue('body', car.bodyType) })
  }
  if (car.category) {
    specItems.push({ label: t('filter.category'), value: specValue('category', car.category) })
  }
  if (car.driveType) {
    specItems.push({ label: t('filter.drive'), value: specValue('drive', car.driveType) })
  }
  if (car.steering) {
    specItems.push({ label: t('filter.steering'), value: specValue('steering', car.steering) })
  }
  if (car.color) {
    specItems.push({
      label: t('filter.section.colors'),
      value: specValue('color', car.color),
      emoji: COLOR_EMOJI[car.color],
    })
  }
  if (car.engineVolume) {
    specItems.push({ label: t('filter.engineVolume'), value: `${car.engineVolume}L` })
  }
  if (car.cylinders) {
    specItems.push({ label: t('filter.cylinders'), value: String(car.cylinders) })
  }
  if (car.doors) {
    specItems.push({ label: t('filter.doors'), value: String(car.doors) })
  }
  if (car.offerType) {
    specItems.push({ label: t('filter.section.offerType'), value: specValue('offer', car.offerType) })
  }
  if (car.listingType) {
    specItems.push({ label: t('filter.section.listingType'), value: specValue('listing', car.listingType) })
  }
  if (car.importRegion) {
    specItems.push({ label: t('filter.section.import'), value: specValue('import', car.importRegion) })
  }
  if (car.customsStatus) {
    specItems.push({ label: t('filter.section.status'), value: specValue('customs', car.customsStatus) })
  }
  specItems.push({ label: t('car.location'), value: car.location })
  if (car.createdAt) {
    specItems.push({
      label: t('car.postedDate'),
      value: formatListingDate(car.createdAt),
    })
  }

  const galleryImages = getCarImages(car)
  const galleryAlt = `${car.year} ${car.brand} ${car.model}`

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
        <CarImageGallery
          images={galleryImages}
          alt={galleryAlt}
          badges={
            <>
              {car.isVip && (
                <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground shadow-lg">
                  <Crown className="h-4 w-4" />
                  VIP
                </div>
              )}
              {offerBadge && (
                <div className="absolute left-4 top-14 flex items-center gap-1.5 rounded-full bg-card/95 px-3 py-1.5 text-sm font-semibold text-foreground shadow-lg backdrop-blur-sm">
                  <Tag className="h-4 w-4 text-primary" />
                  {offerBadge}
                </div>
              )}
            </>
          }
        />

        <div>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-primary">
                {car.year} · {specValue('fuel', car.fuelType)}
              </p>
              <h1 className="mt-1 text-3xl font-bold text-foreground">
                {car.brand} {car.model}
              </h1>
              <p className="mt-2 flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {car.location}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                {car.createdAt && (
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {t('car.postedDate')}: {formatListingDate(car.createdAt)}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <Eye className="h-4 w-4" />
                  {car.views ?? 0} {t('car.views')}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <ShareListingButton
                payload={{
                  url: `${SITE_URL}/car/${car.id}`,
                  title: `${car.year} ${car.brand} ${car.model} — ${formatPrice(car.price)}`,
                  text: [
                    `${car.year} ${car.brand} ${car.model}`,
                    formatPrice(car.price),
                    `${new Intl.NumberFormat('en-US').format(car.mileage)} km`,
                    car.location,
                  ].join(' · '),
                  imageUrl: galleryImages[0],
                }}
              />
              <button
                type="button"
                onClick={() => toggleFavorite(car.id)}
                className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
              >
                <Heart
                  className={`h-5 w-5 ${favorited ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`}
                />
                {favorited ? t('car.removeFavorite') : t('car.addFavorite')}
              </button>
              <button
                type="button"
                onClick={handleCompare}
                className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                  comparing
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-card hover:bg-secondary'
                }`}
              >
                <Columns2 className="h-5 w-5" />
                {compareFull
                  ? t('compare.full')
                  : comparing
                    ? t('compare.remove')
                    : t('compare.add')}
              </button>
              <ReportListingButton listingId={car.id} listingType="car" />
            </div>
          </div>

          <p className="mt-6 text-4xl font-bold text-primary">
            {formatPrice(car.price)}
            {car.offerType === 'rent' && (
              <span className="ml-2 text-lg font-medium text-muted-foreground">
                / {t('filter.offer.perMonth')}
              </span>
            )}
          </p>

          {car.description && (
            <div className="mt-6 rounded-2xl border border-border bg-card p-5">
              <h2 className="mb-2 text-sm font-semibold text-muted-foreground">
                {t('car.description')}
              </h2>
              <p className="whitespace-pre-wrap leading-relaxed text-foreground">{car.description}</p>
            </div>
          )}

          <div className="mt-6 rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
              <Settings2 className="h-5 w-5 text-primary" />
              {t('car.specs')}
            </h2>
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {specItems.map((item) => (
                <div key={item.label} className="rounded-xl bg-secondary/60 p-4">
                  <dt className="text-xs text-muted-foreground">{item.label}</dt>
                  <dd className="mt-1 flex items-center gap-1.5 text-base font-semibold text-foreground">
                    {item.emoji && <span aria-hidden>{item.emoji}</span>}
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {car.features && car.features.length > 0 && (
            <div className="mt-6 rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                {t('filter.section.features')}
              </h2>
              <div className="flex flex-wrap gap-2">
                {car.features.map((feature) => (
                  <span
                    key={feature}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/60 px-3 py-1.5 text-sm text-foreground"
                  >
                    <span aria-hidden>{FEATURE_EMOJI[feature as CarFeature] ?? '✓'}</span>
                    {translate([`filter.feature.${feature}`], feature)}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {phoneHref ? (
              <a
                href={phoneHref}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:min-w-[160px]"
              >
                <Phone className="h-5 w-5" />
                {t('car.callSeller')}
              </a>
            ) : (
              <p className="rounded-xl border border-dashed border-border px-4 py-3 text-sm text-muted-foreground">
                {t('car.noPhone')}
              </p>
            )}
            {car.phone && (car.contactWhatsApp || car.contactViber) && (
              <MessengerContactButtons
                phone={car.phone}
                whatsApp={car.contactWhatsApp}
                viber={car.contactViber}
                className="w-full sm:w-auto sm:flex-1"
              />
            )}
            {car.userId && user?.uid !== car.userId && (
              <button
                type="button"
                onClick={() => {
                  if (!user) {
                    router.push(`/login?redirect=/car/${car.id}`)
                    return
                  }
                  router.push(`/chat?car=${car.id}&seller=${car.userId}`)
                }}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-primary/40 bg-primary/10 px-6 py-3.5 font-semibold text-primary transition-colors hover:bg-primary/15"
              >
                <MessageCircle className="h-5 w-5" />
                {t('car.messageSeller')}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-10">
        <VehicleToolsCalculators
          defaultYear={car.year}
          defaultEngineCc={car.engineVolume ? Math.round(car.engineVolume * 1000) : undefined}
          defaultPrice={car.price}
          fuelType={car.fuelType}
        />
      </div>

      <SimilarCarsSection cars={similarCars} />
    </div>
  )
}
