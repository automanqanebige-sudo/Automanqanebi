import { NextRequest, NextResponse } from 'next/server'
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore/lite'
import { getDb } from '@/lib/firebase-db'
import { isFirebaseConfigured } from '@/lib/firebase'
import { docToCar, type FirestoreCarDoc } from '@/lib/cars-mapper'
import { isVipListingType, isVipRenewalDue } from '@/lib/listing-lifecycle'
import { sendSms } from '@/lib/sms-send'

/**
 * Scan VIP listings due for renewal (days 28–29 of 30) and SMS the seller.
 * Protect with CRON_SECRET. Call daily via Cloud Scheduler / GitHub Action.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.CRON_SECRET || process.env.SMS_API_SECRET
  if (secret) {
    const auth = req.headers.get('authorization') || req.headers.get('x-cron-secret')
    if (auth !== `Bearer ${secret}` && auth !== secret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: 'Firebase not configured' }, { status: 503 })
  }

  const body = (await req.json().catch(() => ({}))) as {
    phone?: string
    message?: string
    listingId?: string
    scan?: boolean
  }

  // Legacy single-send mode
  if (body.phone && body.message && body.scan !== true) {
    const result = await sendSms(body.phone, body.message)
    return NextResponse.json({ ok: true, ...result, listingId: body.listingId })
  }

  const snap = await getDocs(collection(getDb(), 'cars'))
  let notified = 0
  let skipped = 0
  const details: { id: string; phone?: string; status: string }[] = []

  for (const d of snap.docs) {
    const data = d.data() as FirestoreCarDoc & {
      phone?: string
      userId?: string
      renewalNotifiedAt?: unknown
      vipExpiresAt?: unknown
      listingType?: string
    }
    const car = docToCar(d.id, data)
    const vip =
      isVipListingType(car.listingType) || Boolean(car.isVip) || Boolean(data.vipExpiresAt)

    if (!vip) continue

    const due = isVipRenewalDue({
      vipExpiresAt: car.vipExpiresAt ?? car.expiresAt,
    })
    if (!due) continue

    if (data.renewalNotifiedAt) {
      skipped += 1
      details.push({ id: d.id, status: 'already_notified' })
      continue
    }

    const phone = String(data.phone || '').trim()
    const title = `${car.year} ${car.brand} ${car.model}`
    const message =
      `automanqanebi.ge: VIP განცხადებას (${title}) ვადა უსრულდება. ` +
      `განაახლე პროფილიდან — წინააღმდეგ შემთხვევაში 30-ე დღეს წაიშლება.`

    if (!phone) {
      skipped += 1
      details.push({ id: d.id, status: 'no_phone' })
      continue
    }

    const result = await sendSms(phone, message)
    await updateDoc(doc(getDb(), 'cars', d.id), {
      renewalNotifiedAt: new Date(),
    })
    notified += 1
    details.push({ id: d.id, phone, status: result.stub ? 'stub' : 'sent' })
  }

  return NextResponse.json({ ok: true, notified, skipped, details })
}

export async function GET(req: NextRequest) {
  return POST(
    new NextRequest(req.url, {
      method: 'POST',
      headers: req.headers,
      body: JSON.stringify({ scan: true }),
    })
  )
}
