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

export type VipTierId = 'silver' | 'gold' | 'platinum'

export const VIP_TIER_OPTIONS: { id: VipTierId; days: number; price: number }[] = [
  { id: 'silver', days: 30, price: 29 },
  { id: 'gold', days: 30, price: 49 },
  { id: 'platinum', days: 30, price: 79 },
]

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

export function checkoutPath(orderId: string): string {
  return `/payments/checkout?orderId=${encodeURIComponent(orderId)}`
}

/**
 * Create a pending payment order (client, authenticated).
 * Does not fulfill — user confirms on /payments/checkout.
 */
export async function createPaymentOrder(input: {
  kind: PaymentKind
  carId: string
  userId: string
  tier?: string
}): Promise<{ orderId: string; amountGel: number; checkoutUrl: string; stub: boolean }> {
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

  return {
    orderId: ref.id,
    amountGel,
    checkoutUrl: checkoutPath(ref.id),
    stub: provider === 'stub',
  }
}

/** @deprecated Prefer createPaymentOrder + checkout confirm */
export async function createAndMaybeFulfillPayment(input: {
  kind: PaymentKind
  carId: string
  userId: string
  tier?: string
}): Promise<{ orderId: string; status: PaymentOrder['status']; amountGel: number; stub: boolean }> {
  const created = await createPaymentOrder(input)
  if (!created.stub) {
    return { orderId: created.orderId, status: 'pending', amountGel: created.amountGel, stub: false }
  }
  const order = await confirmOwnPayment(created.orderId, input.userId)
  return {
    orderId: created.orderId,
    status: order?.status === 'paid' ? 'paid' : 'pending',
    amountGel: created.amountGel,
    stub: true,
  }
}

export async function fetchPaymentOrder(orderId: string): Promise<PaymentOrder | null> {
  if (!isFirebaseConfigured() || !orderId) return null
  const snap = await getDoc(doc(getDb(), 'paymentOrders', orderId))
  if (!snap.exists()) return null
  return { id: snap.id, ...(snap.data() as Omit<PaymentOrder, 'id'>) }
}

/**
 * Owner confirms stub payment on checkout page (uses their Firestore auth).
 */
export async function confirmOwnPayment(
  orderId: string,
  userId: string
): Promise<PaymentOrder | null> {
  const order = await fetchPaymentOrder(orderId)
  if (!order) return null
  if (order.userId !== userId) throw new Error('not-owner')
  if (order.status === 'paid') return order
  return fulfillPaymentOrder(orderId)
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
    kind: 'payment',
    title: data.kind === 'vip' ? 'VIP გააქტიურდა' : 'განცხადება წინ წამოიწია',
    body:
      data.kind === 'vip'
        ? `გადახდილია ${data.amountGel}₾ — VIP განახლებულია`
        : `გადახდილია ${data.amountGel}₾ — bump წარმატებულია`,
    url: `/car/${data.carId}`,
  })

  return { ...data, id: orderId, status: 'paid', paidAt }
}
