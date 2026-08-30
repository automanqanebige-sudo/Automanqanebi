import type { ServiceCategory } from '@/types/service-category'

export type ServiceSectionKey =
  | 'mechanic'
  | 'transmission'
  | 'suspension'
  | 'brakes'
  | 'cooling'
  | 'fuel'
  | 'steering'
  | 'electric'
  | 'climate'
  | 'tires'
  | 'discs'
  | 'bodywork'
  | 'painting'
  | 'detailing'
  | 'glass'
  | 'parts'
  | 'diagnostics'
  | 'tuning'
  | 'evHybrid'
  | 'mobile'
  | 'towing'
  | 'accessories'
  | 'security'
  | 'upholstery'
  | 'wrap'
  | 'locksmith'
  | 'insurance'
  | 'legal'
  | 'sales'
  | 'rental'
  | 'specialty'

export type CatalogItem = { id: string; category: ServiceCategory }

export type CatalogSection = {
  key: ServiceSectionKey
  icon: string
  colorClass: string
  defaultCategory: ServiceCategory
  items: CatalogItem[]
}

export const AUTO_SERVICE_CATALOG: CatalogSection[] = [
  {
    key: 'mechanic',
    icon: '',
    colorClass: 'bg-blue-500/10 text-blue-500',
    defaultCategory: 'mechanic',
    items: [
      { id: 'engineDiag', category: 'diagnostics' },
      { id: 'engineRepair', category: 'mechanic' },
      { id: 'engineRebuild', category: 'mechanic' },
      { id: 'turboRepair', category: 'mechanic' },
      { id: 'timingBelt', category: 'mechanic' },
      { id: 'headGasket', category: 'mechanic' },
      { id: 'oilLeak', category: 'mechanic' },
      { id: 'engineSwap', category: 'mechanic' },
      { id: 'dieselEngine', category: 'mechanic' },
      { id: 'petrolEngine', category: 'mechanic' },
    ],
  },
  {
    key: 'mobile',
    icon: '',
    colorClass: 'bg-sky-500/10 text-sky-500',
    defaultCategory: 'mobile',
    items: [
      { id: 'mobileMechanic', category: 'mobile' },
      { id: 'mobileWash', category: 'mobile' },
      { id: 'mobileVulcanization', category: 'mobile' },
      { id: 'mobileTires', category: 'mobile' },
      { id: 'mobileTireRepair', category: 'mobile' },
      { id: 'mobileDiag', category: 'mobile' },
      { id: 'mobileBattery', category: 'mobile' },
      { id: 'mobileJumpStart', category: 'mobile' },
      { id: 'mobileFuel', category: 'mobile' },
      { id: 'mobileDoorOpen', category: 'mobile' },
      { id: 'mobileLocksmith', category: 'mobile' },
      { id: 'mobileOilChange', category: 'mobile' },
      { id: 'mobileAC', category: 'mobile' },
      { id: 'mobileGlass', category: 'mobile' },
      { id: 'onsiteInspection', category: 'mobile' },
    ],
  },
  {
    key: 'towing',
    icon: '',
    colorClass: 'bg-orange-600/10 text-orange-600',
    defaultCategory: 'towing',
    items: [
      { id: 'towingSub', category: 'towing' },
      { id: 'localTow', category: 'towing' },
      { id: 'longDistanceTow', category: 'towing' },
      { id: 'flatbed', category: 'towing' },
      { id: 'motorcycleTow', category: 'towing' },
      { id: 'accidentRecovery', category: 'towing' },
      { id: 'jumpStart', category: 'towing' },
      { id: 'lockout', category: 'towing' },
      { id: 'fuelDelivery', category: 'towing' },
      { id: 'tireChangeRoad', category: 'towing' },
    ],
  },
  {
    key: 'transmission',
    icon: '',
    colorClass: 'bg-indigo-500/10 text-indigo-500',
    defaultCategory: 'mechanic',
    items: [
      { id: 'autoTrans', category: 'mechanic' },
      { id: 'manualTrans', category: 'mechanic' },
      { id: 'cvtRepair', category: 'mechanic' },
      { id: 'gearboxRebuild', category: 'mechanic' },
      { id: 'clutchReplace', category: 'mechanic' },
      { id: 'differential', category: 'mechanic' },
      { id: 'fourWd', category: 'mechanic' },
    ],
  },
  {
    key: 'suspension',
    icon: '',
    colorClass: 'bg-cyan-500/10 text-cyan-600',
    defaultCategory: 'mechanic',
    items: [
      { id: 'shocks', category: 'mechanic' },
      { id: 'struts', category: 'mechanic' },
      { id: 'springs', category: 'mechanic' },
      { id: 'controlArms', category: 'mechanic' },
      { id: 'wheelBearings', category: 'mechanic' },
      { id: 'airSuspension', category: 'mechanic' },
      { id: 'liftKit', category: 'tuning' },
    ],
  },
  {
    key: 'brakes',
    icon: '',
    colorClass: 'bg-red-500/10 text-red-500',
    defaultCategory: 'brakes',
    items: [
      { id: 'brakePads', category: 'brakes' },
      { id: 'brakeDiscs', category: 'brakes' },
      { id: 'brakeFluid', category: 'brakes' },
      { id: 'absRepair', category: 'brakes' },
      { id: 'parkingBrake', category: 'brakes' },
      { id: 'performanceBrakes', category: 'tuning' },
    ],
  },
  {
    key: 'cooling',
    icon: '',
    colorClass: 'bg-sky-500/10 text-sky-600',
    defaultCategory: 'cooling',
    items: [
      { id: 'radiator', category: 'cooling' },
      { id: 'waterPump', category: 'cooling' },
      { id: 'thermostat', category: 'cooling' },
      { id: 'coolantFlush', category: 'cooling' },
      { id: 'heaterCore', category: 'cooling' },
    ],
  },
  {
    key: 'fuel',
    icon: '',
    colorClass: 'bg-yellow-500/10 text-yellow-600',
    defaultCategory: 'fuel',
    items: [
      { id: 'fuelPump', category: 'fuel' },
      { id: 'injectorClean', category: 'fuel' },
      { id: 'lpgCng', category: 'lpg' },
      { id: 'fuelTank', category: 'fuel' },
      { id: 'carburetor', category: 'fuel' },
    ],
  },
  {
    key: 'steering',
    icon: '',
    colorClass: 'bg-teal-500/10 text-teal-600',
    defaultCategory: 'steering',
    items: [
      { id: 'powerSteering', category: 'steering' },
      { id: 'steeringRack', category: 'steering' },
      { id: 'tieRods', category: 'steering' },
      { id: 'wheelAlignment', category: 'alignment' },
    ],
  },
  {
    key: 'electric',
    icon: '',
    colorClass: 'bg-amber-500/10 text-amber-500',
    defaultCategory: 'electric',
    items: [
      { id: 'battery', category: 'electric' },
      { id: 'alternator', category: 'electric' },
      { id: 'starter', category: 'electric' },
      { id: 'wiring', category: 'electric' },
      { id: 'ecuProgram', category: 'electric' },
      { id: 'obdDiag', category: 'diagnostics' },
      { id: 'sensors', category: 'electric' },
      { id: 'keyProgram', category: 'locksmith' },
      { id: 'immobilizer', category: 'security' },
    ],
  },
  {
    key: 'climate',
    icon: '',
    colorClass: 'bg-blue-400/10 text-blue-400',
    defaultCategory: 'electric',
    items: [
      { id: 'ac', category: 'electric' },
      { id: 'acRecharge', category: 'electric' },
      { id: 'acCompressor', category: 'electric' },
      { id: 'acLeak', category: 'electric' },
      { id: 'cabinFilter', category: 'parts' },
    ],
  },
  {
    key: 'tires',
    icon: '',
    colorClass: 'bg-gray-500/10 text-gray-600 dark:text-gray-300',
    defaultCategory: 'tires',
    items: [
      { id: 'tireSale', category: 'tires' },
      { id: 'tireMount', category: 'tires' },
      { id: 'tireRepair', category: 'tires' },
      { id: 'tireRotation', category: 'tires' },
      { id: 'wheelBalance', category: 'tires' },
      { id: 'wheelAlign', category: 'mechanic' },
      { id: 'tpms', category: 'tires' },
      { id: 'tireHotel', category: 'tires' },
      { id: 'offroadTires', category: 'tires' },
    ],
  },
  {
    key: 'discs',
    icon: '',
    colorClass: 'bg-slate-600/10 text-slate-700 dark:text-slate-300',
    defaultCategory: 'discs',
    items: [
      { id: 'discSale', category: 'discs' },
      { id: 'discMount', category: 'discs' },
      { id: 'discRepair', category: 'discs' },
      { id: 'discPolish', category: 'discs' },
      { id: 'alloyRepair', category: 'discs' },
      { id: 'forgedDiscs', category: 'discs' },
      { id: 'steelDiscs', category: 'discs' },
      { id: 'customDiscs', category: 'discs' },
    ],
  },
  {
    key: 'bodywork',
    icon: '',
    colorClass: 'bg-stone-500/10 text-stone-600',
    defaultCategory: 'bodywork',
    items: [
      { id: 'collisionRepair', category: 'bodywork' },
      { id: 'pdrDent', category: 'bodywork' },
      { id: 'frameStraight', category: 'bodywork' },
      { id: 'rustRepair', category: 'bodywork' },
      { id: 'welding', category: 'bodywork' },
      { id: 'panelReplace', category: 'bodywork' },
      { id: 'bumperRepair', category: 'bodywork' },
    ],
  },
  {
    key: 'painting',
    icon: '',
    colorClass: 'bg-orange-500/10 text-orange-500',
    defaultCategory: 'painting',
    items: [
      { id: 'fullPaint', category: 'painting' },
      { id: 'localPaint', category: 'painting' },
      { id: 'bumperPaint', category: 'painting' },
      { id: 'customPaint', category: 'painting' },
      { id: 'mattePaint', category: 'painting' },
      { id: 'colorMatch', category: 'painting' },
      { id: 'spotRepair', category: 'painting' },
      { id: 'antiRustCoat', category: 'painting' },
    ],
  },
  {
    key: 'detailing',
    icon: '',
    colorClass: 'bg-purple-500/10 text-purple-500',
    defaultCategory: 'detailing',
    items: [
      { id: 'handWash', category: 'carwash' },
      { id: 'autoWash', category: 'carwash' },
      { id: 'chemClean', category: 'detailing' },
      { id: 'interiorDeep', category: 'detailing' },
      { id: 'leatherClean', category: 'detailing' },
      { id: 'engineBayClean', category: 'detailing' },
      { id: 'polish', category: 'detailing' },
      { id: 'ceramic', category: 'detailing' },
      { id: 'paintCorrection', category: 'detailing' },
      { id: 'headlightRestore', category: 'detailing' },
    ],
  },
  {
    key: 'glass',
    icon: '',
    colorClass: 'bg-slate-500/10 text-slate-600 dark:text-slate-300',
    defaultCategory: 'glass',
    items: [
      { id: 'windshieldReplace', category: 'glass' },
      { id: 'chipRepair', category: 'glass' },
      { id: 'sideWindow', category: 'glass' },
      { id: 'rearGlass', category: 'glass' },
      { id: 'sunroofGlass', category: 'glass' },
      { id: 'tinting', category: 'glass' },
      { id: 'tintRemoval', category: 'glass' },
      { id: 'rainSensor', category: 'glass' },
    ],
  },
  {
    key: 'parts',
    icon: '',
    colorClass: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-300',
    defaultCategory: 'parts',
    items: [
      { id: 'newParts', category: 'parts' },
      { id: 'usedParts', category: 'parts' },
      { id: 'bodyParts', category: 'parts' },
      { id: 'consumables', category: 'parts' },
      { id: 'oemParts', category: 'parts' },
      { id: 'aftermarketParts', category: 'parts' },
      { id: 'engineParts', category: 'parts' },
      { id: 'performanceParts', category: 'parts' },
    ],
  },
  {
    key: 'diagnostics',
    icon: '',
    colorClass: 'bg-violet-500/10 text-violet-500',
    defaultCategory: 'diagnostics',
    items: [
      { id: 'fullScan', category: 'diagnostics' },
      { id: 'checkEngine', category: 'diagnostics' },
      { id: 'prePurchase', category: 'diagnostics' },
      { id: 'electricalDiag', category: 'diagnostics' },
      { id: 'noiseDiag', category: 'diagnostics' },
      { id: 'leakDiag', category: 'diagnostics' },
    ],
  },
  {
    key: 'tuning',
    icon: '',
    colorClass: 'bg-rose-500/10 text-rose-500',
    defaultCategory: 'tuning',
    items: [
      { id: 'ecuRemap', category: 'tuning' },
      { id: 'stageTuning', category: 'tuning' },
      { id: 'exhaustTune', category: 'exhaust' },
      { id: 'lowering', category: 'tuning' },
      { id: 'bodyKit', category: 'tuning' },
      { id: 'turboUpgrade', category: 'tuning' },
      { id: 'dynoTest', category: 'tuning' },
      { id: 'perfExhaust', category: 'exhaust' },
    ],
  },
  {
    key: 'evHybrid',
    icon: '',
    colorClass: 'bg-green-500/10 text-green-600',
    defaultCategory: 'ev',
    items: [
      { id: 'evBattery', category: 'ev' },
      { id: 'evBatteryReplace', category: 'ev' },
      { id: 'chargingInstall', category: 'ev' },
      { id: 'hybridBattery', category: 'ev' },
      { id: 'evMotor', category: 'ev' },
      { id: 'evDiag', category: 'ev' },
      { id: 'evSoftware', category: 'ev' },
    ],
  },
  {
    key: 'accessories',
    icon: '',
    colorClass: 'bg-pink-500/10 text-pink-500',
    defaultCategory: 'accessories',
    items: [
      { id: 'interiorAcc', category: 'accessories' },
      { id: 'exteriorAcc', category: 'accessories' },
      { id: 'audioAcc', category: 'audio' },
      { id: 'roofRack', category: 'accessories' },
      { id: 'floorMats', category: 'accessories' },
      { id: 'lightingAcc', category: 'accessories' },
    ],
  },
  {
    key: 'security',
    icon: '',
    colorClass: 'bg-red-600/10 text-red-600',
    defaultCategory: 'security',
    items: [
      { id: 'carAlarm', category: 'security' },
      { id: 'gpsTracker', category: 'security' },
      { id: 'dashcam', category: 'security' },
      { id: 'parkingSensors', category: 'security' },
      { id: 'reverseCam', category: 'security' },
      { id: 'blindSpot', category: 'security' },
      { id: 'remoteStart', category: 'security' },
    ],
  },
  {
    key: 'upholstery',
    icon: '',
    colorClass: 'bg-amber-700/10 text-amber-700',
    defaultCategory: 'upholstery',
    items: [
      { id: 'seatRepair', category: 'upholstery' },
      { id: 'leatherRestore', category: 'upholstery' },
      { id: 'headliner', category: 'upholstery' },
      { id: 'carpetReplace', category: 'upholstery' },
      { id: 'steeringWrap', category: 'upholstery' },
      { id: 'customInterior', category: 'upholstery' },
    ],
  },
  {
    key: 'wrap',
    icon: '',
    colorClass: 'bg-fuchsia-500/10 text-fuchsia-500',
    defaultCategory: 'wrap',
    items: [
      { id: 'vinylWrap', category: 'wrap' },
      { id: 'ppf', category: 'wrap' },
      { id: 'colorChangeWrap', category: 'wrap' },
      { id: 'chromeDelete', category: 'wrap' },
      { id: 'decals', category: 'wrap' },
    ],
  },
  {
    key: 'locksmith',
    icon: '',
    colorClass: 'bg-yellow-600/10 text-yellow-700',
    defaultCategory: 'locksmith',
    items: [
      { id: 'keyCopy', category: 'locksmith' },
      { id: 'transponderKey', category: 'locksmith' },
      { id: 'smartKey', category: 'locksmith' },
      { id: 'ignitionRepair', category: 'locksmith' },
      { id: 'doorLock', category: 'locksmith' },
      { id: 'emergencyUnlock', category: 'locksmith' },
    ],
  },
  {
    key: 'insurance',
    icon: '',
    colorClass: 'bg-emerald-600/10 text-emerald-600',
    defaultCategory: 'insurance',
    items: [
      { id: 'autoInsurance', category: 'insurance' },
      { id: 'casco', category: 'insurance' },
      { id: 'thirdParty', category: 'insurance' },
      { id: 'claimsHelp', category: 'insurance' },
    ],
  },
  {
    key: 'legal',
    icon: '',
    colorClass: 'bg-neutral-500/10 text-neutral-600',
    defaultCategory: 'inspection',
    items: [
      { id: 'inspection', category: 'inspection' },
      { id: 'motInspection', category: 'inspection' },
      { id: 'registration', category: 'registration' },
      { id: 'titleTransfer', category: 'registration' },
      { id: 'importCustoms', category: 'importer' },
      { id: 'vinVerify', category: 'registration' },
    ],
  },
  {
    key: 'sales',
    icon: '',
    colorClass: 'bg-lime-600/10 text-lime-700',
    defaultCategory: 'dealership',
    items: [
      { id: 'newDealer', category: 'dealership' },
      { id: 'usedDealer', category: 'dealership' },
      { id: 'importerSales', category: 'importer' },
      { id: 'tradeIn', category: 'dealership' },
    ],
  },
  {
    key: 'rental',
    icon: '',
    colorClass: 'bg-blue-600/10 text-blue-600',
    defaultCategory: 'rental',
    items: [
      { id: 'carRental', category: 'rental' },
      { id: 'suvRental', category: 'rental' },
      { id: 'vanRental', category: 'rental' },
      { id: 'minibusRental', category: 'rental' },
      { id: 'truckRental', category: 'rental' },
      { id: 'motorcycleRental', category: 'rental' },
      { id: 'scooterRental', category: 'rental' },
      { id: 'busRental', category: 'rental' },
      { id: 'trailerRental', category: 'rental' },
      { id: 'luxuryRental', category: 'rental' },
      { id: 'electricRental', category: 'rental' },
      { id: 'longTermLease', category: 'rental' },
      { id: 'withDriverRental', category: 'rental' },
    ],
  },
  {
    key: 'specialty',
    icon: '',
    colorClass: 'bg-emerald-500/10 text-emerald-500',
    defaultCategory: 'other',
    items: [
      { id: 'disassembly', category: 'other' },
      { id: 'classicRestore', category: 'other' },
      { id: 'motorcycleSvc', category: 'other' },
      { id: 'drivingSchool', category: 'other' },
      { id: 'notaryCar', category: 'registration' },
    ],
  },
]

