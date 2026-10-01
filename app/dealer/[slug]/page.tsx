'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Building2, Phone } from 'lucide-react'
import CarCard, { type Car } from '@/components/CarCard'
import PageHeader from '@/components/ui/PageHeader'
import EmptyState from '@/components/ui/EmptyState'
import { CarCardSkeletonGrid } from '@/components/ui/Skeleton'
import { useLanguage } from '@/context/LanguageContext'
import { loadAllCars } from '@/lib/cars-firestore'
import { telHref } from '@/lib/contact-links'
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
      <div className="mx-auto max-w-7xl section-padding">
        <CarCardSkeletonGrid count={4} />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-lg section-padding">
        <EmptyState
          icon={<Building2 className="h-8 w-8 text-muted-foreground" aria-hidden />}
          title={t('dealer.notFound')}
          actionLabel={t('nav.home')}
          actionHref="/"
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl section-padding">
      <div className="mb-8 flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 shadow-card sm:flex-row sm:items-center">
        <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-secondary">
          {profile.dealerLogo ? (
            <Image src={profile.dealerLogo} alt="" fill className="object-cover" />
          ) : (
            <Building2 className="h-10 w-10 text-primary" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">{t('dealer.badge')}</p>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{title}</h1>
          {profile.phone && (
            <a
              href={telHref(profile.phone)}
              className="mt-2 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              <Phone className="h-4 w-4" />
              {profile.phone}
            </a>
          )}
        </div>
        <Link href="/#search" className="btn-secondary shrink-0 rounded-xl px-5 py-2.5 text-sm">
          {t('home.cta.browse')}
        </Link>
      </div>

      <PageHeader
        title={`${t('dealer.listings')} (${cars.length})`}
        subtitle={t('dealer.panelSubtitle')}
      />

      {cars.length === 0 ? (
        <EmptyState
          title={t('dealer.noListings')}
          actionLabel={t('nav.home')}
          actionHref="/"
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}
    </div>
  )
}
