'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Search, Plus, Globe, User, Menu, X, ChevronDown, Heart, Bell } from 'lucide-react'
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

export default function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { currency, toggleCurrency } = useCurrency()
  const [searchFocused, setSearchFocused] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md">
      {/* Top bar */}
      <div className="border-b border-gray-100">
        <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between gap-4 px-4 lg:px-6">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center">
            <Image
              src="/logo.jpg"
              alt="Automanqanebi.ge"
              width={160}
              height={80}
              className="h-14 w-auto object-contain"
              priority
            />
          </Link>

          {/* Search bar - Desktop */}
          <div className="mx-4 hidden flex-1 max-w-2xl lg:block">
            <div className={`relative transition-all duration-200 ${searchFocused ? 'scale-[1.02]' : ''}`}>
              <Search className={`absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 transition-colors ${searchFocused ? 'text-primary' : 'text-gray-400'}`} />
              <input
                type="text"
                placeholder="ID, ტელეფონი, საიდენტო სიტყვა..."
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="h-12 w-full rounded-full border border-gray-200 bg-gray-50/50 pl-14 pr-6 text-sm text-gray-700 placeholder:text-gray-400 transition-all focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10"
              />
            </div>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center gap-2">
            {/* Add button */}
            <Link
              href="/add-car"
              className="hidden items-center gap-2 rounded-full bg-gradient-to-r from-primary to-orange-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 md:flex"
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              დამატება
            </Link>

            {/* Language/Currency */}
            <button
              onClick={toggleCurrency}
              className="hidden items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 md:flex"
            >
              <Globe className="h-4 w-4 text-gray-500" />
              <span>ქართული, {currency === 'GEL' ? '₾' : '$'}</span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>

            {/* Favorites */}
            <Link
              href="/favorites"
              className="hidden h-11 w-11 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-all hover:border-gray-300 hover:bg-gray-50 hover:text-primary md:flex"
            >
              <Heart className="h-5 w-5" />
            </Link>

            {/* Notifications */}
            <button className="relative hidden h-11 w-11 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-all hover:border-gray-300 hover:bg-gray-50 md:flex">
              <Bell className="h-5 w-5" />
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">3</span>
            </button>

            {/* Login */}
            <Link
              href="/login"
              className="hidden items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 md:flex"
            >
              <User className="h-4 w-4 text-gray-500" />
              შესვლა
            </Link>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-all hover:bg-gray-50 lg:hidden"
              aria-label={mobileOpen ? 'მენიუს დახურვა' : 'მენიუს გახსნა'}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation links */}
      <nav className="hidden border-b border-gray-100 bg-white lg:block">
        <div className="mx-auto flex max-w-[1400px] items-center px-4 lg:px-6">
          <div className="flex items-center">
            {navLinks.map((link, index) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={index}
                  href={link.href}
                  className={`relative flex items-center gap-1.5 px-4 py-4 text-sm font-medium transition-colors ${
                    isActive ? 'text-primary' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {link.label}
                  {link.hasDropdown && <ChevronDown className="h-3.5 w-3.5" />}
                  {isActive && (
                    <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-primary" />
                  )}
                </Link>
              )
            })}
          </div>
          <div className="ml-auto flex items-center">
            <Link href="/compare" className="px-4 py-4 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">
              დახმარება
            </Link>
            <Link href="/favorites" className="px-4 py-4 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">
              კონტაქტი
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="animate-fade-in border-t border-gray-100 bg-white lg:hidden">
          {/* Mobile search */}
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="ძებნა..."
                className="h-12 w-full rounded-full border border-gray-200 bg-gray-50 pl-12 pr-4 text-sm text-gray-700 placeholder:text-gray-400 focus:border-primary focus:outline-none"
              />
            </div>
          </div>
          
          <div className="flex flex-col border-t border-gray-100 px-2 py-2">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          <div className="border-t border-gray-100 p-4">
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/add-car"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-orange-500 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25"
              >
                <Plus className="h-4 w-4" />
                დამატება
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-700"
              >
                <User className="h-4 w-4" />
                შესვლა
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
