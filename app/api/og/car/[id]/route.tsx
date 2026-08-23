import { ImageResponse } from 'next/og'
import { fetchFirestoreCarById } from '@/lib/cars-firestore'
import { getCarById } from '@/data/cars'
import { DEFAULT_CAR_IMAGE } from '@/lib/cars-mapper'
import { isTestListing, isVerifiedListing } from '@/lib/listing-trust'

export const runtime = 'edge'
export const revalidate = 3600

type RouteParams = { params: { id: string } }

const FUEL_KA: Record<string, string> = {
  Petrol: 'ბენზინი',
  Diesel: 'დიზელი',
  Hybrid: 'ჰიბრიდი',
  Electric: 'ელექტრო',
  LPG: 'გაზი (LPG)',
  petrol: 'ბენზინი',
  diesel: 'დიზელი',
  hybrid: 'ჰიბრიდი',
  electric: 'ელექტრო',
  lpg: 'გაზი (LPG)',
}

async function loadFont(url: string): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    return await res.arrayBuffer()
  } catch {
    return null
  }
}

function formatPostedDate(iso?: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export async function GET(_req: Request, { params }: RouteParams) {
  const car =
    (await fetchFirestoreCarById(params.id).catch(() => null)) || getCarById(params.id) || null

  if (!car) {
    return new Response('Not found', { status: 404 })
  }

  const photo = (car.images?.[0] || car.image || DEFAULT_CAR_IMAGE).trim()
  const price = `${Math.round(car.price).toLocaleString('en-US')} ₾`
  const km = `${Math.round(car.mileage).toLocaleString('en-US')} km`
  const fuel = FUEL_KA[car.fuelType] || car.fuelType || ''
  const headline = `${car.year} ${car.brand} ${car.model}`
  const location = (car.location || 'საქართველო').trim()
  const posted = formatPostedDate(car.createdAt)
  const views = `${car.views ?? 0} ნახვა`
  const test = isTestListing(car)
  const verified = isVerifiedListing(car)
  const trustLabel = test ? 'სატესტო' : verified ? 'დამოწმებული' : null
  const trustBg = test ? '#b45309' : '#047857'

  const [latinBold, geoRegular, geoBold] = await Promise.all([
    loadFont(
      'https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts@main/hinted/ttf/NotoSans/NotoSans-Bold.ttf'
    ),
    loadFont(
      'https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts@main/hinted/ttf/NotoSansGeorgian/NotoSansGeorgian-Regular.ttf'
    ),
    loadFont(
      'https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts@main/hinted/ttf/NotoSansGeorgian/NotoSansGeorgian-Bold.ttf'
    ),
  ])

  const fonts: { name: string; data: ArrayBuffer; style: 'normal'; weight: 400 | 700 }[] = []
  if (latinBold) {
    fonts.push({ name: 'CardSans', data: latinBold, style: 'normal', weight: 700 })
  }
  if (geoBold) {
    fonts.push({ name: 'CardSans', data: geoBold, style: 'normal', weight: 700 })
  }
  if (geoRegular) {
    fonts.push({ name: 'CardSans', data: geoRegular, style: 'normal', weight: 400 })
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#ffffff',
          fontFamily: fonts.length ? 'CardSans' : 'sans-serif',
          borderRadius: 0,
          overflow: 'hidden',
        }}
      >
        {/* Photo — like listing card hero */}
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '400px',
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: '#e2e8f0',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo}
            alt=""
            width={1200}
            height={400}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />

          {trustLabel && (
            <div
              style={{
                position: 'absolute',
                left: 28,
                top: 28,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 18px',
                borderRadius: 999,
                backgroundColor: trustBg,
                color: '#ffffff',
                fontSize: 26,
                fontWeight: 700,
              }}
            >
              <span style={{ display: 'flex', fontSize: 22 }}>{test ? '⚗' : '✓'}</span>
              <span style={{ display: 'flex' }}>{trustLabel}</span>
            </div>
          )}

          <div
            style={{
              position: 'absolute',
              left: 28,
              bottom: 28,
              display: 'flex',
              padding: '12px 22px',
              borderRadius: 14,
              backgroundColor: '#16a34a',
              color: '#ffffff',
              fontSize: 36,
              fontWeight: 700,
              boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            }}
          >
            {price}
          </div>
        </div>

        {/* Info block — mirrors CarCard body */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 14,
            padding: '28px 40px 32px',
            height: '230px',
            backgroundColor: '#ffffff',
            color: '#0f172a',
            borderTop: '1px solid #e2e8f0',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 48,
              fontWeight: 700,
              lineHeight: 1.15,
              color: '#0f172a',
            }}
          >
            {headline}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontSize: 28,
              color: '#64748b',
            }}
          >
            <span style={{ display: 'flex', fontSize: 26 }}>📍</span>
            <span style={{ display: 'flex' }}>{location}</span>
          </div>

          <div
            style={{
              display: 'flex',
              width: '100%',
              height: 2,
              backgroundColor: '#e2e8f0',
              marginTop: 2,
              marginBottom: 2,
            }}
          />

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 36,
              fontSize: 26,
              color: '#64748b',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ display: 'flex' }}>⏱</span>
              <span style={{ display: 'flex' }}>{km}</span>
            </div>
            {fuel ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ display: 'flex' }}>⛽</span>
                <span style={{ display: 'flex' }}>{fuel}</span>
              </div>
            ) : null}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 28,
              fontSize: 24,
              color: '#94a3b8',
            }}
          >
            {posted ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ display: 'flex' }}>📅</span>
                <span style={{ display: 'flex' }}>დადების თარიღი: {posted}</span>
              </div>
            ) : null}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ display: 'flex' }}>👁</span>
              <span style={{ display: 'flex' }}>{views}</span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      ...(fonts.length > 0 ? { fonts } : {}),
    }
  )
}
