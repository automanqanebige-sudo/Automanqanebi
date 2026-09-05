'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Building2, Phone, User } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { fetchUserProfile, type UserProfile } from '@/lib/user-profile-firestore'
import { telHref } from '@/lib/contact-links'

type SellerCardProps = {
  userId?: string
  fallbackPhone?: string
}

export default function SellerCard({ userId, fallbackPhone }: SellerCardProps) {
  const { t } = useLanguage()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(Boolean(userId))

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }
    let active = true
    fetchUserProfile(userId)
      .then((p) => {
        if (active) setProfile(p)
      })
      .catch(() => {
        if (active) setProfile(null)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [userId])

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="skeleton-shimmer h-4 w-24 rounded" />
        <div className="skeleton-shimmer mt-3 h-6 w-40 rounded" />
      </div>
    )
  }

  const isDealer = profile?.dealerApproved && profile.dealerSlug
  const name = profile?.dealerName || profile?.displayName
  const phone = profile?.phone || fallbackPhone

  if (!name && !phone && !isDealer) return null

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {isDealer ? t('dealer.badge') : t('car.seller')}
      </p>

      <div className="mt-3 flex items-center gap-3">
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-secondary">
          {profile?.dealerLogo ? (
            <Image src={profile.dealerLogo} alt="" fill className="object-cover" />
          ) : isDealer ? (
            <Building2 className="h-5 w-5 text-primary" />
          ) : (
            <User className="h-5 w-5 text-primary" />
          )}
        </div>
        <div className="min-w-0">
          {name && <p className="truncate font-semibold text-foreground">{name}</p>}
          {isDealer && profile?.dealerSlug && (
            <Link
              href={`/dealer/${profile.dealerSlug}`}
              className="text-sm text-primary transition-colors hover:underline"
            >
              {t('dealer.viewPublic')}
            </Link>
          )}
        </div>
      </div>

      {phone && (
        <a
          href={telHref(phone)}
          className="btn-secondary mt-4 inline-flex w-full rounded-xl px-4 py-2.5 text-sm"
        >
          <Phone className="h-4 w-4" />
          {phone}
        </a>
      )}
    </div>
  )
}
