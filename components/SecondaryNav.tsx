'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/context/LanguageContext'
import { navLinks } from '@/lib/nav-links'

export default function SecondaryNav() {
  const { t } = useLanguage()
  const pathname = usePathname()

  return (
    <div className="border-b border-border/60 bg-surface/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-0.5 overflow-x-auto px-3 scrollbar-hide sm:gap-1 sm:px-4 lg:px-6">
        {navLinks.map((link) => {
          const active =
            pathname === link.href ||
            (link.href !== '/' && pathname.startsWith(link.href))

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative whitespace-nowrap px-3 py-2.5 text-sm font-medium transition-colors sm:px-4 sm:py-3 ${
                active
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t(link.key)}
              {active && (
                <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-primary sm:inset-x-3" />
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
