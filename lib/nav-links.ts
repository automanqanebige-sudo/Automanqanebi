import type { LucideIcon } from 'lucide-react'
import {
  Heart,
  User as UserIcon,
  MessageCircle,
  Home,
  Plus,
  Wrench,
  Columns2,
} from 'lucide-react'

export type NavLink = {
  href: string
  key: string
  icon: LucideIcon
}

export const navLinks: NavLink[] = [
  { href: '/', key: 'nav.home', icon: Home },
  { href: '/services', key: 'nav.services', icon: Wrench },
  { href: '/workshops', key: 'nav.workshops', icon: Wrench },
  { href: '/add-car', key: 'nav.addCar', icon: Plus },
  { href: '/compare', key: 'nav.compare', icon: Columns2 },
  { href: '/favorites', key: 'nav.favorites', icon: Heart },
  { href: '/profile', key: 'nav.profile', icon: UserIcon },
  { href: '/chat', key: 'nav.chat', icon: MessageCircle },
]
