import type { CarFeature, CustomsStatus, ImportRegion, ListingType, OfferType } from '@/types/filters'
import type { RentalSubService, RentalTransportType } from '@/types/rental-transport'

const NO_EMOJI = ''

export const CATEGORY_EMOJI: Record<string, string> = {
  car: NO_EMOJI,
  suv: NO_EMOJI,
  van: NO_EMOJI,
  truck: NO_EMOJI,
  motorcycle: NO_EMOJI,
}

export const BODY_EMOJI: Record<string, string> = {
  sedan: NO_EMOJI,
  suv: NO_EMOJI,
  hatchback: NO_EMOJI,
  coupe: NO_EMOJI,
  wagon: NO_EMOJI,
  pickup: NO_EMOJI,
  van: NO_EMOJI,
  special_tech: NO_EMOJI,
}

export const FUEL_EMOJI: Record<string, string> = {
  petrol: NO_EMOJI,
  petrol_lpg: NO_EMOJI,
  diesel: NO_EMOJI,
  hybrid: NO_EMOJI,
  electric: NO_EMOJI,
  lpg: NO_EMOJI,
}

export const TRANSMISSION_EMOJI: Record<string, string> = {
  automatic: NO_EMOJI,
  manual: NO_EMOJI,
  'semi-automatic': NO_EMOJI,
}

export const DRIVE_EMOJI: Record<string, string> = {
  fwd: NO_EMOJI,
  rwd: NO_EMOJI,
  awd: NO_EMOJI,
  '4wd': NO_EMOJI,
}

export const STEERING_EMOJI: Record<string, string> = {
  left: NO_EMOJI,
  right: NO_EMOJI,
}

export const LISTING_EMOJI: Record<ListingType, string> = {
  '': NO_EMOJI,
  vip: NO_EMOJI,
  vip_plus: NO_EMOJI,
  super_vip: NO_EMOJI,
  silver: NO_EMOJI,
  gold: NO_EMOJI,
  platinum: NO_EMOJI,
  dealer: NO_EMOJI,
  salon: NO_EMOJI,
}

export const IMPORT_EMOJI: Record<ImportRegion, string> = {
  '': NO_EMOJI,
  usa: NO_EMOJI,
  europe: NO_EMOJI,
  japan: NO_EMOJI,
  korea: NO_EMOJI,
  uae: NO_EMOJI,
}

export const CUSTOMS_EMOJI: Record<CustomsStatus, string> = {
  '': NO_EMOJI,
  cleared: NO_EMOJI,
  not_cleared: NO_EMOJI,
}

export const OFFER_EMOJI: Record<OfferType, string> = {
  '': NO_EMOJI,
  sale: NO_EMOJI,
  rent: NO_EMOJI,
}

export const FEATURE_EMOJI: Record<CarFeature, string> = {
  ac: NO_EMOJI,
  climate: NO_EMOJI,
  sunroof: NO_EMOJI,
  navigation: NO_EMOJI,
  parking_sensor: NO_EMOJI,
  rear_camera: NO_EMOJI,
  bluetooth: NO_EMOJI,
  usb: NO_EMOJI,
  carplay: NO_EMOJI,
  android_auto: NO_EMOJI,
  start_stop: NO_EMOJI,
  leather: NO_EMOJI,
  seat_heat: NO_EMOJI,
  seat_vent: NO_EMOJI,
  electric_windows: NO_EMOJI,
  cruise_control: NO_EMOJI,
  adaptive_cruise: NO_EMOJI,
  blind_spot: NO_EMOJI,
  lane_assist: NO_EMOJI,
  abs: NO_EMOJI,
  esp: NO_EMOJI,
  airbag: NO_EMOJI,
  keyless: NO_EMOJI,
}

export const RENTAL_TRANSPORT_EMOJI: Record<RentalTransportType, string> = {
  car: NO_EMOJI,
  suv: NO_EMOJI,
  van: NO_EMOJI,
  minibus: NO_EMOJI,
  truck: NO_EMOJI,
  motorcycle: NO_EMOJI,
  scooter: NO_EMOJI,
  bus: NO_EMOJI,
  trailer: NO_EMOJI,
  luxury: NO_EMOJI,
  electric: NO_EMOJI,
}

export const RENTAL_SUB_EMOJI: Record<RentalSubService, string> = {
  carRental: NO_EMOJI,
  suvRental: NO_EMOJI,
  vanRental: NO_EMOJI,
  minibusRental: NO_EMOJI,
  truckRental: NO_EMOJI,
  motorcycleRental: NO_EMOJI,
  scooterRental: NO_EMOJI,
  busRental: NO_EMOJI,
  trailerRental: NO_EMOJI,
  luxuryRental: NO_EMOJI,
  electricRental: NO_EMOJI,
  longTermLease: NO_EMOJI,
  withDriverRental: NO_EMOJI,
}

export function withEmoji(_emoji: string | undefined, label: string): string {
  return label
}

export function catalogItemEmoji(_itemId: string, _sectionIcon: string): string {
  return NO_EMOJI
}
