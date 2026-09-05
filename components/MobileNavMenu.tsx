'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogIn, LogOut, Menu, Shield, UserPlus, X } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { isAdminEmail } from '@/lib/site'
import { navLinks } from '@/lib/nav-links'
import ThemeToggle from './ThemeToggle'
import CurrencyToggle from './CurrencyToggle'
import LanguageSwitcher from './LanguageSwitcher'

export default function MobileNavMenu() {
  const { t } = useLanguage()
  const { user, loading: authLoading, logout } = useAuth()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const showAdmin = !authLoading && user && isAdminEmail(user.email)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <div className="relative md:hidden" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-secondary/60 text-foreground transition-colors hover:bg-secondary"
        aria-label={open ? t('nav.menuClose') : t('nav.menuOpen')}
        aria-expanded={open}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 top-14 z-[55] bg-background/60 backdrop-blur-sm"
            aria-hidden
            onClick={() => setOpen(false)}
          />
          <div className="fixed right-2 top-[3.75rem] z-[60] max-h-[calc(100vh-4.5rem)] w-[min(20rem,calc(100vw-1rem))] overflow-y-auto rounded-xl border border-border bg-card shadow-xl">
            <nav className="p-2">
              <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t('nav.menuTitle')}
              </p>
              {navLinks.map((link) => {
                const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground hover:bg-secondary'
                    }`}
                  >
                    <link.icon className="h-4 w-4 shrink-0" />
                    {t(link.key)}
                  </Link>
                )
              })}

              {showAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="mt-1 flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/15"
                >
                  <Shield className="h-4 w-4 shrink-0" />
                  {t('nav.admin')}
                </Link>
              )}
            </nav>

            <div className="border-t border-border p-3 space-y-3">
              <div className="flex items-center justify-between gap-2 rounded-lg bg-secondary/50 px-3 py-2">
                <span className="text-sm text-muted-foreground">{t('nav.theme')}</span>
                <ThemeToggle />
              </div>
              <div className="flex items-center justify-between gap-2 rounded-lg bg-secondary/50 px-3 py-2">
                <span className="text-sm text-muted-foreground">{t('nav.currency')}</span>
                <CurrencyToggle compact />
              </div>
              <LanguageSwitcher variant="mobile" />
            </div>

            <div className="border-t border-border p-2">
              {!authLoading && user ? (
                <div className="flex gap-2">
                  <Link
                    href="/profile"
                    onClick={() => setOpen(false)}
                    className="btn-primary flex flex-1 rounded-xl px-3 py-2.5 text-sm"
                  >
                    {t('nav.profile')}
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false)
                      void logout()
                    }}
                    className="flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
                  >
                    <LogOut className="h-4 w-4" />
                    {t('auth.logout')}
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
                  >
                    <LogIn className="h-4 w-4" />
                    {t('nav.login')}
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setOpen(false)}
                    className="btn-primary flex flex-1 rounded-xl px-3 py-2.5 text-sm"
                  >
                    <UserPlus className="h-4 w-4" />
                    {t('nav.register')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
