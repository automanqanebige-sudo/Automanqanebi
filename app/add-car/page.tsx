'use client'

import { collection, addDoc } from 'firebase/firestore/lite'
import { useRouter } from 'next/navigation'
import RequireAuth from '@/components/RequireAuth'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { getDb } from '@/lib/firebase-db'
import CarListingForm from '@/components/CarListingForm'
import { logAnalyticsEvent } from '@/lib/analytics-firestore'

function AddCarForm() {
  const { t } = useLanguage()
  const router = useRouter()
  const { user } = useAuth()

  return (
    <CarListingForm
      title={t('addCar.title')}
      subtitle={t('addCar.subtitle')}
      submitLabel={t('addCar.submit')}
      submittingLabel={t('addCar.submitting')}
        onSubmit={async (payload) => {
        const { buildListingLifecycleFields } = await import('@/lib/cars-lifecycle-actions')
        const { isVipListingType } = await import('@/lib/listing-lifecycle')
        const lifecycle = buildListingLifecycleFields(payload.listingType)
        const docRef = await addDoc(collection(getDb(), 'cars'), {
          ...payload,
          userId: user?.uid ?? null,
          userEmail: user?.email ?? null,
          isVip: isVipListingType(payload.listingType),
          ...lifecycle,
        })
        logAnalyticsEvent(
          'listing_car',
          { brand: payload.brand, model: payload.model, offerType: payload.offerType ?? 'sale' },
          user?.uid
        )
        router.push(`/car/${docRef.id}`)
      }}
    />
  )
}

export default function AddCarPage() {
  return (
    <RequireAuth>
      <AddCarForm />
    </RequireAuth>
  )
}