export function catalogToSubSections() {
  return AUTO_SERVICE_CATALOG.map((section) => ({
    key: section.key,
    icon: section.icon,
    colorClass: section.colorClass,
    defaultCategory: section.defaultCategory,
    items: section.items.map((item) => ({
      itemId: item.id,
      nameKey: `services.sub.${item.id}`,
      descKey: `services.sub.${item.id}Desc`,
    })),
  }))
}

export function catalogSectionsForCategory(category: ServiceCategory | 'all') {
  const sections = catalogToSubSections()
  if (category === 'all') return sections
  return sections.filter((section) => {
    const raw = AUTO_SERVICE_CATALOG.find((s) => s.key === section.key)
    if (!raw) return false
    return (
      raw.key === category ||
      raw.defaultCategory === category ||
      raw.items.some((item) => item.category === category)
    )
  })
}

export const MOBILE_SERVICE_ITEM_IDS = [
  'mobileVulcanization',
  'mobileDoorOpen',
  'mobileJumpStart',
  'mobileMechanic',
  'mobileWash',
  'mobileTires',
  'mobileFuel',
] as const

export const DISC_SERVICE_ITEM_IDS = [
  'discSale',
  'discMount',
  'discRepair',
  'discPolish',
  'alloyRepair',
  'forgedDiscs',
  'steelDiscs',
  'customDiscs',
] as const

export const SECTION_TO_CATEGORY: Record<ServiceSectionKey, ServiceCategory> = Object.fromEntries(
  AUTO_SERVICE_CATALOG.map((s) => [s.key, s.defaultCategory])
) as Record<ServiceSectionKey, ServiceCategory>
