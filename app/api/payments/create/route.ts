import { NextResponse } from 'next/server'
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
  })
}
