import type { Metadata } from 'next'
import { fetchServiceById } from '@/lib/services-firestore'
import { getServiceImages } from '@/lib/service-images'
import { SITE_URL } from '@/lib/site'

type Props = { params: { id: string }; children: React.ReactNode }

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const service = await fetchServiceById(params.id).catch(() => null)

  if (!service) {
    return { title: 'სერვისი | AUTOMANQANEBI.GE' }
  }

  const pricePart =
    service.newPrice != null
      ? `${Math.round(service.newPrice).toLocaleString('en-US')}₾`
      : service.price != null
        ? `${Math.round(service.price).toLocaleString('en-US')}₾`
        : null

  const title = pricePart ? `${service.name} — ${pricePart}` : service.name
  const description = [
    service.name,
    service.category,
    service.location,
    pricePart,
    service.bio || service.description,
  ]
    .filter(Boolean)
    .join(' · ')
    .slice(0, 160)

  const image = getServiceImages(service)[0]
  const pageUrl = `${SITE_URL}/services/${service.id}`

  return {
    title: `${title} | AUTOMANQANEBI.GE`,
    description,
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: 'AUTOMANQANEBI.GE',
      images: image
        ? [{ url: image, width: 1200, height: 630, alt: service.name }]
        : undefined,
      type: 'website',
      locale: 'ka_GE',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
    alternates: { canonical: pageUrl },
  }
}

export default function ServiceLayout({ children }: Props) {
  return children
}
