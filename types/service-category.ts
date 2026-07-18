export type ServiceCategory =
  | 'mechanic'
  | 'workshop'
  | 'diagnostics'
  | 'bodywork'
  | 'painting'
  | 'detailing'
  | 'carwash'
  | 'electric'
  | 'ev'
  | 'tires'
  | 'alignment'
  | 'brakes'
  | 'exhaust'
  | 'cooling'
  | 'fuel'
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

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  'mechanic',
  'workshop',
  'mobile',
  'towing',
  'rental',
  'diagnostics',
  'carwash',
  'tires',
  'locksmith',
  'bodywork',
  'painting',
  'detailing',
  'electric',
  'ev',
  'alignment',
  'brakes',
  'exhaust',
  'cooling',
  'fuel',
  'steering',
  'parts',
  'glass',
  'tuning',
  'wrap',
  'upholstery',
  'accessories',
  'audio',
  'security',
  'importer',
  'dealership',
  'auction',
  'appraisal',
  'insurance',
  'inspection',
  'registration',
  'fleet',
  'trucking',
  'motorcycle',
  'rv',
  'lpg',
  'storage',
  'armored',
  'chemical',
  'other',
]

/** Popular categories shown first in filters and quick links */
export const PRIORITY_SERVICE_CATEGORIES: ServiceCategory[] = [
  'workshop',
  'mobile',
  'towing',
  'mechanic',
  'rental',
  'diagnostics',
  'carwash',
  'tires',
  'locksmith',
]

export const SERVICE_CATEGORY_ICONS: Record<ServiceCategory, string> = {
  mechanic: '🔧',
  workshop: '🏭',
  diagnostics: '🔍',
  bodywork: '🔨',
  painting: '🎨',
  detailing: '✨',
  carwash: '🚿',
  electric: '⚡',
  ev: '🔋',
  tires: '🔘',
  alignment: '📐',
  brakes: '🛑',
  exhaust: '💨',
  cooling: '❄️',
  fuel: '⛽',
  steering: '🎯',
  parts: '⚙️',
  glass: '🪟',
  tuning: '🏎️',
  wrap: '🎞️',
  upholstery: '💺',
  accessories: '🎛️',
  audio: '🔊',
  security: '🔒',
  locksmith: '🔑',
  mobile: '🚐',
  towing: '🚛',
  importer: '🚢',
  dealership: '🏪',
  auction: '🔨',
  appraisal: '💰',
  rental: '🚗',
  insurance: '📋',
  inspection: '✅',
  registration: '📄',
  fleet: '🚚',
  trucking: '🛻',
  motorcycle: '🏍️',
  rv: '🚌',
  lpg: '🔥',
  storage: '🏠',
  armored: '🛡️',
  chemical: '🧴',
  other: '📦',
}

export function normalizeServiceCategory(cat: string): ServiceCategory {
  if (cat === 'carwash') return 'carwash'
  if (cat === 'chemical') return 'carwash'
  if (cat === 'workshop' || cat === 'saxelosno') return 'workshop'
  if (SERVICE_CATEGORIES.includes(cat as ServiceCategory)) return cat as ServiceCategory
  return 'other'
}
