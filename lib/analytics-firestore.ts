import { addDoc, collection, getDocs, limit, orderBy, query } from 'firebase/firestore/lite'
import { getDb } from '@/lib/firebase-db'
import { isFirebaseConfigured } from '@/lib/firebase'
import type { AnalyticsEvent, AnalyticsEventType } from '@/types/analytics'

const COLLECTION = 'analyticsEvents'
const MAX_EVENTS = 3000

export async function logAnalyticsEvent(
  type: AnalyticsEventType,
  meta?: Record<string, string | number | boolean | undefined>,
  userId?: string | null
): Promise<void> {
  if (!isFirebaseConfigured()) return
  if (typeof window === 'undefined') return

  try {
    await addDoc(collection(getDb(), COLLECTION), {
      type,
      createdAt: new Date().toISOString(),
      ...(userId ? { userId } : {}),
      ...(meta && Object.keys(meta).length > 0 ? { meta } : {}),
    })
  } catch {
    /* non-blocking */
  }
}

export async function fetchAnalyticsEvents(): Promise<AnalyticsEvent[]> {
  if (!isFirebaseConfigured()) return []

  try {
    const q = query(
      collection(getDb(), COLLECTION),
      orderBy('createdAt', 'desc'),
      limit(MAX_EVENTS)
    )
    const snap = await getDocs(q)
    return snap.docs.map((d) => {
      const data = d.data()
      return {
        id: d.id,
        type: data.type as AnalyticsEventType,
        createdAt: String(data.createdAt ?? ''),
        userId: data.userId,
        meta: data.meta,
      }
    })
  } catch {
    return []
  }
}
