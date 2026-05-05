'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Car, Heart, User, MessageCircle, Home, Plus, LogIn, UserPlus } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'მთავარი', labelEn: 'Home', icon: Home },
  { href: '/add-car', label: 'დამატება', labelEn: 'Add Car', icon: Plus },
  { href: '/favorites', label: 'ფავორიტები', labelEn: 'Favorites', icon: Heart },
  { href: '/profile', label: 'პროფილი', labelEn: 'Profile', icon: User },
  { href: '/chat', label: 'ჩატი', labelEn: 'Chat', icon: MessageCircle },
]

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            <LogIn className="h-4 w-4" />
            შესვლა
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <UserPlus className="h-4 w-4" />
            რეგისტრაცია
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
                {link.label}
              </Link>
            ))}
            <div className="my-3 border-t border-border" />
            <Link
              href="/login"
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-secondary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <LogIn className="h-5 w-5" />
              შესვლა
            </Link>
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <UserPlus className="h-5 w-5" />
              რეგისტრაცია
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
