import { formatDayKey, lastNDays, parseFirestoreDate, startOfDay } from '@/lib/firestore-date'
import type {
  AdminAnalyticsBundle,
  AnalyticsEvent,
  NamedCount,
  TimeSeriesPoint,
  TopViewedCar,
} from '@/types/analytics'

type Timestamped = { date: Date | null }

function inPeriod(date: Date | null, since: Date): boolean {
  return Boolean(date && date >= since)
}

function buildDailySeries(
  days: Date[],
  items: Timestamped[],
  since: Date
): TimeSeriesPoint[] {
  const counts = new Map<string, number>()
  days.forEach((d) => counts.set(formatDayKey(d), 0))

  items.forEach((item) => {
    if (!inPeriod(item.date, since)) return
    const key = formatDayKey(startOfDay(item.date!))
    if (counts.has(key)) counts.set(key, (counts.get(key) ?? 0) + 1)
  })

  return days.map((d) => {
    const key = formatDayKey(d)
    const label = d.toLocaleDateString('ka-GE', { day: 'numeric', month: 'short' })
    return { key, label, value: counts.get(key) ?? 0 }
  })
}

function eventsByTypeSeries(
  days: Date[],
  events: AnalyticsEvent[],
  since: Date,
  type: AnalyticsEvent['type']
): TimeSeriesPoint[] {
  const filtered = events
    .filter((e) => e.type === type)
    .map((e) => ({ date: parseFirestoreDate(e.createdAt) }))
  return buildDailySeries(days, filtered, since)
}

function topQueries(events: AnalyticsEvent[], type: AnalyticsEvent['type'], limit = 8): NamedCount[] {
  const map = new Map<string, number>()
  events
    .filter((e) => e.type === type)
    .forEach((e) => {
      const q = String(e.meta?.query ?? '').trim().toLowerCase()
      if (!q || q.length < 2) return
      map.set(q, (map.get(q) ?? 0) + 1)
    })

  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

function countBreakdown(items: { key: string; label: string }[]): NamedCount[] {
  const map = new Map<string, number>()
  items.forEach(({ key }) => {
    map.set(key, (map.get(key) ?? 0) + 1)
  })
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}

function buildTopViewedCars(
  cars: { id?: string; brand?: string; model?: string; year?: number; views?: number }[]
): TopViewedCar[] {
  return cars
    .map((c) => ({
      id: String(c.id ?? ''),
      title: [c.brand, c.model, c.year].filter(Boolean).join(' ') || String(c.id ?? ''),
      views: Number(c.views ?? 0),
    }))
    .filter((c) => c.id && c.views > 0)
    .sort((a, b) => b.views - a.views)
    .slice(0, 10)
}

export type AdminAnalyticsInput = {
  periodDays: number
  cars: {
    id?: string
    brand?: string
    model?: string
    year?: number
    views?: number
    createdAt?: unknown
    offerType?: string
    listingType?: string
    isVip?: boolean
  }[]
  services: { createdAt?: unknown; category?: string }[]
  events: AnalyticsEvent[]
  conversations: { updatedAt?: string }[]
}

export function buildAdminAnalytics(input: AdminAnalyticsInput): AdminAnalyticsBundle {
  const { periodDays, cars, services, events, conversations } = input
  const days = lastNDays(periodDays)
  const since = days[0] ?? startOfDay(new Date())

  const carDates = cars.map((c) => ({
    date:
      parseFirestoreDate(c.createdAt) ??
      parseFirestoreDate((c as { updatedAt?: unknown }).updatedAt),
  }))
  const serviceDates = services.map((s) => ({
    date:
      parseFirestoreDate(s.createdAt) ??
      parseFirestoreDate((s as { updatedAt?: unknown }).updatedAt),
  }))
  const chatDates = conversations.map((c) => ({ date: parseFirestoreDate(c.updatedAt) }))

  const carListings = buildDailySeries(days, carDates, since)
  const serviceListings = buildDailySeries(days, serviceDates, since)
  const carSearches = eventsByTypeSeries(days, events, since, 'search_cars')
  const serviceSearches = eventsByTypeSeries(days, events, since, 'search_services')
  const chatActivity = buildDailySeries(days, chatDates, since)
  const favorites = eventsByTypeSeries(days, events, since, 'favorite_add')
  const registrations = eventsByTypeSeries(days, events, since, 'user_register')
  const logins = eventsByTypeSeries(days, events, since, 'user_login')
  const carViews = eventsByTypeSeries(days, events, since, 'car_view')
  const shares = eventsByTypeSeries(days, events, since, 'listing_share')

  const offerTypeBreakdown = countBreakdown(
    cars.map((c) => ({
      key: c.offerType === 'rent' ? 'rent' : 'sale',
      label: c.offerType === 'rent' ? 'rent' : 'sale',
    }))
  )

  const listingTypeBreakdown = countBreakdown(
    cars.map((c) => {
      const lt = c.listingType ?? (c.isVip ? 'vip' : 'standard')
      const key = ['vip', 'vip_plus', 'super_vip'].includes(lt) ? 'vip' : lt === 'dealer' ? 'dealer' : 'standard'
      return { key, label: key }
    })
  )

  const serviceCategoryBreakdown = countBreakdown(
    services.map((s) => ({
      key: s.category ?? 'other',
      label: s.category ?? 'other',
    }))
  )

  const periodEvents = events.filter((e) => inPeriod(parseFirestoreDate(e.createdAt), since))
  const totalCarViews = cars.reduce((sum, c) => sum + Number(c.views ?? 0), 0)

  return {
    periodDays,
    carListings,
    serviceListings,
    carSearches,
    serviceSearches,
    chatActivity,
    favorites,
    registrations,
    logins,
    carViews,
    shares,
    topCarSearches: topQueries(events, 'search_cars'),
    topServiceSearches: topQueries(events, 'search_services'),
    topViewedCars: buildTopViewedCars(cars),
    offerTypeBreakdown,
    listingTypeBreakdown,
    serviceCategoryBreakdown,
    totals: {
      carListings: carListings.reduce((s, p) => s + p.value, 0),
      serviceListings: serviceListings.reduce((s, p) => s + p.value, 0),
      carSearches: periodEvents.filter((e) => e.type === 'search_cars').length,
      serviceSearches: periodEvents.filter((e) => e.type === 'search_services').length,
      chatMessages: periodEvents.filter((e) => e.type === 'chat_message').length,
      favorites: periodEvents.filter((e) => e.type === 'favorite_add').length,
      registrations: periodEvents.filter((e) => e.type === 'user_register').length,
      logins: periodEvents.filter((e) => e.type === 'user_login').length,
      carViews: periodEvents.filter((e) => e.type === 'car_view').length,
      shares: periodEvents.filter((e) => e.type === 'listing_share').length,
      conversations: conversations.length,
      totalCarViews,
    },
  }
}
