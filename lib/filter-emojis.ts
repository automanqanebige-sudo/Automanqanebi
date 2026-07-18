import type { CarFeature, CustomsStatus, ImportRegion, ListingType, OfferType } from '@/types/filters'
import type { RentalSubService, RentalTransportType } from '@/types/rental-transport'

export const CATEGORY_EMOJI: Record<string, string> = {
  car: '🚗',
  suv: '🚙',
  van: '🚐',
  truck: '🚚',
  motorcycle: '🏍️',
}

export const BODY_EMOJI: Record<string, string> = {
  sedan: '🚗',
  suv: '🚙',
  hatchback: '🚘',
  coupe: '🏎️',
  wagon: '🚐',
  pickup: '🛻',
  van: '🚐',
  special_tech: '🚜',
}

export const FUEL_EMOJI: Record<string, string> = {
  petrol: '⛽',
  diesel: '🛢️',
  hybrid: '🔋',
  electric: '⚡',
  lpg: '💨',
}

export const TRANSMISSION_EMOJI: Record<string, string> = {
  automatic: '🔄',
  manual: '⚙️',
  'semi-automatic': '🔀',
}

export const DRIVE_EMOJI: Record<string, string> = {
  fwd: '➡️',
  rwd: '⬅️',
  awd: '🔗',
  '4wd': '🛞',
}

export const STEERING_EMOJI: Record<string, string> = {
  left: '◀️',
  right: '▶️',
}

export const LISTING_EMOJI: Record<ListingType, string> = {
  '': '🌐',
  vip: '👑',
  vip_plus: '💎',
  super_vip: '🌟',
  silver: '🥈',
  gold: '🥇',
  platinum: '💠',
  dealer: '🏢',
  salon: '🏬',
}

export const IMPORT_EMOJI: Record<ImportRegion, string> = {
  '': '🌍',
  usa: '🇺🇸',
  europe: '🇪🇺',
  japan: '🇯🇵',
  korea: '🇰🇷',
  uae: '🇦🇪',
}

export const CUSTOMS_EMOJI: Record<CustomsStatus, string> = {
  '': '📋',
  cleared: '✅',
  not_cleared: '⏳',
}

export const OFFER_EMOJI: Record<OfferType, string> = {
  '': '🌐',
  sale: '🏷️',
  rent: '🔑',
}

export const FEATURE_EMOJI: Record<CarFeature, string> = {
  ac: '❄️',
  climate: '🌡️',
  sunroof: '☀️',
  navigation: '🗺️',
  parking_sensor: '📡',
  rear_camera: '📷',
  bluetooth: '📶',
  usb: '🔌',
  carplay: '🍎',
  android_auto: '🤖',
  start_stop: '⏯️',
  leather: '🪑',
  seat_heat: '🔥',
  seat_vent: '💨',
  electric_windows: '🪟',
  cruise_control: '🛣️',
  adaptive_cruise: '🎯',
  blind_spot: '👁️',
  lane_assist: '🛤️',
  abs: '🛑',
  esp: '⚡',
  airbag: '🎈',
  keyless: '🔑',
}

export const RENTAL_TRANSPORT_EMOJI: Record<RentalTransportType, string> = {
  car: '🚗',
  suv: '🚙',
  van: '🚐',
  minibus: '🚌',
  truck: '🚚',
  motorcycle: '🏍️',
  scooter: '🛵',
  rv: '🏕️',
  bus: '🚌',
  trailer: '🛞',
  luxury: '💎',
  electric: '⚡',
}

export const RENTAL_SUB_EMOJI: Record<RentalSubService, string> = {
  carRental: '🚗',
  suvRental: '🚙',
  vanRental: '🚐',
  minibusRental: '🚌',
  truckRental: '🚚',
  motorcycleRental: '🏍️',
  scooterRental: '🛵',
  rvRental: '🏕️',
  busRental: '🚌',
  trailerRental: '🛞',
  luxuryRental: '💎',
  electricRental: '⚡',
  longTermLease: '📅',
  carShare: '🔄',
  withDriverRental: '🧑‍✈️',
}

export function withEmoji(emoji: string | undefined, label: string): string {
  return emoji ? `${emoji} ${label}` : label
}

export function catalogItemEmoji(itemId: string, sectionIcon: string): string {
  if (itemId in RENTAL_SUB_EMOJI) {
    return RENTAL_SUB_EMOJI[itemId as RentalSubService]
  }
  return sectionIcon
}
