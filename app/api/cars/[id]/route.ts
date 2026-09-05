import { NextResponse } from 'next/server'
import { getSampleCarById } from '@/lib/cars-mapper'
import { fetchFirestoreCarById } from '@/lib/cars-firestore'

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const sample = getSampleCarById(params.id)
  if (sample) {
    return NextResponse.json(sample)
  }

  try {
    const car = await fetchFirestoreCarById(params.id)
    if (!car) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    return NextResponse.json(car)
  } catch {
    return NextResponse.json({ error: 'Unavailable' }, { status: 503 })
  }
}
