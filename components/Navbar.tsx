'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Car, Heart, Plus, LogIn, Menu, X, Wrench, BookOpen, GitCompare, User } from 'lucide-react'
import { useCurrency } from '@/context/CurrencyContext'

const navLinks = [
  { href: '/', label: 'მთავარი', icon: Car },
  { href: '/services', label: 'სერვისები', icon: Wrench },
  { href: '/add-car', label: 'დამატება', icon: Plus },
  { href: '/blog', label: 'ბლოგი', icon: BookOpen },
  { href: '/compare', label: 'შედარება', icon: GitCompare },
  { href: '/favorites', label: 'რჩეულები', icon: Heart },
]

export default function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { currency, toggleCurrency } = useCurrency()

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-lg">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25">
            <Car className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-foreground">
              AUTOMANQANEBI
            </span>
            <span className="text-[10px] text-muted-foreground">.GE</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            )
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Currency toggle */}
          <button
            onClick={toggleCurrency}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-sm font-medium transition-all hover:bg-secondary"
          >
            <span className={`transition-colors ${currency === 'GEL' ? 'text-primary' : 'text-muted-foreground'}`}>₾</span>
            <span className="text-border">/</span>
            <span className={`transition-colors ${currency === 'USD' ? 'text-primary' : 'text-muted-foreground'}`}>$</span>
          </button>

          {/* Profile link (desktop) */}
          <Link
            href="/profile"
            className="hidden h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground md:flex"
          >
            <User className="h-5 w-5" />
          </Link>

          {/* Login button */}
          <Link
            href="/login"
            className="hidden items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-md shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-lg md:flex"
          >
            <LogIn className="h-4 w-4" />
            შესვლა
          </Link>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground lg:hidden"
            aria-label={mobileOpen ? 'მენიუს დახურვა' : 'მენიუს გახსნა'}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="animate-fade-in-up border-t border-border bg-background px-4 pb-4 pt-2 lg:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              )
            })}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Link
                href="/profile"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 rounded-lg border border-border bg-card py-3 text-sm font-medium text-card-foreground transition-all hover:bg-secondary"
              >
                <User className="h-4 w-4" />
                პროფილი
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-medium text-primary-foreground shadow-md shadow-primary/25 transition-all hover:bg-primary/90"
              >
                <LogIn className="h-4 w-4" />
                შესვლა
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
