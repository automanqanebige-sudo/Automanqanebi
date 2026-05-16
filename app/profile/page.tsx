'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Car, LogOut, Mail } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'

export default function ProfilePage() {
  const { user, loading, configured, logout } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()

  useEffect(() => {
    if (!loading && configured && !user) {
      router.replace('/login?redirect=/profile')
    }
  }, [user, loading, configured, router])

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground">
        {t('auth.loading')}
      </div>
    )
  }

  if (!user) return null

  const initial = (user.displayName || user.email || '?').charAt(0).toUpperCase()

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        {user.photoURL ? (
          <Image
            src={user.photoURL}
            alt=""
            width={96}
            height={96}
            className="mx-auto h-24 w-24 rounded-full object-cover ring-4 ring-primary/20"
          />
        ) : (
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground">
            {initial}
          </div>
        )}

        <h1 className="mt-4 text-2xl font-bold text-foreground">
          {user.displayName || t('auth.profile.member')}
        </h1>

        {user.email && (
          <p className="mt-2 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            {user.email}
          </p>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/add-car"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Car className="h-4 w-4" />
            {t('nav.addCar')}
          </Link>
          <button
            type="button"
            onClick={() => logout().then(() => router.push('/'))}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-5 py-2.5 font-medium text-foreground transition-colors hover:bg-secondary"
          >
            <LogOut className="h-4 w-4" />
            {t('auth.logout')}
          </button>
        </div>
      </div>
    </div>
  )
}
