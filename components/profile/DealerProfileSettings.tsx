'use client'

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { Building2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { AUTH_INPUT_CLASS } from '@/components/auth/AuthLayout'
import { fetchUserProfile, saveUserProfile } from '@/lib/user-profile-firestore'

export default function DealerProfileSettings() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [dealerName, setDealerName] = useState('')
  const [dealerSlug, setDealerSlug] = useState('')
  const [dealerLogo, setDealerLogo] = useState('')
  const [approved, setApproved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    if (!user) return
    fetchUserProfile(user.uid).then((p) => {
      setDealerName(p.dealerName || '')
      setDealerSlug(p.dealerSlug || '')
      setDealerLogo(p.dealerLogo || '')
      setApproved(Boolean(p.dealerApproved))
    })
  }, [user])

  if (!user) return null

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMsg('')
    try {
      const slug = dealerSlug
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
      await saveUserProfile(user.uid, {
        role: 'dealer',
        dealerName: dealerName.trim(),
        dealerSlug: slug,
        dealerLogo: dealerLogo.trim() || undefined,
      })
      setDealerSlug(slug)
      setMsg(t('dealer.requestSaved'))
    } catch {
      setMsg(t('dealer.requestError'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
        <Building2 className="h-5 w-5 text-primary" />
        {t('dealer.settingsTitle')}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">{t('dealer.settingsSubtitle')}</p>
      {approved ? (
        <p className="mt-2 text-sm text-primary">
          {t('dealer.approved')}{' '}
          {dealerSlug && (
            <Link href={`/dealer/${dealerSlug}`} className="underline">
              /dealer/{dealerSlug}
            </Link>
          )}
        </p>
      ) : (
        <p className="mt-2 text-sm text-amber-700">{t('dealer.pendingApproval')}</p>
      )}
      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <input
          className={AUTH_INPUT_CLASS}
          value={dealerName}
          onChange={(e) => setDealerName(e.target.value)}
          placeholder={t('dealer.namePlaceholder')}
          required
        />
        <input
          className={AUTH_INPUT_CLASS}
          value={dealerSlug}
          onChange={(e) => setDealerSlug(e.target.value)}
          placeholder={t('dealer.slugPlaceholder')}
          required
        />
        <input
          className={AUTH_INPUT_CLASS}
          value={dealerLogo}
          onChange={(e) => setDealerLogo(e.target.value)}
          placeholder={t('dealer.logoPlaceholder')}
        />
        <button
          type="submit"
          disabled={saving}
          className="btn-primary rounded-xl px-4 py-2 text-sm disabled:opacity-50"
        >
          {saving ? t('auth.loading') : t('dealer.saveRequest')}
        </button>
        {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
      </form>
    </section>
  )
}
