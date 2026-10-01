import { fetchUserConversations } from '@/lib/chat-firestore'
import type { Car } from '@/components/CarCard'

export type ListingStatRow = {
  carId: string
  title: string
  views: number
  favorites: number
  inquiries: number
}

export type DealerListingStats = {
  totals: { views: number; favorites: number; inquiries: number; listings: number }
  byCar: ListingStatRow[]
}

export async function buildDealerListingStats(
  userId: string,
  cars: Car[]
): Promise<DealerListingStats> {
  const inquiryByCar = new Map<string, number>()
  try {
    const conversations = await fetchUserConversations(userId)
    conversations
      .filter((c) => c.sellerId === userId)
      .forEach((c) => {
        if (!c.carId) return
        inquiryByCar.set(c.carId, (inquiryByCar.get(c.carId) ?? 0) + 1)
      })
  } catch {
    /* ignore chat load failures */
  }

  const byCar = cars.map((car) => ({
    carId: car.id,
    title: `${car.year} ${car.brand} ${car.model}`.trim(),
    views: Number(car.views ?? 0),
    favorites: Number(car.favoriteCount ?? 0),
    inquiries: inquiryByCar.get(car.id) ?? 0,
  }))

  const totals = byCar.reduce(
    (acc, row) => {
      acc.views += row.views
      acc.favorites += row.favorites
      acc.inquiries += row.inquiries
      return acc
    },
    { views: 0, favorites: 0, inquiries: 0, listings: byCar.length }
  )

  return { totals, byCar }
}
