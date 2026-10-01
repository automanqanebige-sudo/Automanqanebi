export type VehicleGroup = 'automobile' | 'special_tech' | 'moto_tech'

export const VEHICLE_GROUPS: VehicleGroup[] = ['automobile', 'special_tech', 'moto_tech']

/** Subcategory ids per main group — stored in `bodyType` on listings / filters */
export const VEHICLE_SUBCATEGORIES: Record<VehicleGroup, readonly string[]> = {
  automobile: [
    'sedan',
    'suv',
    'coupe',
    'hatchback',
    'wagon',
    'cabriolet',
    'pickup',
    'minivan',
    'limousine',
    'crossover',
  ],
  special_tech: [
    'tractor',
    'excavator',
    'loader',
    'crane',
    'bulldozer',
    'truck',
    'bus',
    'trailer',
    'combine',
    'forklift',
    'mixer',
    'grader',
  ],
  moto_tech: [
    'moto',
    'motorcycle',
    'scooter',
    'atv',
    'watercraft',
    'tricycle',
    'buggy',
    'snowmobile',
    'boat_trailer',
    'moto_trailer',
    'gokart',
  ],
}

const SUBCATEGORY_TO_GROUP = new Map<string, VehicleGroup>(
  (Object.entries(VEHICLE_SUBCATEGORIES) as [VehicleGroup, readonly string[]][]).flatMap(
    ([group, subs]) => subs.map((sub) => [sub, group] as const)
  )
)

export function subcategoriesForGroup(group: VehicleGroup): readonly string[] {
  return VEHICLE_SUBCATEGORIES[group]
}

export function vehicleGroupOfSubcategory(sub: string): VehicleGroup | null {
  return SUBCATEGORY_TO_GROUP.get(sub) ?? null
}

export function subcategoryLabelKey(group: VehicleGroup, sub: string): string {
  if (group === 'automobile') return `filter.body.${sub}`
  if (group === 'special_tech') return `filter.special.${sub}`
  return `filter.moto.${sub}`
}

export function vehicleGroupLabelKey(group: VehicleGroup): string {
  return `filter.vehicleGroup.${group}`
}

type CarLike = {
  vehicleGroup?: string
  bodyType?: string
  category?: string
}

export function getVehicleGroupForCar(car: CarLike): VehicleGroup {
  const vg = car.vehicleGroup?.trim()
  if (vg === 'automobile' || vg === 'special_tech' || vg === 'moto_tech') {
    return vg
  }

  const body = car.bodyType?.trim()
  if (body) {
    const fromBody = vehicleGroupOfSubcategory(body)
    if (fromBody) return fromBody
  }

  const cat = (car.category ?? '').trim().toLowerCase()
  if (cat === 'motorcycle') return 'moto_tech'
  if (cat === 'truck') return 'special_tech'
  if (body === 'special_tech') return 'special_tech'

  return 'automobile'
}

export function isSubcategoryInGroup(sub: string, group: VehicleGroup): boolean {
  return VEHICLE_SUBCATEGORIES[group].includes(sub)
}
