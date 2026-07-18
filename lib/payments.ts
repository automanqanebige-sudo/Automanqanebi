import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore/lite'
import { getDb } from '@/lib/firebase-db'
import { isFirebaseConfigured } from '@/lib/firebase'
import { bumpCarListing, renewVipListing } from '@/lib/cars-lifecycle-actions'
import { BUMP_PRICE_GEL } from '@/lib/listing-lifecycle'
import { createUserNotification } from '@/lib/notifications-firestore'

export type PaymentKind = 'vip' | 'bump'

export type PaymentOrder = {
  id?: string
  kind: PaymentKind
  carId: string
  userId: string
  amountGel: number
  tier?: string
  status: 'pending' | 'paid' | 'failed'
  provider: string
  createdAt: string
  paidAt?: string
}

const VIP_PRICES: Record<string, number> = {
  silver: 29,
  gold: 49,
  platinum: 79,
  vip: 29,
  vip_plus: 49,
  super_vip: 79,
}

export function priceForPayment(kind: PaymentKind, tier?: string): number {
  if (kind === 'bump') return BUMP_PRICE_GEL
  return VIP_PRICES[tier || 'gold'] ?? 49
}

/** Use NEXT_PUBLIC_PAYMENT_PROVIDER=stub|bog (default stub). */
export function paymentsProvider(): string {
  return (
    process.env.NEXT_PUBLIC_PAYMENT_PROVIDER ||
    process.env.PAYMENT_PROVIDER ||
    'stub'
  ).toLowerCase()
}

/**
 * Create payment order while authenticated (client).
 * Stub provider auto-fulfills with Firestore owner permissions.
 */
export async function createAndMaybeFulfillPayment(input: {
  kind: PaymentKind
  carId: string
  userId: string
  tier?: string
}): Promise<{ orderId: string; status: PaymentOrder['status']; amountGel: number; stub: boolean }> {
  if (!isFirebaseConfigured()) throw new Error('Firebase not configured')

  const amountGel = priceForPayment(input.kind, input.tier)
  const provider = paymentsProvider()
  const createdAt = new Date().toISOString()

  const ref = await addDoc(collection(getDb(), 'paymentOrders'), {
    kind: input.kind,
    carId: input.carId,
    userId: input.userId,
    amountGel,
    tier: input.tier || null,
    status: 'pending',
    provider,
    createdAt,
  })

  if (provider === 'stub') {
    await fulfillPaymentOrder(ref.id)
    return { orderId: ref.id, status: 'paid', amountGel, stub: true }
  }

  return { orderId: ref.id, status: 'pending', amountGel, stub: false }
}

export async function fulfillPaymentOrder(orderId: string): Promise<PaymentOrder | null> {
  if (!isFirebaseConfigured()) return null

  const ref = doc(getDb(), 'paymentOrders', orderId)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null

  const data = snap.data() as PaymentOrder
  if (data.status === 'paid') return { ...data, id: orderId }

  if (data.kind === 'vip') {
    await renewVipListing(data.carId)
    if (data.tier) {
      try {
        await updateDoc(doc(getDb(), 'cars', data.carId), {
          listingType: data.tier,
          isVip: true,
        })
      } catch {
        /* ignore */
      }
    }
  } else if (data.kind === 'bump') {
    await bumpCarListing(data.carId)
  }

  const paidAt = new Date().toISOString()
  await updateDoc(ref, { status: 'paid', paidAt })

  await createUserNotification(data.userId, {
    title: data.kind === 'vip' ? 'VIP გააქტიურდა' : 'განცხადება წინ წამოიწია',
    body:
      data.kind === 'vip'
        ? `გადახდილია ${data.amountGel}₾ — VIP განახლებულია`
        : `გადახდილია ${data.amountGel}₾ — bump წარმატებულია`,
    url: `/car/${data.carId}`,
  })

  return { ...data, id: orderId, status: 'paid', paidAt }
}
