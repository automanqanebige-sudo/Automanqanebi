import { NextResponse } from 'next/server'
import { getCarById } from '@/data/cars'

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const car = getCarById(params.id)
  if (!car) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json(car)
}
