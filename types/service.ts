export type ServiceCategory =
  | 'tires'
  | 'locksmith'
  | 'electric'
  | 'chemical'
  | 'towing'
  | 'importer'
  | 'mechanic'
  | 'carwash'
  | 'glass'
  | 'insurance'
  | 'diagnostics'
  | 'detailing'
  | 'tuning'
  | 'mobile'
  | 'accessories'
  | 'other'

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  'tires',
  'locksmith',
  'electric',
  'chemical',
  'towing',
  'importer',
  'mechanic',
  'carwash',
  'glass',
  'insurance',
  'diagnostics',
  'detailing',
  'tuning',
  'mobile',
  'accessories',
  'other',
]

export const SERVICE_CATEGORY_ICONS: Record<ServiceCategory, string> = {
  tires: '🔘',
  locksmith: '🔑',
  electric: '⚡',
  chemical: '🧴',
  towing: '🚛',
  importer: '🚢',
  mechanic: '🔧',
  carwash: '🚿',
  glass: '🪟',
  insurance: '📋',
  diagnostics: '🔍',
  detailing: '✨',
  tuning: '🏎️',
  mobile: '🚐',
  accessories: '🎛️',
  other: '📦',
}

export interface Service {
  id: string
  name: string
  category: ServiceCategory
  location: string
  phone: string
  description?: string
  userId?: string
}

export type ServiceSubCategory = {
  nameKey: string
  descKey: string
}

export const SERVICE_SUB_SECTIONS: {
  key: 'mechanic' | 'detailing' | 'electric' | 'mobile' | 'accessories' | 'other'
  icon: string
  colorClass: string
  items: ServiceSubCategory[]
}[] = [
  {
    key: 'mechanic',
    icon: '🔧',
    colorClass: 'bg-blue-500/10 text-blue-500',
    items: [
      { nameKey: 'services.sub.engineDiag', descKey: 'services.sub.engineDiagDesc' },
      { nameKey: 'services.sub.engineRepair', descKey: 'services.sub.engineRepairDesc' },
      { nameKey: 'services.sub.transmission', descKey: 'services.sub.transmissionDesc' },
      { nameKey: 'services.sub.suspension', descKey: 'services.sub.suspensionDesc' },
    ],
  },
  {
    key: 'detailing',
    icon: '✨',
    colorClass: 'bg-purple-500/10 text-purple-500',
    items: [
      { nameKey: 'services.sub.polish', descKey: 'services.sub.polishDesc' },
      { nameKey: 'services.sub.chemClean', descKey: 'services.sub.chemCleanDesc' },
      { nameKey: 'services.sub.ceramic', descKey: 'services.sub.ceramicDesc' },
    ],
  },
  {
    key: 'electric',
    icon: '⚡',
    colorClass: 'bg-amber-500/10 text-amber-500',
    items: [
      { nameKey: 'services.sub.battery', descKey: 'services.sub.batteryDesc' },
      { nameKey: 'services.sub.sensors', descKey: 'services.sub.sensorsDesc' },
      { nameKey: 'services.sub.ac', descKey: 'services.sub.acDesc' },
    ],
  },
  {
    key: 'mobile',
    icon: '🚐',
    colorClass: 'bg-sky-500/10 text-sky-500',
    items: [
      { nameKey: 'services.sub.mobileMechanic', descKey: 'services.sub.mobileMechanicDesc' },
      { nameKey: 'services.sub.mobileWash', descKey: 'services.sub.mobileWashDesc' },
      { nameKey: 'services.sub.mobileTires', descKey: 'services.sub.mobileTiresDesc' },
      { nameKey: 'services.sub.mobileDiag', descKey: 'services.sub.mobileDiagDesc' },
    ],
  },
  {
    key: 'accessories',
    icon: '🎛️',
    colorClass: 'bg-rose-500/10 text-rose-500',
    items: [
      { nameKey: 'services.sub.interiorAcc', descKey: 'services.sub.interiorAccDesc' },
      { nameKey: 'services.sub.exteriorAcc', descKey: 'services.sub.exteriorAccDesc' },
      { nameKey: 'services.sub.audioAcc', descKey: 'services.sub.audioAccDesc' },
      { nameKey: 'services.sub.partsAcc', descKey: 'services.sub.partsAccDesc' },
    ],
  },
  {
    key: 'other',
    icon: '🛠️',
    colorClass: 'bg-emerald-500/10 text-emerald-500',
    items: [
      { nameKey: 'services.sub.disassembly', descKey: 'services.sub.disassemblyDesc' },
      { nameKey: 'services.sub.bodywork', descKey: 'services.sub.bodyworkDesc' },
      { nameKey: 'services.sub.towingSub', descKey: 'services.sub.towingSubDesc' },
      { nameKey: 'services.sub.inspection', descKey: 'services.sub.inspectionDesc' },
    ],
  },
]
