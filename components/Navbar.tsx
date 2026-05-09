'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Car, Heart, User, MessageCircle, Home, Plus, LogIn, UserPlus } from 'lucide-react'
import { Language, useLanguage } from '../context/LanguageContext'

const navLinks = [
  { href: '/', key: 'nav.home', icon: Home },
  { href: '/add-car', key: 'nav.addCar', icon: Plus },
  { href: '/favorites', key: 'nav.favorites', icon: Heart },
  { href: '/profile', key: 'nav.profile', icon: User },
  { href: '/chat', key: 'nav.chat', icon: MessageCircle },
]

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { language, setLanguage, t } = useLanguage()

  const languageOptions: { code: Language; flag: string; label: string }[] = [
    { code: 'ka', flag: '🇬🇪', label: 'ქართული' },
    { code: 'ru', flag: '🇷🇺', label: 'Русский' },
    { code: 'en', flag: '🇺🇸', label: 'English' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Car className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
            AUTOMANQANEBI<span className="text-primary">.GE</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <link.icon className="h-4 w-4" />
              {t(link.key)}
            </Link>
          ))}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <div className="flex items-center gap-1 rounded-lg border border-border bg-background px-2 py-1">
            {languageOptions.map((option) => (
              <button
                key={option.code}
                onClick={() => setLanguage(option.code)}
                className={`rounded-md px-2 py-1 text-sm transition-colors ${
                  language === option.code ? 'bg-primary/15 text-foreground' : 'text-muted-foreground hover:bg-secondary'
                }`}
                aria-label={option.label}
                title={option.label}
              >
                {option.flag}
              </button>
            ))}
          </div>
          <Link
            href="/login"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            <LogIn className="h-4 w-4" />
            {t('nav.login')}
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <UserPlus className="h-4 w-4" />
            {t('nav.register')}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg p-2 text-foreground transition-colors hover:bg-secondary md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-border bg-card md:hidden">
          <div className="space-y-1 px-4 pb-4 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <link.icon className="h-5 w-5" />
                {t(link.key)}
              </Link>
            ))}
            <div className="flex items-center gap-2 rounded-lg px-3 py-2">
              <span className="text-sm text-muted-foreground">{t('nav.language')}:</span>
              {languageOptions.map((option) => (
                <button
                  key={option.code}
                  onClick={() => setLanguage(option.code)}
                  className={`rounded-md px-2 py-1 text-sm transition-colors ${
                    language === option.code ? 'bg-primary/15 text-foreground' : 'text-muted-foreground hover:bg-secondary'
                  }`}
                  aria-label={option.label}
                  title={option.label}
                >
                  {option.flag}
                </button>
              ))}
            </div>
            <div className="my-3 border-t border-border" />
            <Link
              href="/login"
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-secondary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <LogIn className="h-5 w-5" />
              {t('nav.login')}
            </Link>
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <UserPlus className="h-5 w-5" />
              {t('nav.register')}
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
