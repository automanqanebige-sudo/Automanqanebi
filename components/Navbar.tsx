'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { User } from 'firebase/auth'
import { LogIn, UserPlus, Shield, LogOut } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { isAdminEmail, SITE_LOGO_MAIN, SITE_LOGO_TLD } from '@/lib/site'
import { navLinks } from '@/lib/nav-links'
import NotificationBell from './NotificationBell'
import ThemeToggle from './ThemeToggle'
import CurrencyToggle from './CurrencyToggle'
import LanguageSwitcher from './LanguageSwitcher'
import MobileNavMenu from './MobileNavMenu'

const navBtn =
  'flex shrink-0 items-center gap-1 rounded-md px-1 py-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:px-1.5 lg:px-2'

function UserAvatar({ user, size = 'sm' }: { user: User; size?: 'sm' | 'md' }) {
  const initial = (user.displayName || user.email || '?').charAt(0).toUpperCase()
  const dims = size === 'md' ? 'h-8 w-8 text-xs' : 'h-7 w-7 text-[10px]'

  if (user.photoURL) {
    return (
      <Image
        src={user.photoURL}
        alt=""
        width={size === 'md' ? 32 : 28}
        height={size === 'md' ? 32 : 28}
        className={`${dims} shrink-0 rounded-full object-cover ring-2 ring-primary/25`}
      />
    )
  }

  return (
    <span
      className={`${dims} flex shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground`}
    >
      {initial}
    </span>
  )
}

export default function Navbar() {
  const { t } = useLanguage()
  const { user, loading: authLoading, logout } = useAuth()
  const showAdmin = !authLoading && user && isAdminEmail(user.email)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <nav className="mx-auto flex h-14 max-w-7xl items-center gap-1 px-1.5 sm:h-[4.25rem] sm:gap-1.5 sm:px-3 lg:px-4">
        <Link href="/" className="flex shrink-0 items-center gap-1 pr-0.5 sm:gap-1.5">
          <Image
            src="/logo.png"
            alt={`${SITE_LOGO_MAIN}${SITE_LOGO_TLD}`}
            width={48}
            height={48}
            className="h-10 w-10 shrink-0 rounded-full object-contain sm:h-11 sm:w-11 lg:h-12 lg:w-12"
            priority
          />
          <span className="hidden font-bold tracking-tight text-foreground 2xl:inline 2xl:text-lg">
            {SITE_LOGO_MAIN}
            <span className="text-primary">{SITE_LOGO_TLD}</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="relative hidden min-w-0 flex-1 items-center md:flex">
          <div className="flex min-w-0 flex-1 items-center overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-0 pr-4 lg:gap-px lg:pr-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch
                  className={navBtn}
                  title={t(link.key)}
                >
                  <link.icon className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                  <span className="hidden whitespace-nowrap text-[11px] font-medium leading-none lg:inline xl:text-xs">
                    {t(link.key)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <div
            className="pointer-events-none absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-card/95 to-transparent lg:w-4"
            aria-hidden
          />
        </div>

        <div className="flex-1 md:hidden" aria-hidden />

        {/* Desktop utilities */}
        <div className="hidden shrink-0 items-center gap-0.5 sm:gap-1 md:flex">
          {showAdmin && (
            <Link
              href="/admin"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-primary/40 bg-primary px-2 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 sm:px-2.5"
              title={t('nav.admin')}
            >
              <Shield className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
              <span className="whitespace-nowrap">{t('nav.admin')}</span>
            </Link>
          )}
          <NotificationBell />
          <ThemeToggle />
          <CurrencyToggle compact />
          <LanguageSwitcher />

          {!authLoading && user ? (
            <>
              <Link
                href="/profile"
                className="flex shrink-0 items-center rounded-md p-0.5 transition-colors hover:bg-secondary sm:p-1"
                title={user.displayName || user.email || ''}
              >
                <UserAvatar user={user} />
              </Link>
              <button
                type="button"
                onClick={() => logout()}
                className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:p-1.5"
                title={t('auth.logout')}
              >
                <LogOut className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                <span className="sr-only">{t('auth.logout')}</span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:p-1.5"
                title={t('nav.login')}
              >
                <LogIn className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                <span className="sr-only">{t('nav.login')}</span>
              </Link>
              <Link
                href="/register"
                className="flex shrink-0 items-center rounded-md bg-primary p-1 text-primary-foreground transition-colors hover:bg-primary/90 sm:p-1.5"
                title={t('nav.register')}
              >
                <UserPlus className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                <span className="sr-only">{t('nav.register')}</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile: notifications + hamburger dropdown (far right) */}
        <div className="flex shrink-0 items-center gap-0.5 md:hidden">
          {showAdmin && (
            <Link
              href="/admin"
              className="inline-flex shrink-0 items-center justify-center rounded-lg border border-primary/40 bg-primary p-1.5 text-primary-foreground"
              title={t('nav.admin')}
            >
              <Shield className="h-4 w-4" />
              <span className="sr-only">{t('nav.admin')}</span>
            </Link>
          )}
          <NotificationBell />
          <MobileNavMenu />
        </div>
      </nav>
    </header>
  )
}
