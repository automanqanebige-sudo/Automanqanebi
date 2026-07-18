import { NextRequest, NextResponse } from 'next/server'
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore/lite'
import { getDb } from '@/lib/firebase-db'
import { isFirebaseConfigured } from '@/lib/firebase'
import { docToCar, type FirestoreCarDoc } from '@/lib/cars-mapper'
import { isListingExpired } from '@/lib/listing-lifecycle'

/**
 * Expire / delete listings past expiresAt.
 * Protect with CRON_SECRET header in production.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (secret) {
    const auth = req.headers.get('authorization') || req.headers.get('x-cron-secret')
    if (auth !== `Bearer ${secret}` && auth !== secret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: 'Firebase not configured' }, { status: 503 })
  }

  const snap = await getDocs(collection(getDb(), 'cars'))
  let deleted = 0
  for (const d of snap.docs) {
    const car = docToCar(d.id, d.data() as FirestoreCarDoc)
    if (isListingExpired(car)) {
      await deleteDoc(doc(getDb(), 'cars', d.id))
      deleted += 1
    }
  }

  return NextResponse.json({ ok: true, deleted })
}

export async function GET(req: NextRequest) {
  return POST(req)
}
