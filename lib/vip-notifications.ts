import { doc, updateDoc } from 'firebase/firestore/lite'
import { getDb } from '@/lib/firebase-db'
import { isFirebaseConfigured } from '@/lib/firebase'
import { fetchUserCars } from '@/lib/cars-firestore'
import { createUserNotification } from '@/lib/notifications-firestore'
import { isVipListingType, isVipRenewalDue } from '@/lib/listing-lifecycle'

/**
 * When the signed-in seller opens the app, create an in-app VIP renewal reminder
 * (SMS may already have been sent by cron). Deduped via cars.inAppRenewalNotifiedAt.
 */
export async function syncVipRenewalNotifications(userId: string): Promise<number> {
  if (!isFirebaseConfigured() || !userId) return 0

  let created = 0
  try {
    const cars = await fetchUserCars(userId)
    for (const car of cars) {
      const vip =
        isVipListingType(car.listingType) || Boolean(car.isVip) || Boolean(car.vipExpiresAt)
      if (!vip) continue

      const due = isVipRenewalDue({
        vipExpiresAt: car.vipExpiresAt ?? car.expiresAt,
      })
      if (!due) continue

      const already = Boolean(car.inAppRenewalNotifiedAt)
      if (already) continue

      const title = `${car.year} ${car.brand} ${car.model}`.trim()
      await createUserNotification(userId, {
        kind: 'vip',
        title: 'VIP ვადა იწურება',
        body: `${title || 'განცხადება'} — განაახლე VIP პროფილიდან, წინააღმდეგ შემთხვევაში წაიშლება.`,
        url: `/profile`,
      })

      try {
        await updateDoc(doc(getDb(), 'cars', car.id), {
          inAppRenewalNotifiedAt: new Date().toISOString(),
        })
      } catch {
        /* best-effort dedupe flag */
      }
      created += 1
    }
  } catch (err) {
    console.error('[vip-notif]', err)
  }
  return created
}
