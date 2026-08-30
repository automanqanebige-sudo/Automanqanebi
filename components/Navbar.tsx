'use client'

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
        className="h-8 w-8 shrink-0 rounded-full object-cover ring-2 ring-primary/20"
      />
    )
  }

  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
      {initial}
    </span>
  )
}

export default function Navbar() {
  const { t } = useLanguage()
  const { user, loading: authLoading, logout } = useAuth()
  const showAdmin = !authLoading && user && isAdminEmail(user.email)

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-white">
        <nav className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-3 sm:h-16 sm:gap-4 sm:px-4 lg:px-6">
          <SiteLogo compact />

          <div className="flex-1" aria-hidden />

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            {showAdmin && (
              <Link
                href="/admin"
                className="hidden rounded-lg border border-primary/30 px-3 py-2 text-xs font-semibold text-primary sm:inline-flex"
              >
                {t('nav.admin')}
              </Link>
            )}

            <Link
              href="/add-car"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:px-4"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">{t('nav.addCar')}</span>
            </Link>

            <div className="hidden items-center gap-1 md:flex">
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
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t('auth.logout')}
                </button>
              </div>
            ) : (
              <div className="hidden items-center gap-2 md:flex">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  <LogIn className="h-4 w-4" />
                  {t('nav.login')}
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary"
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
