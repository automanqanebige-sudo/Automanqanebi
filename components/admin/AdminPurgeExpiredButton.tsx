'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore/lite'
import { useLanguage } from '@/context/LanguageContext'
import { getDb } from '@/lib/firebase-db'
import { isFirebaseConfigured } from '@/lib/firebase'
import { docToCar, type FirestoreCarDoc } from '@/lib/cars-mapper'
import { isListingExpired } from '@/lib/listing-lifecycle'

export default function AdminPurgeExpiredButton() {
  const { t } = useLanguage()
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const purge = async () => {
    if (!isFirebaseConfigured()) return
    if (!confirm(t('admin.purgeExpiredConfirm'))) return
    setBusy(true)
    setResult(null)
    try {
      const snap = await getDocs(collection(getDb(), 'cars'))
      let deleted = 0
      for (const d of snap.docs) {
        const car = docToCar(d.id, d.data() as FirestoreCarDoc)
        if (isListingExpired(car)) {
          await deleteDoc(doc(getDb(), 'cars', d.id))
          deleted += 1
        }
      }
      setResult(t('admin.purgeExpiredDone').replace('{n}', String(deleted)))
    } catch {
      setResult(t('admin.purgeExpiredError'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="mb-3 text-sm text-muted-foreground">{t('admin.purgeExpiredHint')}</p>
      <button
        type="button"
        disabled={busy}
        onClick={purge}
        className="inline-flex items-center gap-2 rounded-lg border border-destructive/40 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 disabled:opacity-50"
      >
        <Trash2 className="h-4 w-4" />
        {busy ? t('auth.loading') : t('admin.purgeExpired')}
      </button>
      {result && <p className="mt-2 text-sm text-foreground">{result}</p>}
    </div>
  )
}
