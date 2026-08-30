export type ServiceCategory =
  | 'mechanic'
  | 'workshop'
  | 'fullService'
  | 'diagnostics'
  | 'bodywork'
  | 'painting'
  | 'detailing'
  | 'carwash'
  | 'electric'
  | 'ev'
  | 'tires'
  | 'vulcanization'
  | 'discs'
  | 'alignment'
  | 'brakes'
  | 'exhaust'
  | 'cooling'
  | 'oilChange'
  | 'freon'
  | 'fuel'
  | 'fuelDrain'
  | 'steering'
  | 'parts'
  | 'glass'
  | 'tuning'
  | 'wrap'
  | 'upholstery'
  | 'accessories'
  | 'audio'
  | 'security'
  | 'locksmith'
  | 'mobile'
  | 'towing'
  | 'importer'
  | 'dealership'
  | 'auction'
  | 'appraisal'
  | 'rental'
  | 'insurance'
  | 'inspection'
  | 'registration'
  | 'fleet'
  | 'trucking'
  | 'motorcycle'
  | 'rv'
  | 'lpg'
  | 'storage'
  | 'armored'
  | 'chemical'
  | 'other'

/** Categories shown on /services — marketplace service listings only */
export const SERVICE_CATEGORIES: ServiceCategory[] = [
  'accessories',
  'tires',
  'discs',
  'locksmith',
  'electric',
  'lpg',
  'glass',
  'upholstery',
]

/** Same order as SERVICE_CATEGORIES */
export const PRIORITY_SERVICE_CATEGORIES: ServiceCategory[] = [...SERVICE_CATEGORIES]

/** Mobile (on-site) service categories shown at the top of /services */
export type MobileServiceCategoryEntry = {
  category: ServiceCategory
  /** Override label key; defaults to `services.cat.{category}` */
  labelKey?: string
}

export const MOBILE_SERVICE_CATEGORIES: MobileServiceCategoryEntry[] = [
  { category: 'accessories' },
  { category: 'tires' },
  { category: 'discs' },
  { category: 'locksmith', labelKey: 'services.sub.mobileDoorOpen' },
  { category: 'towing' },
  { category: 'electric' },
  { category: 'fuelDrain' },
]

/** Categories accepted in /services filters (marketplace + mobile-only) */
export const FILTERABLE_SERVICE_CATEGORIES: ServiceCategory[] = [
  ...SERVICE_CATEGORIES,
  ...MOBILE_SERVICE_CATEGORIES.map((e) => e.category).filter(
    (cat) => !SERVICE_CATEGORIES.includes(cat)
  ),
]

/** Categories shown on /workshops */
export type WorkshopCategoryEntry = {
  category: ServiceCategory
  /** Override label key; defaults to `services.cat.{category}` */
  labelKey?: string
}

export const WORKSHOP_PAGE_CATEGORY_ENTRIES: WorkshopCategoryEntry[] = [
  { category: 'fullService' },
  { category: 'mechanic' },
  { category: 'electric' },
  { category: 'vulcanization' },
  { category: 'accessories' },
  { category: 'tires' },
  { category: 'discs' },
  { category: 'fuelDrain' },
  { category: 'locksmith', labelKey: 'services.sub.mobileDoorOpen' },
  { category: 'lpg' },
  { category: 'glass', labelKey: 'workshops.cat.glassTint' },
  { category: 'upholstery', labelKey: 'workshops.cat.upholsteryInterior' },
  { category: 'oilChange', labelKey: 'workshops.cat.oilChange' },
  { category: 'freon', labelKey: 'workshops.cat.freon' },
]

export const WORKSHOP_PAGE_CATEGORIES: ServiceCategory[] =
  WORKSHOP_PAGE_CATEGORY_ENTRIES.map((entry) => entry.category)

/** Legacy workshop listings still shown when browsing all */
export const LEGACY_WORKSHOP_CATEGORIES: ServiceCategory[] = [
  'workshop',
  'diagnostics',
  'bodywork',
  'brakes',
]

export const SERVICE_CATEGORY_ICONS: Record<ServiceCategory, string> = {
  mechanic: '',
  workshop: '',
  fullService: '',
  diagnostics: '',
  bodywork: '',
  painting: '',
  detailing: '',
  carwash: '',
  electric: '',
  ev: '',
  tires: '',
  vulcanization: '',
  discs: '',
  alignment: '',
  brakes: '',
  exhaust: '',
  cooling: '',
  oilChange: '',
  freon: '',
  fuel: '',
  fuelDrain: '',
  steering: '',
  parts: '',
  glass: '',
  tuning: '',
  wrap: '',
  upholstery: '',
  accessories: '',
  audio: '',
  security: '',
  locksmith: '',
  mobile: '',
  towing: '',
  importer: '',
  dealership: '',
  auction: '',
  appraisal: '',
  rental: '',
  insurance: '',
  inspection: '',
  registration: '',
  fleet: '',
  trucking: '',
  motorcycle: '',
  rv: '',
  lpg: '',
  storage: '',
  armored: '',
  chemical: '',
  other: '',
}

/** Map legacy / niche categories to one of the 8 visible service categories */
const CATEGORY_ALIASES: Record<string, ServiceCategory> = {
  discs: 'discs',
  wheels: 'discs',
  rims: 'discs',
  audio: 'accessories',
  parts: 'accessories',
  security: 'accessories',
  tuning: 'accessories',
  wrap: 'accessories',
  fuel: 'lpg',
  ev: 'electric',
  carwash: 'upholstery',
  chemical: 'upholstery',
  detailing: 'upholstery',
  bodywork: 'glass',
  painting: 'glass',
  mobile: 'locksmith',
  fullservice: 'fullService',
  'full-service': 'fullService',
  fueldrain: 'fuelDrain',
  'fuel-drain': 'fuelDrain',
  'fuel_tank_drain': 'fuelDrain',
  mechanic: 'electric',
  workshop: 'electric',
  diagnostics: 'electric',
  alignment: 'tires',
  vulcanization: 'vulcanization',
  vulcan: 'vulcanization',
  oilchange: 'oilChange',
  'oil-change': 'oilChange',
  freon: 'freon',
  ac: 'freon',
  brakes: 'tires',
  cooling: 'electric',
  steering: 'electric',
  exhaust: 'electric',
  importer: 'accessories',
  dealership: 'accessories',
  auction: 'accessories',
  appraisal: 'accessories',
  rental: 'accessories',
  insurance: 'accessories',
  inspection: 'accessories',
  registration: 'accessories',
  fleet: 'accessories',
  trucking: 'accessories',
  motorcycle: 'accessories',
  rv: 'accessories',
  storage: 'tires',
  armored: 'accessories',
  saxelosno: 'upholstery',
}

export function normalizeServiceCategory(cat: string): ServiceCategory {
  const key = cat.trim().toLowerCase()
  if (CATEGORY_ALIASES[key]) return CATEGORY_ALIASES[key]
  if (FILTERABLE_SERVICE_CATEGORIES.includes(cat as ServiceCategory)) {
    return cat as ServiceCategory
  }
  if (SERVICE_CATEGORIES.includes(cat as ServiceCategory)) return cat as ServiceCategory
  // Legacy categories still in type union but hidden from UI
  if (cat in SERVICE_CATEGORY_ICONS) return cat as ServiceCategory
  return 'other'
}
