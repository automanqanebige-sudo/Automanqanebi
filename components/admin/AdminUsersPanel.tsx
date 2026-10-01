'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { doc, getDoc, updateDoc } from 'firebase/firestore/lite'
import { useLanguage } from '@/context/LanguageContext'
import { getDb } from '@/lib/firebase-db'

export type AdminUserRow = {
  id: string
  displayName?: string
  phone?: string
  email?: string
  carsCount: number
  servicesCount: number
  role?: string
  dealerSlug?: string
  dealerName?: string
  dealerApproved?: boolean
}

type AdminUsersPanelProps = {
  users: AdminUserRow[]
  onChange?: () => void
}

export default function AdminUsersPanel({ users, onChange }: AdminUsersPanelProps) {
  const { t } = useLanguage()
  const [query, setQuery] = useState('')
  const [extra, setExtra] = useState<Record<string, Partial<AdminUserRow>>>({})
  const [busyId, setBusyId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const map: Record<string, Partial<AdminUserRow>> = {}
      await Promise.all(
        users.slice(0, 80).map(async (u) => {
          try {
            const snap = await getDoc(doc(getDb(), 'users', u.id))
            if (snap.exists()) {
              const d = snap.data()
              map[u.id] = {
                role: d.role,
                dealerSlug: d.dealerSlug,
                dealerName: d.dealerName,
                dealerApproved: d.dealerApproved,
              }
            }
          } catch {
            /* ignore */
          }
        })
      )
      if (!cancelled) setExtra(map)
    })()
    return () => {
      cancelled = true
    }
  }, [users])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const merged = users.map((u) => ({ ...u, ...extra[u.id] }))
    if (!q) return merged
    return merged.filter((u) =>
      [u.displayName, u.phone, u.email, u.id, u.dealerSlug, u.dealerName].some((v) =>
        String(v ?? '').toLowerCase().includes(q)
      )
    )
  }, [users, query, extra])

  const approveDealer = async (user: AdminUserRow, approved: boolean) => {
    setBusyId(user.id)
    try {
      await updateDoc(doc(getDb(), 'users', user.id), {
        role: 'dealer',
        dealerApproved: approved,
      })
      setExtra((prev) => ({
        ...prev,
        [user.id]: { ...prev[user.id], role: 'dealer', dealerApproved: approved },
      }))
      onChange?.()
    } finally {
      setBusyId(null)
    }
  }

  if (users.length === 0) {
    return <p className="text-muted-foreground">{t('admin.noUsers')}</p>
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{t('admin.usersHint')}</p>
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('admin.searchUsers')}
          className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-3 text-sm"
        />
      </div>

      <ul className="space-y-3">
        {filtered.map((user) => (
          <li key={user.id} className="rounded-xl border border-border bg-card p-4">
            <p className="font-semibold text-foreground">
              {user.displayName || user.email || user.id}
            </p>
            {user.email && user.displayName && (
              <p className="text-sm text-muted-foreground">{user.email}</p>
            )}
            {user.phone && <p className="text-sm text-muted-foreground">{user.phone}</p>}
            {(user.role === 'dealer' || user.dealerSlug) && (
              <p className="mt-1 text-sm text-foreground">
                {t('dealer.badge')}: {user.dealerName || '—'}{' '}
                {user.dealerSlug && (
                  <Link href={`/dealer/${user.dealerSlug}`} className="text-primary hover:underline">
                    /dealer/{user.dealerSlug}
                  </Link>
                )}{' '}
                ·{' '}
                {user.dealerApproved ? t('dealer.approved') : t('dealer.pendingApproval')}
              </p>
            )}
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span>
                {t('admin.tabCars')}: {user.carsCount}
              </span>
              <span>
                {t('admin.tabServices')}: {user.servicesCount}
              </span>
            </div>
            {(user.role === 'dealer' || user.dealerSlug) && !user.dealerApproved && (
              <button
                type="button"
                disabled={busyId === user.id}
                onClick={() => approveDealer(user, true)}
                className="btn-primary mt-3 rounded-xl px-3 py-1.5 text-sm disabled:opacity-50"
              >
                {t('admin.approveDealer')}
              </button>
            )}
            {user.dealerApproved && (
              <button
                type="button"
                disabled={busyId === user.id}
                onClick={() => approveDealer(user, false)}
                className="mt-3 rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-secondary disabled:opacity-50"
              >
                {t('admin.revokeDealer')}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
