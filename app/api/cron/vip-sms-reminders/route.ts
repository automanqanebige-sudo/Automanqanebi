import { NextRequest, NextResponse } from 'next/server'
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore/lite'
import { getDb } from '@/lib/firebase-db'
import { isFirebaseConfigured } from '@/lib/firebase'
import { docToCar, type FirestoreCarDoc } from '@/lib/cars-mapper'
import { isVipListingType, isVipRenewalDue } from '@/lib/listing-lifecycle'
import { sendSms } from '@/lib/sms-send'
import { assertCronOrAdminAuth } from '@/lib/cron-auth'

/**
 * Scan VIP listings due for renewal and SMS the seller.
 * Requires CRON_SECRET or admin Firebase ID token. No open SMS relay.
 */
export async function POST(req: NextRequest) {
  const denied = await assertCronOrAdminAuth(req)
  if (denied) return denied

  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: 'Firebase not configured' }, { status: 503 })
  }

  const body = (await req.json().catch(() => ({}))) as {
    scan?: boolean
  }

  if (body.scan !== true && body.scan !== undefined) {
    // Only scan mode is supported (prevents SMS relay abuse).
  }

  const snap = await getDocs(collection(getDb(), 'cars'))
  let notified = 0
  let skipped = 0
  let scanned = 0
  const MAX_SCAN = 500
  const details: { id: string; phone?: string; status: string }[] = []

  for (const d of snap.docs) {
    if (scanned >= MAX_SCAN) break
    scanned += 1
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

    // Claim first to reduce duplicate SMS if the process crashes mid-send.
    await updateDoc(doc(getDb(), 'cars', d.id), {
      renewalNotifiedAt: new Date(),
    })

    const result = await sendSms(phone, message)
    notified += 1
    details.push({ id: d.id, phone, status: result.stub ? 'stub' : 'sent' })
  }

  return NextResponse.json({ ok: true, notified, skipped, scanned, details })
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
