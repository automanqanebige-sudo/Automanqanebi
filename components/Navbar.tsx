'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Search, Plus, Globe, LogIn, Menu, X, ChevronDown, Settings } from 'lucide-react'
import { useCurrency } from '@/context/CurrencyContext'

const navLinks = [
  { href: '/services', label: 'სერვისები', hasDropdown: true },
  { href: '/', label: 'გაქირავება' },
  { href: '/', label: 'აუქციონი' },
  { href: '/', label: 'VIN-ის შემოწმება' },
  { href: '/', label: 'დილერები' },
  { href: '/', label: 'ავტოსალონები' },
  { href: '/', label: 'ავტონაწილები' },
  { href: '/blog', label: 'კატალოგი' },
]

const rightLinks = [
  { href: '/compare', label: 'დახმარება' },
  { href: '/favorites', label: 'კონტაქტი' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { currency, toggleCurrency } = useCurrency()

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top bar */}
      <div className="border-b border-gray-100">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 lg:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1">
            <span className="text-2xl font-bold text-gray-800">automanqanebi</span>
            <span className="rounded bg-primary px-1.5 py-0.5 text-sm font-bold text-white">.ge</span>
          </Link>

          {/* Search bar */}
          <div className="mx-6 hidden flex-1 max-w-xl lg:block">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="ID, ტელეფონი, საიდენტო სიტყვა..."
                className="h-12 w-full rounded-full border border-gray-200 bg-white pl-12 pr-4 text-sm text-gray-700 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center gap-3">
            {/* Add button */}
            <Link
              href="/add-car"
              className="hidden items-center gap-2 rounded-full border-2 border-primary bg-white px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/5 md:flex"
            >
              <Plus className="h-4 w-4" />
              დამატება
            </Link>

            {/* Language/Currency */}
            <button
              onClick={toggleCurrency}
              className="hidden items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 md:flex"
            >
              <Globe className="h-4 w-4" />
              ქართული, {currency === 'GEL' ? '₾' : '$'}
              <ChevronDown className="h-4 w-4" />
            </button>

            {/* Login */}
            <Link
              href="/login"
              className="hidden items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 md:flex"
            >
              <LogIn className="h-4 w-4" />
              შესვლა
            </Link>

            {/* Settings */}
            <button className="hidden h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 md:flex">
              <Settings className="h-5 w-5" />
            </button>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 lg:hidden"
              aria-label={mobileOpen ? 'მენიუს დახურვა' : 'მენიუს გახსნა'}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation links */}
      <nav className="hidden border-b border-gray-100 lg:block">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-1">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="flex items-center gap-1 px-4 py-4 text-sm font-medium text-gray-700 transition-colors hover:text-primary"
              >
                {link.label}
                {link.hasDropdown && <ChevronDown className="h-3.5 w-3.5" />}
              </Link>
            ))}
          </div>
          <div className="flex items-center">
            {rightLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="px-4 py-4 text-sm font-medium text-gray-700 transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="animate-fade-in border-t border-gray-100 bg-white px-4 pb-4 pt-2 lg:hidden">
          {/* Mobile search */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="ძებნა..."
              className="h-12 w-full rounded-full border border-gray-200 bg-white pl-12 pr-4 text-sm text-gray-700 placeholder:text-gray-400 focus:border-primary focus:outline-none"
            />
          </div>
          
          <div className="flex flex-col gap-1">
            {[...navLinks, ...rightLinks].map((link, index) => (
              <Link
                key={index}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Link
              href="/add-car"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 rounded-full border-2 border-primary bg-white py-3 text-sm font-semibold text-primary"
            >
              <Plus className="h-4 w-4" />
              დამატება
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-semibold text-white"
            >
              <LogIn className="h-4 w-4" />
              შესვლა
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
