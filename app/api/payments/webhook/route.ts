import { NextRequest, NextResponse } from 'next/server'
import { fulfillPaymentOrder } from '@/lib/payments'

/**
 * Bank webhook / server confirm after external payment.
 * Always requires PAYMENT_WEBHOOK_SECRET or CRON_SECRET.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.PAYMENT_WEBHOOK_SECRET || process.env.CRON_SECRET
  if (!secret) {
    return NextResponse.json(
      { error: 'PAYMENT_WEBHOOK_SECRET is not configured' },
      { status: 503 }
    )
  }
  const auth = req.headers.get('authorization') || req.headers.get('x-webhook-secret')
  if (auth !== `Bearer ${secret}` && auth !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await req.json().catch(() => null)) as { orderId?: string } | null
  if (!body?.orderId) {
    return NextResponse.json({ error: 'orderId required' }, { status: 400 })
  }

  try {
    const order = await fulfillPaymentOrder(body.orderId)
    if (!order) {
      return NextResponse.json({ error: 'order not found' }, { status: 404 })
    }
    return NextResponse.json({ ok: true, order })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'fulfill failed' },
      { status: 500 }
    )
  }
}
