'use client'

import { useState } from 'react'
import { Bell } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

/** Admin: trigger VIP renewal SMS scan (same as cron). */
export default function AdminVipSmsScanButton() {
  const { t } = useLanguage()
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const run = async () => {
    if (!confirm(t('admin.vipSmsConfirm'))) return
    setBusy(true)
    setResult(null)
    try {
      const res = await fetch('/api/cron/vip-sms-reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scan: true }),
      })
      const data = (await res.json()) as { notified?: number; skipped?: number; error?: string }
      if (!res.ok) throw new Error(data.error || 'failed')
      setResult(
        t('admin.vipSmsDone')
          .replace('{n}', String(data.notified ?? 0))
          .replace('{s}', String(data.skipped ?? 0))
      )
    } catch {
      setResult(t('admin.vipSmsError'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="mb-3 text-sm text-muted-foreground">{t('admin.vipSmsHint')}</p>
      <button
        type="button"
        disabled={busy}
        onClick={run}
        className="inline-flex items-center gap-2 rounded-lg border border-primary/40 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 disabled:opacity-50"
      >
        <Bell className="h-4 w-4" />
        {busy ? t('auth.loading') : t('admin.vipSmsRun')}
      </button>
      {result && <p className="mt-2 text-sm text-foreground">{result}</p>}
    </div>
  )
}
