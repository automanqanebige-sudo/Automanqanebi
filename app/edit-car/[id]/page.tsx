'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import RequireAuth from '@/components/RequireAuth'
import CarListingForm from '@/components/CarListingForm'
import EmptyState from '@/components/ui/EmptyState'
import { CarDetailSkeleton } from '@/components/ui/Skeleton'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { fetchFirestoreCarById, updateCarListing } from '@/lib/cars-firestore'
import { carToFormValues } from '@/lib/car-listing'
import type { CarListingFormValues } from '@/lib/car-listing'

function EditCarForm({ id }: { id: string }) {
  const { t } = useLanguage()
  const router = useRouter()
  const { user } = useAuth()
  const [initialValues, setInitialValues] = useState<CarListingFormValues | null>(null)
  const [loading, setLoading] = useState(true)
  const [forbidden, setForbidden] = useState(false)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!user) return

    fetchFirestoreCarById(id)
      .then((car) => {
        if (!car) {
          setNotFound(true)
          return
        }
        if (car.userId !== user.uid) {
          setForbidden(true)
          return
        }
        setInitialValues(carToFormValues(car))
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id, user])

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl section-padding">
        <CarDetailSkeleton />
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="mx-auto max-w-lg section-padding">
        <EmptyState
          title={t('car.notFound')}
          actionLabel={t('nav.profile')}
          actionHref="/profile"
        />
      </div>
    )
  }

  if (forbidden) {
    return (
      <div className="mx-auto max-w-lg section-padding">
        <EmptyState
          title={t('editCar.forbidden')}
          description={t('editCar.forbiddenDesc')}
          actionLabel={t('nav.profile')}
          actionHref="/profile"
        />
      </div>
    )
  }

  if (!initialValues) return null

  return (
    <>
      <div className="mx-auto max-w-3xl px-4 pt-2 sm:px-6">
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('nav.profile')}
        </Link>
      </div>
      <CarListingForm
        title={t('editCar.title')}
        subtitle={t('editCar.subtitle')}
        submitLabel={t('editCar.save')}
        submittingLabel={t('editCar.saving')}
        initialValues={initialValues}
        onSubmit={async (payload) => {
          await updateCarListing(id, payload)
          router.push(`/car/${id}`)
        }}
      />
    </>
  )
}

export default function EditCarPage({ params }: { params: { id: string } }) {
  return (
    <RequireAuth>
      <EditCarForm id={params.id} />
    </RequireAuth>
  )
}
