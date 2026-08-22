'use client'

import RequireAuth from '@/components/RequireAuth'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import CarListingForm from '@/components/CarListingForm'
import { logAnalyticsEvent } from '@/lib/analytics-firestore'
import { createCarListing } from '@/lib/cars-firestore'

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
        if (!user) throw new Error('auth')
        const { buildListingLifecycleFields } = await import('@/lib/cars-lifecycle-actions')
        const { isVipListingType } = await import('@/lib/listing-lifecycle')
        const lifecycle = buildListingLifecycleFields(payload.listingType)
        const carId = await createCarListing(payload, {
          userId: user.uid,
          userEmail: user.email ?? null,
          isVip: isVipListingType(payload.listingType),
          ...lifecycle,
        })
        logAnalyticsEvent(
          'listing_car',
          { brand: payload.brand, model: payload.model, offerType: payload.offerType ?? 'sale' },
          user.uid
        )
        router.push(`/car/${carId}`)
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
