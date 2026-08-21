import type { Metadata } from 'next'
import { fetchFirestoreCarById } from '@/lib/cars-firestore'
import { getCarById } from '@/data/cars'
import { SITE_URL } from '@/lib/site'

type Props = { params: { id: string }; children: React.ReactNode }

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const car =
    (await fetchFirestoreCarById(params.id).catch(() => null)) || getCarById(params.id) || null

  if (!car) {
    return { title: 'განცხადება | AUTOMANQANEBI.GE' }
  }

  const priceLabel = `${Math.round(car.price).toLocaleString('en-US')}₾`
  const title = `${car.year} ${car.brand} ${car.model} — ${priceLabel}`
  const description = [
    `${car.year} ${car.brand} ${car.model}`,
    `${Math.round(car.mileage).toLocaleString('en-US')} კმ`,
    car.fuelType,
    car.transmission,
    car.location,
    priceLabel,
  ]
    .filter(Boolean)
    .join(' · ')
  const image = car.images?.[0] || car.image
  const pageUrl = `${SITE_URL}/car/${car.id}`

  return {
    title: `${title} | AUTOMANQANEBI.GE`,
    description: car.description?.slice(0, 160) || description,
    openGraph: {
      title,
      description: car.description?.slice(0, 160) || description,
      url: pageUrl,
      siteName: 'AUTOMANQANEBI.GE',
      images: image
        ? [
            {
              url: image,
              width: 1200,
              height: 630,
              alt: `${car.year} ${car.brand} ${car.model}`,
            },
          ]
        : undefined,
      type: 'website',
      locale: 'ka_GE',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: car.description?.slice(0, 160) || description,
      images: image ? [image] : undefined,
    },
    alternates: {
      canonical: pageUrl,
    },
  }
}

export default function CarLayout({ children }: Props) {
  return children
}
