'use client'

import { auth, db } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { collection, query, where, getDocs } from 'firebase/firestore'
import Navbar from '@/components/Navbar'
import CarCard from '@/components/CarCard'
import { User, LogOut, Car, Heart, Settings, Loader2, Eye, MessageCircle } from 'lucide-react'
import Link from 'next/link'

export default function ProfilePage() {
  const t = useTranslations()
  const [user, setUser] = useState<any>(null)
  const [myCars, setMyCars] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'listings' | 'favorites'>('listings')
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (u) => {
      if (u) {
        setUser(u)
        // Fetch user's cars
        try {
          const carsRef = collection(db, 'cars')
          const q = query(carsRef, where('userId', '==', u.uid))
          const snapshot = await getDocs(q)
          const cars = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }))
          setMyCars(cars)
        } catch (error) {
          console.error('Error fetching user cars:', error)
        }
        setLoading(false)
      } else {
        router.push('/login')
      }
    })
    return () => unsubscribe()
  }, [router])

  const handleSignOut = async () => {
    await auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        {/* Profile Header */}
        <div className="mb-8 flex flex-col items-start gap-6 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || t('profile.user')}
                className="h-16 w-16 rounded-full border-2 border-primary/20 object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <User className="h-8 w-8 text-primary" />
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold text-foreground">
                {user?.displayName || t('profile.user')}
              </h1>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/add-car"
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Car className="h-4 w-4" />
              {t('addCar.title')}
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              <LogOut className="h-4 w-4" />
              {t('nav.logout')}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{myCars.length}</p>
            <p className="text-sm text-muted-foreground">{t('home.listings')}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <div className="flex items-center justify-center gap-1">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <p className="text-2xl font-bold text-foreground">0</p>
            </div>
            <p className="text-sm text-muted-foreground">{t('profile.views')}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <div className="flex items-center justify-center gap-1">
              <Heart className="h-4 w-4 text-muted-foreground" />
              <p className="text-2xl font-bold text-foreground">0</p>
            </div>
            <p className="text-sm text-muted-foreground">{t('favorites.title')}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <div className="flex items-center justify-center gap-1">
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
              <p className="text-2xl font-bold text-foreground">0</p>
            </div>
            <p className="text-sm text-muted-foreground">{t('profile.messages')}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex items-center gap-2 rounded-xl bg-card p-1">
          <button
            onClick={() => setActiveTab('listings')}
            className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors ${
              activeTab === 'listings'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Car className="h-4 w-4" />
            {t('profile.myListings')}
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors ${
              activeTab === 'favorites'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Heart className="h-4 w-4" />
            {t('favorites.title')}
          </button>
        </div>

        {/* Content */}
        {activeTab === 'listings' ? (
          myCars.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {myCars.map((car: any, i: number) => (
                <CarCard key={car.id || i} car={car} index={i} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 py-16">
              <Car className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">{t('profile.noListings')}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t('profile.noListingsDescription')}</p>
              <Link
                href="/add-car"
                className="mt-6 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {t('addCar.title')}
              </Link>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 py-16">
            <Heart className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">{t('profile.noFavorites')}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t('profile.noFavoritesDescription')}</p>
            <Link
              href="/"
              className="mt-6 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {t('favorites.browseCars')}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
