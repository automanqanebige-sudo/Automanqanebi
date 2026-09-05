'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Building2, Home, Plus, User as UserIcon, Wrench } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'

export default function MobileBottomNav() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const pathname = usePathname()

  const links = [
    { href: '/', key: 'nav.home', icon: Home },
    { href: '/services', key: 'nav.services', icon: Wrench },
    { href: '/workshops', key: 'nav.workshops', icon: Building2 },
    { href: '/add-car', key: 'nav.addCar', icon: Plus, primary: true as const },
    {
      href: user ? '/profile' : '/login',
      key: user ? 'nav.profile' : 'nav.login',
      icon: UserIcon,
    },
  ]

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border/60 bg-surface/90 pb-[env(safe-area-inset-bottom)] shadow-nav backdrop-blur-xl md:hidden"
      aria-label="Mobile"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-around px-1 pt-1">
        {links.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname === item.href || pathname.startsWith(`${item.href}/`)
          const Icon = item.icon
          return (
            <li key={item.key} className="flex-1">
              <Link
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-0.5 py-2 text-[10px] font-medium transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 ${
                    item.primary
                      ? '-mt-3 bg-primary text-primary-foreground shadow-lg shadow-primary/30 ring-4 ring-background'
                      : isActive
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-secondary'
                  }`}
                >
                  <Icon className="h-[18px] w-[18px]" strokeWidth={isActive || item.primary ? 2.25 : 2} />
                </span>
                <span className="max-w-[4.5rem] truncate text-center leading-tight">{t(item.key)}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
