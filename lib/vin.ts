export type VinDecodeResult = {
  vin: string
  valid: boolean
  make?: string
  model?: string
  modelYear?: string
  bodyClass?: string
  vehicleType?: string
  engineCylinders?: string
  displacementL?: string
  fuelType?: string
  plantCountry?: string
  driveType?: string
  error?: 'invalid_format' | 'not_found' | 'decode_failed'
}

export function normalizeVin(input: string): string {
  return input.trim().toUpperCase().replace(/\s+/g, '')
}

export function isValidVinFormat(vin: string): boolean {
  return vin.length === 17 && /^[A-HJ-NPR-Z0-9]{17}$/.test(vin)
}

type NhtsaItem = { Variable?: string; Value?: string | null }

export function parseNhtsaVinResponse(vin: string, data: { Results?: NhtsaItem[] }): VinDecodeResult {
  const rows = data.Results ?? []
  const map = new Map<string, string>()

  for (const row of rows) {
    if (row.Variable && row.Value != null && String(row.Value).trim()) {
      map.set(row.Variable, String(row.Value).trim())
    }
  }

  const errorCode = map.get('Error Code') ?? ''
  const errorText = map.get('Error Text') ?? ''

  if (errorCode && errorCode !== '0' && !map.get('Make')) {
    return {
      vin,
      valid: false,
      error: errorText.toLowerCase().includes('invalid') ? 'invalid_format' : 'not_found',
    }
  }

  const make = map.get('Make')
  const model = map.get('Model')
  const modelYear = map.get('Model Year')

  if (!make && !model && !modelYear) {
    return { vin, valid: false, error: 'not_found' }
  }

  return {
    vin,
    valid: true,
    make: make || undefined,
    model: model || undefined,
    modelYear: modelYear || undefined,
    bodyClass: map.get('Body Class') || undefined,
    vehicleType: map.get('Vehicle Type') || undefined,
    engineCylinders: map.get('Engine Number of Cylinders') || undefined,
    displacementL: map.get('Displacement (L)') || undefined,
    fuelType: map.get('Fuel Type - Primary') || undefined,
    plantCountry: map.get('Plant Country') || undefined,
    driveType: map.get('Drive Type') || undefined,
  }
}
