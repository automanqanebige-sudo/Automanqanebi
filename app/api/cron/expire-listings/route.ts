import { NextRequest, NextResponse } from 'next/server'
import { collection, deleteDoc, doc, getDocs, limit, query, where } from 'firebase/firestore/lite'
import { getDb } from '@/lib/firebase-db'
import { isFirebaseConfigured } from '@/lib/firebase'
import { docToCar, type FirestoreCarDoc } from '@/lib/cars-mapper'
import { isListingExpired } from '@/lib/listing-lifecycle'
import { assertCronOrAdminAuth } from '@/lib/cron-auth'

const MAX_DELETE_PER_RUN = 100

/**
 * Expire / delete listings past expiresAt.
 * Requires CRON_SECRET or admin Firebase ID token. Caps deletes per run.
 */
export async function POST(req: NextRequest) {
  const denied = await assertCronOrAdminAuth(req)
  if (denied) return denied

  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: 'Firebase not configured' }, { status: 503 })
  }

  const nowIso = new Date().toISOString()
  let deleted = 0
  let scanned = 0

  try {
    // Prefer indexed query when expiresAt is stored as ISO / comparable string/timestamp.
    const q = query(
      collection(getDb(), 'cars'),
      where('expiresAt', '<', new Date(nowIso)),
      limit(MAX_DELETE_PER_RUN)
    )
    const snap = await getDocs(q)
    scanned = snap.size
    for (const d of snap.docs) {
      const car = docToCar(d.id, d.data() as FirestoreCarDoc)
      if (!isListingExpired(car)) continue
      await deleteDoc(doc(getDb(), 'cars', d.id))
      deleted += 1
    }
  } catch {
    // Fallback if expiresAt type/index mismatch — bounded full scan.
    const snap = await getDocs(collection(getDb(), 'cars'))
    for (const d of snap.docs) {
      if (deleted >= MAX_DELETE_PER_RUN) break
      scanned += 1
      const car = docToCar(d.id, d.data() as FirestoreCarDoc)
      if (isListingExpired(car)) {
        await deleteDoc(doc(getDb(), 'cars', d.id))
        deleted += 1
      }
    }
  }

  return NextResponse.json({ ok: true, deleted, scanned, cap: MAX_DELETE_PER_RUN })
}

export async function GET(req: NextRequest) {
  return POST(req)
}
