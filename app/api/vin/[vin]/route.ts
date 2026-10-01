import { NextResponse } from 'next/server'
import {
  isValidVinFormat,
  normalizeVin,
  parseNhtsaVinResponse,
} from '@/lib/vin'

export async function GET(
  _request: Request,
  { params }: { params: { vin: string } }
) {
  const vin = normalizeVin(params.vin)

  if (!isValidVinFormat(vin)) {
    return NextResponse.json(
      { vin, valid: false, error: 'invalid_format' },
      { status: 400 }
    )
  }

  try {
    const res = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${encodeURIComponent(vin)}?format=json`,
      { next: { revalidate: 86400 } }
    )

    if (!res.ok) {
      return NextResponse.json(
        { vin, valid: false, error: 'decode_failed' },
        { status: 502 }
      )
    }

    const data = await res.json()
    const result = parseNhtsaVinResponse(vin, data)

    if (!result.valid) {
      return NextResponse.json(result, { status: 404 })
    }

    return NextResponse.json(result)
  } catch {
    return NextResponse.json(
      { vin, valid: false, error: 'decode_failed' },
      { status: 502 }
    )
  }
}
