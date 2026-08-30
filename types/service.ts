export type { ServiceCategory, MobileServiceCategoryEntry } from '@/types/service-category'
export {
  SERVICE_CATEGORIES,
  FILTERABLE_SERVICE_CATEGORIES,
  WORKSHOP_PAGE_CATEGORIES,
  MOBILE_SERVICE_CATEGORIES,
  SERVICE_CATEGORY_ICONS,
  normalizeServiceCategory,
} from '@/types/service-category'

export type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

export type DaySchedule = {
  closed: boolean
  open: string
  close: string
}

export type WorkSchedule = Record<DayKey, DaySchedule>

export type { RentalTransportType, RentalSubService } from '@/types/rental-transport'

export const WORK_DAY_KEYS: DayKey[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

export interface Service {
  id: string
  name: string
  category: import('@/types/service-category').ServiceCategory
  location: string
  phone: string
  description?: string
  bio?: string
  image?: string
  /** Gallery URLs (first = cover). Legacy docs may only have `image`. */
  images?: string[]
  price?: number
  oldPrice?: number
  newPrice?: number
  promoUntil?: string
  latitude?: number
  longitude?: number
  workSchedule?: WorkSchedule
  open24Hours?: boolean
  userId?: string
  /** Rental-only: vehicle types offered */
  rentalTransportTypes?: import('@/types/rental-transport').RentalTransportType[]
  /** Rental-only: sub-service types (carRental, vanRental, etc.) */
  rentalSubServices?: import('@/types/rental-transport').RentalSubService[]
  rentalPricePerDay?: number
  rentalPricePerMonth?: number
  rentalMinDays?: number
  withDriver?: boolean
  /** Discs (wheels) listing filters */
  discDiameters?: import('@/types/disc-filters').DiscDiameter[]
  discBoltPatterns?: import('@/types/disc-filters').DiscBoltPattern[]
  discMaterials?: import('@/types/disc-filters').DiscMaterial[]
  discCondition?: import('@/types/disc-filters').DiscCondition
}

export type ServiceSubCategory = {
  nameKey: string
  descKey: string
}

export type { ServiceSectionKey } from '@/data/auto-service-catalog'
export {
  AUTO_SERVICE_CATALOG,
  catalogToSubSections,
  catalogSectionsForCategory,
  MOBILE_SERVICE_ITEM_IDS,
  DISC_SERVICE_ITEM_IDS,
  SECTION_TO_CATEGORY,
} from '@/data/auto-service-catalog'

import { catalogToSubSections } from '@/data/auto-service-catalog'

export const SERVICE_SUB_SECTIONS = catalogToSubSections()
