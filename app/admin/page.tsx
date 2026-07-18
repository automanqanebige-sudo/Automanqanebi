'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Car, Megaphone, BarChart3, Settings, Shield, Users, Wrench, LayoutTemplate, Flag } from 'lucide-react'
import { collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore/lite'
import RequireAuth from '@/components/RequireAuth'
import AdminServiceAdsPanel from '@/components/AdminServiceAdsPanel'
import AdminSiteBannersPanel from '@/components/admin/AdminSiteBannersPanel'
import AdminOverview from '@/components/admin/AdminOverview'
import AdminAnalyticsDashboard from '@/components/admin/AdminAnalyticsDashboard'
import AdminCarsPanel, { type AdminCar } from '@/components/admin/AdminCarsPanel'
import AdminServicesPanel from '@/components/admin/AdminServicesPanel'
import AdminUsersPanel, { type AdminUserRow } from '@/components/admin/AdminUsersPanel'
import AdminSiteSettingsPanel from '@/components/admin/AdminSiteSettingsPanel'
import AdminReportsPanel from '@/components/admin/AdminReportsPanel'
import AdminPurgeExpiredButton from '@/components/admin/AdminPurgeExpiredButton'
import AdminVipSmsScanButton from '@/components/admin/AdminVipSmsScanButton'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { getDb } from '@/lib/firebase-db'
import { fetchFirestoreServices } from '@/lib/services-firestore'
import { fetchServiceCategoryAds } from '@/lib/service-category-ads-firestore'
import { fetchSiteBanners } from '@/lib/site-banners-firestore'
import { fetchListingReports } from '@/lib/reports-firestore'
import { isAdminEmail } from '@/lib/site'
import type { Service } from '@/types/service'
import { fetchAnalyticsEvents } from '@/lib/analytics-firestore'
import type { ServiceCategoryAd } from '@/types/service-category-ad'
import type { SiteBanner } from '@/types/site-banner'
import type { AnalyticsEvent } from '@/types/analytics'
import type { ListingReport } from '@/types/report'

type Tab =
  | 'overview'
  | 'analytics'
  | 'banners'
  | 'cars'
  | 'services'
  | 'ads'
  | 'users'
  | 'reports'
  | 'settings'

function buildUserRows(
  profiles: { id: string; displayName?: string; phone?: string }[],
  cars: AdminCar[],
  services: Service[]
): AdminUserRow[] {
  const map = new Map<string, AdminUserRow>()

  const ensure = (id: string, seed?: Partial<AdminUserRow>) => {
    if (!map.has(id)) {
      map.set(id, {
        id,
        displayName: seed?.displayName,
        phone: seed?.phone,
        email: seed?.email,
        carsCount: 0,
        servicesCount: 0,
      })
    }
    return map.get(id)!
  }

  profiles.forEach((p) => {
    ensure(p.id, { displayName: p.displayName, phone: p.phone })
  })

  cars.forEach((car) => {
    const id = (car as AdminCar & { userId?: string }).userId || car.userEmail
    if (!id) return
    const row = ensure(id, { email: car.userEmail })
    row.carsCount += 1
    if (car.userEmail) row.email = car.userEmail
  })

  services.forEach((service) => {
    if (!service.userId) return
    ensure(service.userId).servicesCount += 1
  })

  return Array.from(map.values()).sort((a, b) =>
    (a.displayName || a.email || a.id).localeCompare(b.displayName || b.email || b.id)
  )
}

function AdminPanel() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const router = useRouter()

  const [cars, setCars] = useState<AdminCar[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [categoryAds, setCategoryAds] = useState<ServiceCategoryAd[]>([])
  const [siteBanners, setSiteBanners] = useState<SiteBanner[]>([])
  const [userRows, setUserRows] = useState<AdminUserRow[]>([])
  const [analyticsEvents, setAnalyticsEvents] = useState<AnalyticsEvent[]>([])
  const [conversations, setConversations] = useState<{ updatedAt?: string }[]>([])
  const [servicesRaw, setServicesRaw] = useState<{ createdAt?: unknown; category?: string }[]>([])
  const [reports, setReports] = useState<ListingReport[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>('overview')

  const isAdmin = isAdminEmail(user?.email)

  const stats = useMemo(() => {
    const vipCount = cars.filter(
      (c) =>
        c.isVip ||
        ['vip', 'vip_plus', 'super_vip', 'silver', 'gold', 'platinum'].includes(c.listingType ?? '')
    ).length
    return {
      cars: cars.length,
      services: services.length,
      ads: categoryAds.length,
      banners: siteBanners.length,
      vip: vipCount,
      users: userRows.length,
      reports: reports.filter((r) => r.status === 'open').length,
    }
  }, [cars, services, categoryAds, siteBanners, userRows, reports])

  const loadData = async () => {
    const [
      carsSnap,
      servicesList,
      adsList,
      bannersList,
      usersSnap,
      eventsList,
      convSnap,
      servicesSnap,
      reportsList,
    ] = await Promise.all([
      getDocs(collection(getDb(), 'cars')),
      fetchFirestoreServices(),
      fetchServiceCategoryAds(),
      fetchSiteBanners(),
      getDocs(collection(getDb(), 'users')),
      fetchAnalyticsEvents(),
      getDocs(collection(getDb(), 'conversations')),
      getDocs(collection(getDb(), 'services')),
      fetchListingReports(),
    ])

    const carsList = carsSnap.docs.map(
      (d) => ({ id: d.id, ...d.data() } as AdminCar & { userId?: string; createdAt?: unknown; offerType?: string })
    )
    const profiles = usersSnap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as {
        displayName?: string
        phone?: string
        role?: string
        dealerSlug?: string
        dealerName?: string
        dealerApproved?: boolean
      }),
    }))

    setCars(carsList)
    setServices(servicesList)
    setCategoryAds(adsList)
    setSiteBanners(bannersList)
    setUserRows(buildUserRows(profiles, carsList, servicesList))
    setAnalyticsEvents(eventsList)
    setConversations(
      convSnap.docs.map((d) => ({ updatedAt: d.data().updatedAt as string | undefined }))
    )
    setServicesRaw(
      servicesSnap.docs.map((d) => {
        const data = d.data()
        return { createdAt: data.createdAt, category: data.category as string | undefined }
      })
    )
    setReports(reportsList)
    setLoading(false)
  }

  useEffect(() => {
    if (!user) return
    if (!isAdmin) {
      router.replace('/')
      return
    }
    loadData().catch(() => setLoading(false))
  }, [user, isAdmin, router])

  const deleteCar = async (id: string) => {
    if (!confirm(t('profile.deleteConfirm'))) return
    await deleteDoc(doc(getDb(), 'cars', id))
    setCars((prev) => prev.filter((c) => c.id !== id))
  }

  const deleteServiceItem = async (id: string) => {
    if (!confirm(t('profile.deleteConfirm'))) return
    await deleteDoc(doc(getDb(), 'services', id))
    setServices((prev) => prev.filter((s) => s.id !== id))
  }

  const toggleVip = async (car: AdminCar) => {
    const nextVip = !(
      car.isVip || ['vip', 'vip_plus', 'super_vip'].includes(car.listingType ?? '')
    )
    await updateDoc(doc(getDb(), 'cars', car.id), {
      isVip: nextVip,
      listingType: nextVip ? 'vip' : 'standard',
      updatedAt: new Date(),
    })
    setCars((prev) =>
      prev.map((c) =>
        c.id === car.id ? { ...c, isVip: nextVip, listingType: nextVip ? 'vip' : 'standard' } : c
      )
    )
  }

  const categoryLabel = (cat: string) => t(`services.cat.${cat}`)

  const tabs: { id: Tab; label: string; count?: number; icon: typeof Car }[] = [
    { id: 'overview', label: t('admin.tabOverview'), icon: Shield },
    { id: 'analytics', label: t('admin.tabAnalytics'), icon: BarChart3 },
    { id: 'banners', label: t('admin.tabBanners'), count: stats.banners, icon: LayoutTemplate },
    { id: 'cars', label: t('admin.tabCars'), count: stats.cars, icon: Car },
    { id: 'services', label: t('admin.tabServices'), count: stats.services, icon: Wrench },
    { id: 'ads', label: t('admin.tabAds'), count: stats.ads, icon: Megaphone },
    { id: 'reports', label: t('admin.tabReports'), count: stats.reports, icon: Flag },
    { id: 'users', label: t('admin.tabUsers'), count: stats.users, icon: Users },
    { id: 'settings', label: t('admin.tabSettings'), icon: Settings },
  ]

  if (!isAdmin) return null

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
            <Shield className="h-7 w-7 text-primary" />
            {t('admin.title')}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{t('admin.subtitleFull')}</p>
          <p className="mt-1 text-xs text-muted-foreground">{user?.email}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/add-car"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Car className="h-4 w-4" />
            {t('nav.addCar')}
          </Link>
          <Link
            href="/services/add"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-secondary"
          >
            <Wrench className="h-4 w-4" />
            {t('services.addService')}
          </Link>
        </div>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {tabs.slice(1, 6).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className="rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-primary/30"
          >
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <p className="mt-1 text-2xl font-bold text-foreground">
              {item.count ?? '—'}
            </p>
          </button>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap gap-1 border-b border-border">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`border-b-2 px-3 py-2 text-sm font-medium transition-colors sm:px-4 ${
              tab === item.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {item.label}
            {item.count != null ? ` (${item.count})` : ''}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-muted-foreground">{t('auth.loading')}</p>
      ) : tab === 'overview' ? (
        <AdminOverview
          stats={stats}
          onNavigate={(id) => setTab(id as Tab)}
        />
      ) : tab === 'analytics' ? (
        <AdminAnalyticsDashboard
          cars={cars}
          services={servicesRaw}
          events={analyticsEvents}
          conversations={conversations}
          categoryLabel={categoryLabel}
          platformTotals={{
            cars: stats.cars,
            services: stats.services,
            users: stats.users,
            eventsLoaded: analyticsEvents.length,
          }}
        />
      ) : tab === 'banners' ? (
        <AdminSiteBannersPanel banners={siteBanners} onChange={() => loadData().catch(() => {})} />
      ) : tab === 'cars' ? (
        <div className="space-y-6">
          <AdminPurgeExpiredButton />
          <AdminVipSmsScanButton />
          <AdminCarsPanel cars={cars} onDelete={deleteCar} onToggleVip={toggleVip} />
        </div>
      ) : tab === 'services' ? (
        <AdminServicesPanel
          services={services}
          onDelete={deleteServiceItem}
          categoryLabel={categoryLabel}
        />
      ) : tab === 'ads' ? (
        <AdminServiceAdsPanel
          ads={categoryAds}
          onChange={() => loadData().catch(() => {})}
          categoryLabel={categoryLabel}
        />
      ) : tab === 'reports' ? (
        <AdminReportsPanel />
      ) : tab === 'users' ? (
        <AdminUsersPanel users={userRows} onChange={() => loadData().catch(() => {})} />
      ) : (
        <AdminSiteSettingsPanel />
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
