export type RentalTransportType =
  | 'car'
  | 'suv'
  | 'van'
  | 'minibus'
  | 'truck'
  | 'motorcycle'
  | 'scooter'
  | 'rv'
  | 'bus'
  | 'trailer'
  | 'luxury'
  | 'electric'

export type RentalSubService =
  | 'carRental'
  | 'suvRental'
  | 'vanRental'
  | 'minibusRental'
  | 'truckRental'
  | 'motorcycleRental'
  | 'scooterRental'
  | 'rvRental'
  | 'busRental'
  | 'trailerRental'
  | 'luxuryRental'
  | 'electricRental'
  | 'longTermLease'
  | 'carShare'
  | 'withDriverRental'

export const RENTAL_TRANSPORT_TYPES: RentalTransportType[] = [
  'car',
  'suv',
  'van',
  'minibus',
  'truck',
  'motorcycle',
  'scooter',
  'rv',
  'bus',
  'trailer',
  'luxury',
  'electric',
]

export const RENTAL_SUB_SERVICES: RentalSubService[] = [
  'carRental',
  'suvRental',
  'vanRental',
  'minibusRental',
  'truckRental',
  'motorcycleRental',
  'scooterRental',
  'rvRental',
  'busRental',
  'trailerRental',
  'luxuryRental',
  'electricRental',
  'longTermLease',
  'carShare',
  'withDriverRental',
]

/** Default transport type for each rental sub-service (catalog / filter links). */
export const RENTAL_SUB_TRANSPORT: Partial<Record<RentalSubService, RentalTransportType>> = {
  carRental: 'car',
  suvRental: 'suv',
  vanRental: 'van',
  minibusRental: 'minibus',
  truckRental: 'truck',
  motorcycleRental: 'motorcycle',
  scooterRental: 'scooter',
  rvRental: 'rv',
  busRental: 'bus',
  trailerRental: 'trailer',
  luxuryRental: 'luxury',
  electricRental: 'electric',
  carShare: 'car',
}

export type ServiceRentalFilterState = {
  transport: RentalTransportType | ''
  subService: RentalSubService | ''
  withDriver: '' | 'yes' | 'no'
}

export const initialRentalFilters: ServiceRentalFilterState = {
  transport: '',
  subService: '',
  withDriver: '',
}

export function countActiveRentalFilters(filters: ServiceRentalFilterState): number {
  let n = 0
  if (filters.transport) n++
  if (filters.subService) n++
  if (filters.withDriver) n++
  return n
}
