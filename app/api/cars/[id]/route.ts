import { NextResponse } from 'next/server'
import { getSampleCarById } from '@/lib/cars-mapper'

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const car = getSampleCarById(params.id)
  if (!car) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json(car)
}
