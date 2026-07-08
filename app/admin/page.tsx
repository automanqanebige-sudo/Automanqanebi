'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getDb } from '@/lib/firebase-db'
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore/lite'
import RequireAuth from '@/components/RequireAuth'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { isAdminEmail } from '@/lib/site'

type FirestoreCar = {
  id: string
  brand?: string
  model?: string
  name?: string
  price?: number
  userEmail?: string
}

function AdminPanel() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const router = useRouter()
  const [cars, setCars] = useState<FirestoreCar[]>([])
  const [loading, setLoading] = useState(true)

  const isAdmin = isAdminEmail(user?.email)

  useEffect(() => {
    if (!user) return
    if (!isAdmin) {
      router.replace('/')
      return
    }

    const fetchCars = async () => {
      const querySnapshot = await getDocs(collection(getDb(), 'cars'))
      setCars(querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() })))
      setLoading(false)
    }
    fetchCars()
  }, [user, isAdmin, router])

  const deleteCar = async (id: string) => {
    if (!confirm(t('profile.deleteConfirm'))) return
    await deleteDoc(doc(getDb(), 'cars', id))
    setCars((prev) => prev.filter((car) => car.id !== id))
  }

  if (!isAdmin) return null

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-2 text-2xl font-bold text-foreground">{t('admin.title')}</h1>
      <p className="mb-6 text-sm text-muted-foreground">{t('admin.subtitle')}</p>

      {loading ? (
        <p className="text-muted-foreground">{t('auth.loading')}</p>
      ) : cars.length === 0 ? (
        <p className="text-muted-foreground">{t('admin.noCars')}</p>
      ) : (
        <ul className="space-y-2">
          {cars.map((car) => (
            <li
              key={car.id}
              className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-semibold text-foreground">
                  {car.brand ?? car.name} {car.model ?? ''}
                </p>
                {car.userEmail && (
                  <p className="text-xs text-muted-foreground">{car.userEmail}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => deleteCar(car.id)}
                className="rounded-lg border border-destructive/30 px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
              >
                {t('profile.delete')}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function AdminPage() {
  return (
    <RequireAuth>
      <AdminPanel />
    </RequireAuth>
  )
}
