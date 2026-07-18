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

  const title = `${car.year} ${car.brand} ${car.model} — ${car.price}₾ | AUTOMANQANEBI.GE`
  const description =
    car.description?.slice(0, 160) ||
    `${car.brand} ${car.model}, ${car.year}, ${car.mileage} კმ — ${car.location}`
  const image = car.images?.[0] || car.image

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/car/${car.id}`,
      images: image ? [{ url: image }] : undefined,
      type: 'website',
      locale: 'ka_GE',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
    alternates: {
      canonical: `${SITE_URL}/car/${car.id}`,
    },
  }
}

export default function CarLayout({ children }: Props) {
  return children
}
