'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, LogIn, UserPlus } from 'lucide-react'
import type { User } from 'firebase/auth'
import Image from 'next/image'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { isAdminEmail } from '@/lib/site'
import SiteLogo from '@/components/SiteLogo'
import NotificationBell from './NotificationBell'
import ThemeToggle from './ThemeToggle'
import CurrencyToggle from './CurrencyToggle'
import LanguageSwitcher from './LanguageSwitcher'
import MobileNavMenu from './MobileNavMenu'
import SecondaryNav from './SecondaryNav'

function UserAvatar({ user }: { user: User }) {
  const initial = (user.displayName || user.email || '?').charAt(0).toUpperCase()

  if (user.photoURL) {
    return (
      <Image
        src={user.photoURL}
        alt=""
        width={32}
        height={32}
        className="h-8 w-8 shrink-0 rounded-full object-cover ring-2 ring-primary/25 transition-transform hover:scale-105"
      />
    )
  }

  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground ring-2 ring-primary/20">
      {initial}
    </span>
  )
}

export default function Navbar() {
  const { t } = useLanguage()
  const { user, loading: authLoading, logout } = useAuth()
  const showAdmin = !authLoading && user && isAdminEmail(user.email)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full nav-glass transition-shadow duration-300 ${
          scrolled ? 'nav-glass-scrolled' : ''
        }`}
      >
        <nav className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-3 sm:h-16 sm:gap-4 sm:px-4 lg:px-6">
          <SiteLogo compact />

          <div className="flex-1" aria-hidden />

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            {showAdmin && (
              <Link
                href="/admin"
                className="hidden rounded-lg border border-primary/25 bg-primary/5 px-3 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/10 sm:inline-flex"
              >
                {t('nav.admin')}
              </Link>
            )}

            <Link
              href="/add-car"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-md hover:shadow-primary/25 active:scale-[0.98] sm:px-5"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">{t('nav.addCar')}</span>
            </Link>

            <div className="hidden items-center gap-0.5 md:flex">
              <NotificationBell />
              <ThemeToggle />
              <CurrencyToggle compact />
              <LanguageSwitcher />
            </div>

            {!authLoading && user ? (
              <div className="hidden items-center gap-2 md:flex">
                <Link href="/profile" title={user.displayName || user.email || ''}>
                  <UserAvatar user={user} />
                </Link>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="rounded-lg px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  {t('auth.logout')}
                </button>
              </div>
            ) : (
              <div className="hidden items-center gap-1.5 md:flex">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  <LogIn className="h-4 w-4" />
                  {t('nav.login')}
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium transition-all hover:border-primary/30 hover:bg-secondary"
                >
                  <UserPlus className="h-4 w-4" />
                  {t('nav.register')}
                </Link>
              </div>
            )}

            <div className="flex items-center gap-0.5 md:hidden">
              <NotificationBell />
              <MobileNavMenu />
            </div>
          </div>
        </nav>
      </header>
      <SecondaryNav />
    </>
  )
}
