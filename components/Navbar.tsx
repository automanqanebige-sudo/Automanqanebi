'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Search, Plus, Globe, User, Menu, X, ChevronDown, Heart, Bell } from 'lucide-react'
import { useCurrency } from '@/context/CurrencyContext'

const navLinks = [
  { href: '/services', label: 'სერვისები' },
  { href: '/', label: 'გაქირავება' },
  { href: '/', label: 'აუქციონი' },
  { href: '/', label: 'VIN-ის შემოწმება' },
  { href: '/', label: 'დილერები' },
  { href: '/', label: 'ავტოსალონები' },
  { href: '/blog', label: 'კატალოგი' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { currency, toggleCurrency } = useCurrency()

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top bar */}
      <div className="border-b border-gray-100">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src="/logo.jpg"
              alt="Automanqanebi.ge"
              width={120}
              height={60}
              className="h-12 w-auto"
              priority
            />
          </Link>

          {/* Search bar */}
          <div className="hidden flex-1 md:block">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="ID, ტელეფონი, საიდენტო..."
                className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Right buttons */}
          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/add-car"
              className="hidden items-center gap-1.5 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 md:flex"
            >
              <Plus className="h-4 w-4" />
              დამატება
            </Link>

            <button
              onClick={toggleCurrency}
              className="hidden items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50 md:flex"
            >
              <Globe className="h-4 w-4 text-gray-500" />
              <span>ქართული, {currency === 'GEL' ? '₾' : '$'}</span>
              <ChevronDown className="h-3 w-3 text-gray-400" />
            </button>

            <Link href="/favorites" className="hidden h-10 w-10 items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 md:flex">
              <Heart className="h-4 w-4 text-gray-500" />
            </Link>

            <button className="relative hidden h-10 w-10 items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 md:flex">
              <Bell className="h-4 w-4 text-gray-500" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">3</span>
            </button>

            <Link href="/login" className="hidden items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50 md:flex">
              <User className="h-4 w-4 text-gray-500" />
              შესვლა
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 md:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation links */}
      <nav className="hidden border-b border-gray-100 md:block">
        <div className="mx-auto flex max-w-7xl items-center px-4">
          {navLinks.map((link, i) => (
            <Link
              key={i}
              href={link.href}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                pathname === link.href ? 'text-orange-500' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="ml-auto flex">
            <Link href="/compare" className="px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900">დახმარება</Link>
            <Link href="/favorites" className="px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900">კონტაქტი</Link>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white md:hidden">
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="ძებნა..."
                className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="border-t border-gray-100 px-2 py-2">
            {navLinks.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="border-t border-gray-100 p-4">
            <div className="grid grid-cols-2 gap-2">
              <Link href="/add-car" className="flex items-center justify-center gap-1.5 rounded-lg bg-orange-500 py-2.5 text-sm font-medium text-white">
                <Plus className="h-4 w-4" />
                დამატება
              </Link>
              <Link href="/login" className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 py-2.5 text-sm font-medium">
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
