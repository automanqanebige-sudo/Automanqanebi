'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Check, Flag, Trash2, X } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import {
  deleteListingReport,
  fetchListingReports,
  updateReportStatus,
} from '@/lib/reports-firestore'
import type { ListingReport } from '@/types/report'

export default function AdminReportsPanel() {
  const { t } = useLanguage()
  const [reports, setReports] = useState<ListingReport[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    fetchListingReports()
      .then(setReports)
      .catch(() => setReports([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const setStatus = async (id: string, status: ListingReport['status']) => {
    await updateReportStatus(id, status)
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
  }

  const remove = async (id: string) => {
    if (!confirm(t('admin.reports.deleteConfirm'))) return
    await deleteListingReport(id)
    setReports((prev) => prev.filter((r) => r.id !== id))
  }

  if (loading) {
    return <p className="text-muted-foreground">{t('car.loading')}</p>
  }

  if (reports.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card px-6 py-10 text-center text-muted-foreground">
        {t('admin.reports.empty')}
      </div>
    )
  }

  return (
    <ul className="space-y-3">
      {reports.map((r) => (
        <li
          key={r.id}
          className="rounded-xl border border-border bg-card p-4"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="inline-flex items-center gap-2 font-semibold text-foreground">
                <Flag className="h-4 w-4 text-destructive" />
                {t(`report.reason.${r.reason}`)}
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    r.status === 'open'
                      ? 'bg-amber-500/15 text-amber-700'
                      : r.status === 'resolved'
                        ? 'bg-primary/15 text-primary'
                        : 'bg-secondary text-muted-foreground'
                  }`}
                >
                  {t(`admin.reports.status.${r.status}`)}
                </span>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {r.listingType}:{' '}
                <Link
                  href={r.listingType === 'car' ? `/car/${r.listingId}` : `/services/${r.listingId}`}
                  className="text-primary hover:underline"
                >
                  {r.listingId}
                </Link>
              </p>
              {r.message && <p className="mt-2 text-sm text-foreground">{r.message}</p>}
              <p className="mt-2 text-xs text-muted-foreground">
                {r.reporterEmail || r.reporterId || '—'} · {r.createdAt.slice(0, 16).replace('T', ' ')}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {r.status === 'open' && (
                <>
                  <button
                    type="button"
                    onClick={() => setStatus(r.id, 'resolved')}
                    className="inline-flex items-center gap-1 rounded-lg border border-primary/30 px-3 py-1.5 text-sm text-primary hover:bg-primary/10"
                  >
                    <Check className="h-4 w-4" />
                    {t('admin.reports.resolve')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus(r.id, 'dismissed')}
                    className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-secondary"
                  >
                    <X className="h-4 w-4" />
                    {t('admin.reports.dismiss')}
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => remove(r.id)}
                className="inline-flex items-center gap-1 rounded-lg border border-destructive/30 px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
                {t('profile.delete')}
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
