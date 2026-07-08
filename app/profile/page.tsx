'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Car, LogOut, Mail, Trash2, ExternalLink, Pencil, Wrench } from 'lucide-react'
import { deleteDoc, doc } from 'firebase/firestore/lite'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { useCurrency } from '@/context/CurrencyContext'
import { fetchUserCars } from '@/lib/cars-firestore'
import { deleteService, fetchUserServices } from '@/lib/services-firestore'
import { getDb } from '@/lib/firebase-db'
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
            onClick={() => logout().then(() => router.push('/'))}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-5 py-2.5 font-medium text-foreground transition-colors hover:bg-secondary"
          >
            <LogOut className="h-4 w-4" />
            {t('auth.logout')}
          </button>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-bold text-foreground">{t('profile.myListings')}</h2>

        {loadingCars ? (
          <p className="text-muted-foreground">{t('car.loading')}</p>
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
                </div>
                <div className="flex flex-wrap gap-2">
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
          <p className="text-muted-foreground">{t('car.loading')}</p>
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
                <button
                  type="button"
                  onClick={() => handleDeleteService(service.id)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/30 px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                  {t('profile.delete')}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
