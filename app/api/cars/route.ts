import { NextResponse } from 'next/server'
import { sampleCars } from '@/data/cars'

/** Sample listings only — live Firestore cars load on the client. */
export async function GET() {
  return NextResponse.json(sampleCars)
}
