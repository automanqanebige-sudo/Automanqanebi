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
  | 'listing_share'

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

export type TopViewedCar = {
  id: string
  title: string
  views: number
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
  logins: TimeSeriesPoint[]
  carViews: TimeSeriesPoint[]
  shares: TimeSeriesPoint[]
  topCarSearches: NamedCount[]
  topServiceSearches: NamedCount[]
  topViewedCars: TopViewedCar[]
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
    logins: number
    carViews: number
    shares: number
    conversations: number
    totalCarViews: number
  }
}
