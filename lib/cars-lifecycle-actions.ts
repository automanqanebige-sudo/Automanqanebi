import { doc, increment, updateDoc } from 'firebase/firestore/lite'
import { getDb } from '@/lib/firebase-db'
import { isFirebaseConfigured } from '@/lib/firebase'
import { logAnalyticsEvent } from '@/lib/analytics-firestore'
import { computeExpiresAt } from '@/lib/listing-lifecycle'

const VIEWED_KEY = 'car_viewed_'

export async function incrementCarViews(carId: string): Promise<void> {
  if (!isFirebaseConfigured() || typeof window === 'undefined') return
  if (carId.startsWith('sample') || carId.length < 8) return
  try {
    if (sessionStorage.getItem(VIEWED_KEY + carId)) return
    sessionStorage.setItem(VIEWED_KEY + carId, '1')
    await updateDoc(doc(getDb(), 'cars', carId), {
      views: increment(1),
    })
    void logAnalyticsEvent('car_view', { carId })
  } catch {
    /* ignore */
  }
}

export async function bumpCarListing(carId: string): Promise<void> {
  if (!isFirebaseConfigured()) throw new Error('Firebase not configured')
  const now = new Date()
  await updateDoc(doc(getDb(), 'cars', carId), {
    bumpedAt: now,
    updatedAt: now,
  })
}

export async function renewVipListing(carId: string, days = 30): Promise<void> {
  if (!isFirebaseConfigured()) throw new Error('Firebase not configured')
  const now = new Date()
  const vipExpiresAt = computeExpiresAt(now)
  // keep listing expiresAt aligned with renewal window optionally
  await updateDoc(doc(getDb(), 'cars', carId), {
    vipExpiresAt,
    renewalNotifiedAt: null,
    inAppRenewalNotifiedAt: null,
    updatedAt: now,
    isVip: true,
  })
  void days
}

export function buildListingLifecycleFields(listingType?: string) {
  const now = new Date()
  const expiresAt = computeExpiresAt(now)
  const isVip = Boolean(
    listingType &&
      ['vip', 'vip_plus', 'super_vip', 'silver', 'gold', 'platinum'].includes(listingType)
  )
  return {
    views: 0,
    favoriteCount: 0,
    expiresAt,
    bumpedAt: now,
    createdAt: now,
    updatedAt: now,
    ...(isVip ? { vipExpiresAt: expiresAt, isVip: true } : { isVip: false }),
  }
}
