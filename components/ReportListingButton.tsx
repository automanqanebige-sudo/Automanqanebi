'use client'

import { useState } from 'react'
import { Flag } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { createListingReport } from '@/lib/reports-firestore'
import type { ReportListingType, ReportReason } from '@/types/report'

type ReportListingButtonProps = {
  listingId: string
  listingType?: ReportListingType
  className?: string
}

const REASONS: ReportReason[] = ['wrong_data', 'sold', 'fraud']

export default function ReportListingButton({
  listingId,
  listingType = 'car',
  className = '',
}: ReportListingButtonProps) {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState<ReportReason>('wrong_data')
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const submit = async () => {
    setSaving(true)
    setError('')
    try {
      await createListingReport({
        listingId,
        listingType,
        reason,
        message: message.trim() || undefined,
        reporterId: user?.uid,
        reporterEmail: user?.email ?? undefined,
      })
      setDone(true)
      setTimeout(() => {
        setOpen(false)
        setDone(false)
        setMessage('')
      }, 1500)
    } catch {
      setError(t('report.error'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-destructive ${className}`}
      >
        <Flag className="h-4 w-4" />
        {t('report.button')}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-xl">
            <h3 className="text-lg font-bold text-foreground">{t('report.title')}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t('report.subtitle')}</p>

            <div className="mt-4 space-y-2">
              {REASONS.map((r) => (
                <label
                  key={r}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                    reason === r ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                >
                  <input
                    type="radio"
                    name="report-reason"
                    checked={reason === r}
                    onChange={() => setReason(r)}
                  />
                  {t(`report.reason.${r}`)}
                </label>
              ))}
            </div>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('report.messagePlaceholder')}
              rows={3}
              className="mt-3 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            />

            {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
            {done && <p className="mt-2 text-sm text-primary">{t('report.success')}</p>}

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-secondary"
              >
                {t('admin.adCancel')}
              </button>
              <button
                type="button"
                disabled={saving || done}
                onClick={submit}
                className="btn-primary rounded-xl px-4 py-2 text-sm disabled:opacity-50"
              >
                {saving ? t('auth.loading') : t('report.submit')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
