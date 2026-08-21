import { NextRequest, NextResponse } from 'next/server'
import { paymentsProvider, priceForPayment } from '@/lib/payments'

/** Public pricing / provider info for UI. */
export async function GET() {
  return NextResponse.json({
    provider: paymentsProvider(),
    bumpGel: priceForPayment('bump'),
    vip: {
      silver: priceForPayment('vip', 'silver'),
      gold: priceForPayment('vip', 'gold'),
      platinum: priceForPayment('vip', 'platinum'),
    },
    stub: paymentsProvider() === 'stub',
    checkout: true,
  })
}

/**
 * Placeholder for bank order creation (BOG etc.).
 * Client currently creates Firestore orders via createPaymentOrder.
 */
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as {
    kind?: string
    tier?: string
  } | null

  return NextResponse.json({
    ok: true,
    provider: paymentsProvider(),
    stub: paymentsProvider() === 'stub',
    amountGel: priceForPayment(
      body?.kind === 'bump' ? 'bump' : 'vip',
      body?.tier
    ),
    message:
      paymentsProvider() === 'stub'
        ? 'Use client createPaymentOrder → /payments/checkout'
        : 'Wire bank redirect here when BOG keys are available',
  })
}
