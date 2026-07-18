'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowUp,
  Car,
  Crown,
  LogOut,
  Mail,
  Trash2,
  ExternalLink,
  Pencil,
  Wrench,
  Settings,
} from 'lucide-react'
import { deleteDoc, doc } from 'firebase/firestore/lite'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { useCurrency } from '@/context/CurrencyContext'
import { fetchUserCars } from '@/lib/cars-firestore'
import { createAndMaybeFulfillPayment } from '@/lib/payments'
import {
  daysUntilExpiry,
  formatListingDate,
  isVipListingType,
  isVipRenewalDue,
} from '@/lib/listing-lifecycle'
import { deleteService, fetchUserServices } from '@/lib/services-firestore'
import { getDb } from '@/lib/firebase-db'
import ProfileSettings from '@/components/profile/ProfileSettings'
import VipMonetizationPanel from '@/components/VipMonetizationPanel'
import DealerProfileSettings from '@/components/profile/DealerProfileSettings'
import { ProfileRowSkeleton } from '@/components/ui/Skeleton'
import type { Car as CarType } from '@/components/CarCard'
import type { Service } from '@/types/service'

export default function ProfilePage() {
  const { user, loading, configured, logout } = useAuth()
  const { t } = useLanguage()
  const { formatPrice } = useCurrency()
  const router = useRouter()
  const [myCars, setMyCars] = useState<CarType[]>([])
  const [myServices, setMyServices] = useState<Service[]>([])
  const [loadingCars, setLoadingCars] = useState(true)
  const [loadingServices, setLoadingServices] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [showVipPanel, setShowVipPanel] = useState(false)
  const [bumpingId, setBumpingId] = useState<string | null>(null)
  const [vipCarId, setVipCarId] = useState<string | undefined>()

  useEffect(() => {
    if (!loading && configured && !user) {
      router.replace('/login?redirect=/profile')
    }
  }, [user, loading, configured, router])

  useEffect(() => {
    if (!user) return
    setLoadingCars(true)
    fetchUserCars(user.uid)
      .then(setMyCars)
      .catch(() => setMyCars([]))
      .finally(() => setLoadingCars(false))
  }, [user])

  useEffect(() => {
    if (!user) return
    setLoadingServices(true)
    fetchUserServices(user.uid)
      .then(setMyServices)
      .catch(() => setMyServices([]))
      .finally(() => setLoadingServices(false))
  }, [user])

  const handleDelete = async (id: string) => {
    if (!confirm(t('profile.deleteConfirm'))) return
    try {
      await deleteDoc(doc(getDb(), 'cars', id))
      setMyCars((prev) => prev.filter((c) => c.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteService = async (id: string) => {
    if (!confirm(t('profile.deleteConfirm'))) return
    try {
      await deleteService(id)
      setMyServices((prev) => prev.filter((s) => s.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const handleBump = async (id: string) => {
    if (!user) return
    if (!confirm(t('profile.bumpConfirm'))) return
    setBumpingId(id)
    try {
      const data = await createAndMaybeFulfillPayment({
        kind: 'bump',
        carId: id,
        userId: user.uid,
      })
      if (data.status !== 'paid') throw new Error('bump pending')
      setMyCars((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, bumpedAt: new Date().toISOString() } : c
        )
      )
    } catch (err) {
      console.error(err)
      alert(t('profile.bumpError'))
    } finally {
      setBumpingId(null)
    }
  }

  const vipDueCars = myCars.filter(
    (c) => isVipListingType(c.listingType) && isVipRenewalDue(c)
  )

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground">
        {t('auth.loading')}
      </div>
    )
  }

  if (!user) return null

  const initial = (user.displayName || user.email || '?').charAt(0).toUpperCase()

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        {user.photoURL ? (
          <Image
            src={user.photoURL}
            alt=""
            width={96}
            height={96}
            className="mx-auto h-24 w-24 rounded-full object-cover ring-4 ring-primary/20"
          />
        ) : (
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground">
            {initial}
          </div>
        )}

        <h1 className="mt-4 text-2xl font-bold text-foreground">
          {user.displayName || t('auth.profile.member')}
        </h1>

        {user.email && (
          <p className="mt-2 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            {user.email}
          </p>
        )}
        {user.email && !user.emailVerified && (
          <p className="mt-3 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-800 dark:text-amber-200">
            {t('auth.verifyEmailSent')}
          </p>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/add-car"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Car className="h-4 w-4" />
            {t('nav.addCar')}
          </Link>
          <Link
            href="/services/add"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-5 py-2.5 font-medium text-foreground transition-colors hover:bg-secondary"
          >
            <Wrench className="h-4 w-4" />
            {t('services.addService')}
          </Link>
          <button
            type="button"
            onClick={() => setShowSettings((v) => !v)}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-5 py-2.5 font-medium text-foreground transition-colors hover:bg-secondary"
          >
            <Settings className="h-4 w-4" />
            {t('profile.settings.title')}
          </button>
          <button
            type="button"
            onClick={() => logout().then(() => router.push('/'))}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-5 py-2.5 font-medium text-foreground transition-colors hover:bg-secondary"
          >
            <LogOut className="h-4 w-4" />
            {t('auth.logout')}
          </button>
        </div>
      </div>

      {showSettings && (
        <section className="mt-8 space-y-6">
          <ProfileSettings />
          <DealerProfileSettings />
        </section>
      )}

      {vipDueCars.length > 0 && (
        <div className="mt-8 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4">
          <p className="font-semibold text-foreground">{t('profile.vipRenewBanner')}</p>
          <ul className="mt-2 space-y-2">
            {vipDueCars.map((car) => (
              <li key={car.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span>
                  {car.year} {car.brand} {car.model}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setVipCarId(car.id)
                    setShowVipPanel(true)
                  }}
                  className="rounded-lg bg-primary px-3 py-1.5 text-primary-foreground"
                >
                  {t('profile.renewVip')}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setShowVipPanel((v) => !v)}
          className="inline-flex items-center gap-2 rounded-lg border border-primary/30 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10"
        >
          <Crown className="h-4 w-4" />
          {t('vip.packagesTitle')}
        </button>
      </div>

      {showVipPanel && (
        <section className="mt-6">
          <VipMonetizationPanel
            carId={vipCarId || myCars[0]?.id}
            onRenewed={() => {
              if (!user) return
              fetchUserCars(user.uid).then(setMyCars).catch(() => {})
            }}
          />
        </section>
      )}

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-bold text-foreground">{t('profile.myListings')}</h2>

        {loadingCars ? (
          <ul className="space-y-3">
            {Array.from({ length: 3 }, (_, i) => (
              <ProfileRowSkeleton key={i} />
            ))}
          </ul>
        ) : myCars.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card px-6 py-10 text-center">
            <p className="text-muted-foreground">{t('profile.noListings')}</p>
            <Link
              href="/add-car"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Car className="h-4 w-4" />
              {t('nav.addCar')}
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {myCars.map((car) => (
              <li
                key={car.id}
                className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-foreground">
                    {car.year} {car.brand} {car.model}
                  </p>
                  <p className="text-sm text-primary font-medium">{formatPrice(car.price)}</p>
                  <p className="text-xs text-muted-foreground">{car.location}</p>
                  {car.createdAt && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t('car.postedDate')}: {formatListingDate(car.createdAt)}
                    </p>
                  )}
                  {daysUntilExpiry(car) != null && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t('profile.expiresIn').replace('{n}', String(daysUntilExpiry(car)))}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={bumpingId === car.id}
                    onClick={() => handleBump(car.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 px-3 py-2 text-sm text-primary hover:bg-primary/10 disabled:opacity-50"
                    title={t('profile.bumpHint')}
                  >
                    <ArrowUp className="h-4 w-4" />
                    {bumpingId === car.id ? t('auth.loading') : t('profile.bump')}
                  </button>
                  {isVipListingType(car.listingType) && (
                    <button
                      type="button"
                      onClick={() => {
                        setVipCarId(car.id)
                        setShowVipPanel(true)
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/40 px-3 py-2 text-sm text-amber-700 hover:bg-amber-500/10"
                    >
                      <Crown className="h-4 w-4" />
                      VIP
                    </button>
                  )}
                  <Link
                    href={`/car/${car.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm hover:bg-secondary"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {t('profile.view')}
                  </Link>
                  <Link
                    href={`/edit-car/${car.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 px-3 py-2 text-sm text-primary hover:bg-primary/10"
                  >
                    <Pencil className="h-4 w-4" />
                    {t('profile.edit')}
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(car.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/30 px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                    {t('profile.delete')}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-bold text-foreground">{t('profile.myServices')}</h2>

        {loadingServices ? (
          <ul className="space-y-3">
            {Array.from({ length: 2 }, (_, i) => (
              <ProfileRowSkeleton key={i} />
            ))}
          </ul>
        ) : myServices.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card px-6 py-10 text-center">
            <p className="text-muted-foreground">{t('profile.noServices')}</p>
            <Link
              href="/services/add"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Wrench className="h-4 w-4" />
              {t('services.addService')}
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {myServices.map((service) => (
              <li
                key={service.id}
                className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-foreground">{service.name}</p>
                  <p className="text-sm text-muted-foreground">{service.location}</p>
                  <p className="text-xs text-muted-foreground">{service.phone}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/services/${service.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm hover:bg-secondary"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {t('profile.view')}
                  </Link>
                  <Link
                    href={`/services/edit/${service.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 px-3 py-2 text-sm text-primary hover:bg-primary/10"
                  >
                    <Pencil className="h-4 w-4" />
                    {t('profile.edit')}
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDeleteService(service.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/30 px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                    {t('profile.delete')}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
