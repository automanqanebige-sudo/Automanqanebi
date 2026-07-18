export type OfferType = '' | 'sale' | 'rent'

export type ListingType =
  | ''
  | 'vip'
  | 'vip_plus'
  | 'super_vip'
  | 'silver'
  | 'gold'
  | 'platinum'
  | 'dealer'
  | 'salon'

export type ImportRegion = '' | 'usa' | 'europe' | 'japan' | 'korea' | 'uae'

export type CustomsStatus = '' | 'cleared' | 'not_cleared'

export type CarFeature =
  | 'ac'
  | 'climate'
  | 'sunroof'
  | 'navigation'
  | 'parking_sensor'
  | 'rear_camera'
  | 'bluetooth'
  | 'usb'
  | 'carplay'
  | 'android_auto'
  | 'start_stop'
  | 'leather'
  | 'seat_heat'
  | 'seat_vent'
  | 'electric_windows'
  | 'cruise_control'
  | 'adaptive_cruise'
  | 'blind_spot'
  | 'lane_assist'
  | 'abs'
  | 'esp'
  | 'airbag'
  | 'keyless'

export interface FilterState {
  search: string
  brand: string
  model: string
  category: string
  fuelType: string
  priceMin: number
  priceMax: number
  yearMin: string
  yearMax: string
  bodyType: string
  transmission: string
  driveType: string
  steering: string
  engineVolume: string
  engineVolumeMin: string
  engineVolumeMax: string
  cylinders: string
  doors: string
  color: string
  mileageMin: string
  mileageMax: string
  features: CarFeature[]
  offerType: OfferType
  listingType: ListingType
  importRegion: ImportRegion
  customsStatus: CustomsStatus
}

export const PRICE_SLIDER_MAX = 150000

export const initialFilters: FilterState = {
  search: '',
  brand: '',
  model: '',
  category: '',
  fuelType: '',
  priceMin: 0,
  priceMax: PRICE_SLIDER_MAX,
  yearMin: '',
  yearMax: '',
  bodyType: '',
  transmission: '',
  driveType: '',
  steering: '',
  engineVolume: '',
  engineVolumeMin: '',
  engineVolumeMax: '',
  cylinders: '',
  doors: '',
  color: '',
  mileageMin: '',
  mileageMax: '',
  features: [],
  offerType: '',
  listingType: '',
  importRegion: '',
  customsStatus: '',
}

export const CAR_FEATURES: CarFeature[] = [
  'ac',
  'climate',
  'sunroof',
  'navigation',
  'parking_sensor',
  'rear_camera',
  'bluetooth',
  'usb',
  'carplay',
  'android_auto',
  'start_stop',
  'leather',
  'seat_heat',
  'seat_vent',
  'electric_windows',
  'cruise_control',
  'adaptive_cruise',
  'blind_spot',
  'lane_assist',
  'abs',
  'esp',
  'airbag',
  'keyless',
]

export const OFFER_TYPES: OfferType[] = ['', 'sale', 'rent']

export const LISTING_TYPES: ListingType[] = [
  '',
  'vip',
  'vip_plus',
  'super_vip',
  'silver',
  'gold',
  'platinum',
  'dealer',
  'salon',
]

export const IMPORT_REGIONS: ImportRegion[] = ['', 'usa', 'europe', 'japan', 'korea', 'uae']

export const CUSTOMS_STATUSES: CustomsStatus[] = ['', 'cleared', 'not_cleared']

export const CAR_COLORS = [
  '',
  'white',
  'black',
  'red',
  'blue',
  'green',
  'yellow',
  'brown',
  'purple',
  'orange',
  'silver',
  'gray',
] as const

export const COLOR_EMOJI: Record<string, string> = {
  white: '⚪',
  black: '⚫',
  red: '🔴',
  blue: '🔵',
  green: '🟢',
  yellow: '🟡',
  brown: '🟤',
  purple: '🟣',
  orange: '🟠',
  silver: '⚪',
  gray: '⚪',
}
