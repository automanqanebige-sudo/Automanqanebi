'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Heart, Home, Plus, User as UserIcon, Wrench } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'

export default function MobileBottomNav() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const pathname = usePathname()

  const links = [
    { href: '/', key: 'nav.home', icon: Home },
    { href: '/services', key: 'nav.services', icon: Wrench },
    { href: '/add-car', key: 'nav.addCar', icon: Plus, primary: true as const },
    { href: '/favorites', key: 'nav.favorites', icon: Heart },
    {
      href: user ? '/profile' : '/login',
      key: user ? 'nav.profile' : 'nav.login',
      icon: UserIcon,
    },
  ]

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
      aria-label="Mobile"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-around px-1 pt-1">
        {links.map((item) => {
          const isActive =
            item.href === '/' ? pathname === '/' : pathname.startsWith(item.href.replace('/login', '/profile')) || pathname === item.href
          const Icon = item.icon
          return (
            <li key={item.key} className="flex-1">
              <Link
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-1 py-2 text-[10px] font-medium ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    item.primary
                      ? 'bg-primary text-primary-foreground shadow-md shadow-primary/30'
                      : isActive
                        ? 'bg-primary/10'
                        : ''
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                {t(item.key)}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
