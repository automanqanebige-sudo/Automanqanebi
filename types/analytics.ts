export type AnalyticsEventType =
  | 'search_cars'
  | 'search_services'
  | 'listing_car'
  | 'listing_service'
  | 'favorite_add'
  | 'chat_message'
  | 'user_register'
  | 'user_login'
  | 'car_view'

export type AnalyticsEvent = {
  id: string
  type: AnalyticsEventType
  createdAt: string
  userId?: string
  meta?: Record<string, string | number | boolean | undefined>
}

export type TimeSeriesPoint = {
  label: string
  value: number
  key: string
}

export type NamedCount = {
  name: string
  count: number
}

export type AdminAnalyticsBundle = {
  periodDays: number
  carListings: TimeSeriesPoint[]
  serviceListings: TimeSeriesPoint[]
  carSearches: TimeSeriesPoint[]
  serviceSearches: TimeSeriesPoint[]
  chatActivity: TimeSeriesPoint[]
  favorites: TimeSeriesPoint[]
  registrations: TimeSeriesPoint[]
  topCarSearches: NamedCount[]
  topServiceSearches: NamedCount[]
  offerTypeBreakdown: NamedCount[]
  listingTypeBreakdown: NamedCount[]
  serviceCategoryBreakdown: NamedCount[]
  totals: {
    carListings: number
    serviceListings: number
    carSearches: number
    serviceSearches: number
    chatMessages: number
    favorites: number
    registrations: number
    conversations: number
  }
}
