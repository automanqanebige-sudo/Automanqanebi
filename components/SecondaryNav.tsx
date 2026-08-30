'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/context/LanguageContext'
import { navLinks } from '@/lib/nav-links'

export default function SecondaryNav() {
  const { t } = useLanguage()
  const pathname = usePathname()

  return (
    <div className="hidden border-b border-border bg-white md:block">
      <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 scrollbar-hide lg:px-6">
        {navLinks.map((link) => {
          const active =
            pathname === link.href ||
            (link.href !== '/' && pathname.startsWith(link.href))

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`whitespace-nowrap px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t(link.key)}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
