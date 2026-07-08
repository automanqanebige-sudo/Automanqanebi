'use client'

import { collection, addDoc } from 'firebase/firestore/lite'
import { useRouter } from 'next/navigation'
import RequireAuth from '@/components/RequireAuth'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { getDb } from '@/lib/firebase-db'
import CarListingForm from '@/components/CarListingForm'

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
        const docRef = await addDoc(collection(getDb(), 'cars'), {
          ...payload,
          userId: user?.uid ?? null,
          userEmail: user?.email ?? null,
          isVip: payload.listingType === 'vip' || payload.listingType === 'vip_plus' || payload.listingType === 'super_vip',
          createdAt: new Date(),
          updatedAt: new Date(),
        })
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
