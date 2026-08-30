/**
 * Wheel / alloy disc filters for Georgia marketplace (დისკები).
 */
export type DiscDiameter =
  | '13'
  | '14'
  | '15'
  | '16'
  | '17'
  | '18'
  | '19'
  | '20'
  | '21'
  | '22'

export type DiscBoltPattern =
  | '4x100'
  | '4x108'
  | '4x114.3'
  | '5x100'
  | '5x108'
  | '5x110'
  | '5x112'
  | '5x114.3'
  | '5x120'
  | '5x130'
  | '6x139.7'

export type DiscMaterial = 'alloy' | 'steel' | 'forged'

export type DiscCondition = 'new' | 'used'

export const DISC_DIAMETERS: DiscDiameter[] = [
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
]

export const DISC_BOLT_PATTERNS: DiscBoltPattern[] = [
  '4x100',
  '4x108',
  '4x114.3',
  '5x100',
  '5x108',
  '5x110',
  '5x112',
  '5x114.3',
  '5x120',
  '5x130',
  '6x139.7',
]

export const DISC_MATERIALS: DiscMaterial[] = ['alloy', 'steel', 'forged']

export const DISC_CONDITIONS: DiscCondition[] = ['new', 'used']

export type ServiceDiscFilterState = {
  diameter: DiscDiameter | ''
  boltPattern: DiscBoltPattern | ''
  material: DiscMaterial | ''
  condition: DiscCondition | ''
}

export const initialDiscFilters: ServiceDiscFilterState = {
  diameter: '',
  boltPattern: '',
  material: '',
  condition: '',
}

export function countActiveDiscFilters(filters: ServiceDiscFilterState): number {
  let n = 0
  if (filters.diameter) n++
  if (filters.boltPattern) n++
  if (filters.material) n++
  if (filters.condition) n++
  return n
}
