'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Building2 } from 'lucide-react'
import CarCard, { type Car } from '@/components/CarCard'
import { useLanguage } from '@/context/LanguageContext'
import { loadAllCars } from '@/lib/cars-firestore'
import { doc, getDoc } from 'firebase/firestore/lite'
import { getDb } from '@/lib/firebase-db'
import { isFirebaseConfigured } from '@/lib/firebase'

type DealerProfile = {
  displayName?: string
  dealerName?: string
  dealerSlug?: string
  dealerLogo?: string
  phone?: string
  role?: string
}

export default function DealerPage() {
  const params = useParams()
  const slug = String(params.slug ?? '')
  const { t } = useLanguage()
  const [profile, setProfile] = useState<(DealerProfile & { id: string }) | null>(null)
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      try {
        const allCars = await loadAllCars()
        if (!isFirebaseConfigured()) {
          if (active) {
            setProfile(null)
            setCars([])
          }
          return
        }
        const { collection, getDocs, query, where } = await import('firebase/firestore/lite')
        const q = query(collection(getDb(), 'users'), where('dealerSlug', '==', slug))
        const snap = await getDocs(q)
        const dealerDoc = snap.docs[0]
        if (!dealerDoc) {
          // fallback: try doc id = slug
          const byId = await getDoc(doc(getDb(), 'users', slug))
          if (byId.exists()) {
            const data = byId.data() as DealerProfile & { dealerApproved?: boolean }
            if (!data.dealerApproved) {
              if (active) {
                setProfile(null)
                setCars([])
              }
              return
            }
            if (active) {
              setProfile({ id: byId.id, ...data })
              setCars(allCars.filter((c) => c.userId === byId.id))
            }
          } else if (active) {
            setProfile(null)
            setCars([])
          }
          return
        }
        const data = dealerDoc.data() as DealerProfile & { dealerApproved?: boolean; role?: string }
        if (!data.dealerApproved) {
          if (active) {
            setProfile(null)
            setCars([])
          }
          return
        }
        if (active) {
          setProfile({ id: dealerDoc.id, ...data })
          setCars(allCars.filter((c) => c.userId === dealerDoc.id))
        }
      } catch {
        if (active) {
          setProfile(null)
          setCars([])
        }
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [slug])

  const title = useMemo(
    () => profile?.dealerName || profile?.displayName || slug,
    [profile, slug]
  )

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground">
        {t('car.loading')}
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground">{t('dealer.notFound')}</h1>
        <Link href="/" className="mt-4 inline-block text-primary hover:underline">
          {t('nav.home')}
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-border bg-card">
          {profile.dealerLogo ? (
            <Image src={profile.dealerLogo} alt="" fill className="object-cover" />
          ) : (
            <Building2 className="h-10 w-10 text-primary" />
          )}
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            {t('dealer.badge')}
          </p>
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          {profile.phone && <p className="mt-1 text-sm text-muted-foreground">{profile.phone}</p>}
        </div>
      </div>

      <h2 className="mb-4 text-xl font-bold text-foreground">
        {t('dealer.listings')} ({cars.length})
      </h2>
      {cars.length === 0 ? (
        <p className="text-muted-foreground">{t('dealer.noListings')}</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}
    </div>
  )
}
