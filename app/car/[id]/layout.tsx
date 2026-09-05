import type { Metadata } from 'next'
import { getCarById } from '@/data/cars'
import { SITE_URL } from '@/lib/site'
import {
  carOgImagePath,
  carShareDescription,
  carShareTitle,
} from '@/lib/car-share-meta'

type Props = { params: { id: string }; children: React.ReactNode }

/**
 * Keep metadata lightweight — avoid Firestore on the server here.
 * Firebase Hosting SSR historically broke when layout blocked on client SDK.
 * Real listing title/description still come from the client page + OG image route.
 */
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const car = getCarById(params.id) || null
    const pageUrl = `${SITE_URL}/car/${params.id}`
    const ogImage = `${SITE_URL}${carOgImagePath(params.id)}`

    if (!car) {
      return {
        title: 'განცხადება | AUTOMANQANEBI.GE',
        openGraph: {
          url: pageUrl,
          siteName: 'AUTOMANQANEBI.GE',
          images: [{ url: ogImage, width: 1200, height: 630, type: 'image/png' }],
          type: 'website',
          locale: 'ka_GE',
        },
        twitter: { card: 'summary_large_image', images: [ogImage] },
        alternates: { canonical: pageUrl },
      }
    }

    const title = carShareTitle(car)
    const description = carShareDescription(car)

    return {
      title: `${title} | AUTOMANQANEBI.GE`,
      description,
      openGraph: {
        title,
        description,
        url: pageUrl,
        siteName: 'AUTOMANQANEBI.GE',
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: `${car.year} ${car.brand} ${car.model}`,
            type: 'image/png',
          },
        ],
        type: 'website',
        locale: 'ka_GE',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [ogImage],
      },
      alternates: {
        canonical: pageUrl,
      },
    }
  } catch {
    return { title: 'განცხადება | AUTOMANQANEBI.GE' }
  }
}

export default function CarLayout({ children }: Props) {
  return children
}
