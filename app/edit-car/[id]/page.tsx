'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { doc, updateDoc } from 'firebase/firestore/lite'
import { ArrowLeft } from 'lucide-react'
import RequireAuth from '@/components/RequireAuth'
import CarListingForm from '@/components/CarListingForm'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { getDb } from '@/lib/firebase-db'
import { fetchFirestoreCarById } from '@/lib/cars-firestore'
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
      <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground">
        {t('car.loading')}
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-foreground">{t('car.notFound')}</h1>
        <Link href="/profile" className="mt-4 inline-block text-primary hover:underline">
          {t('nav.profile')}
        </Link>
      </div>
    )
  }

  if (forbidden) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-foreground">{t('editCar.forbidden')}</h1>
        <p className="mt-2 text-muted-foreground">{t('editCar.forbiddenDesc')}</p>
        <Link href="/profile" className="mt-4 inline-block text-primary hover:underline">
          {t('nav.profile')}
        </Link>
      </div>
    )
  }

  if (!initialValues) return null

  return (
    <>
      <div className="mx-auto max-w-2xl px-4 pt-8">
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
          await updateDoc(doc(getDb(), 'cars', id), {
            ...payload,
            updatedAt: new Date(),
          })
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
