'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Search, Plus, Globe, User, Menu, X, ChevronDown, Settings } from 'lucide-react'
import { useCurrency } from '@/context/CurrencyContext'

const navLinks = [
  { href: '/', label: 'სერვისები', hasDropdown: true },
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
  { href: '/', label: 'კონტაქტი' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { currency, toggleCurrency } = useCurrency()

  return (
    <header className="sticky top-0 z-50 bg-white">
      {/* Top bar */}
      <div className="border-b border-gray-100">
        <div className="mx-auto flex h-[72px] max-w-[1400px] items-center gap-4 px-4 lg:px-6">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center">
            <div className="flex items-center">
              <span className="text-[22px] font-bold tracking-tight text-gray-800">myauto</span>
              <span className="ml-0.5 rounded bg-[#FD4100] px-1.5 py-0.5 text-[13px] font-bold text-white">.ge</span>
            </div>
          </Link>

          {/* Search bar */}
          <div className="mx-4 hidden flex-1 max-w-[480px] lg:block">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="ID, ტელეფონი, საიდენტო სიტყვა..."
                className="h-11 w-full rounded-full border border-gray-200 bg-[#F9F9FB] pl-11 pr-4 text-[13px] text-gray-700 placeholder:text-gray-400 focus:border-[#FD4100] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-2">
            {/* Add button */}
            <Link
              href="/add-car"
              className="hidden h-10 items-center gap-2 rounded-full border-2 border-[#FD4100] bg-[#FFF4F0] px-5 text-[13px] font-semibold text-[#FD4100] transition-colors hover:bg-[#FD4100] hover:text-white md:flex"
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              დამატება
            </Link>

            {/* Language/Currency */}
            <button
              onClick={toggleCurrency}
              className="hidden h-10 items-center gap-2 rounded-full border border-gray-200 bg-white px-4 text-[13px] font-medium text-gray-700 transition-colors hover:bg-gray-50 md:flex"
            >
              <Globe className="h-4 w-4" />
              <span>ქართული, {currency === 'GEL' ? '₾' : '$'}</span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
            </button>

            {/* Login */}
            <Link
              href="/login"
              className="hidden h-10 items-center gap-2 rounded-full border border-gray-200 bg-white px-5 text-[13px] font-medium text-gray-700 transition-colors hover:bg-gray-50 md:flex"
            >
              <User className="h-4 w-4" />
              შესვლა
            </Link>

            {/* Settings */}
            <button className="hidden h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600 md:flex">
              <Settings className="h-[18px] w-[18px]" />
            </button>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 lg:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation links */}
      <nav className="hidden border-b border-gray-100 bg-white lg:block">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 lg:px-6">
          <div className="flex items-center">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className={`flex items-center gap-1 px-4 py-3.5 text-[13px] font-medium transition-colors ${
                  index === 0 ? 'text-gray-800' : 'text-gray-600'
                } hover:text-[#FD4100]`}
              >
                {link.label}
                {link.hasDropdown && (
                  <>
                    <span className="ml-0.5 h-1.5 w-1.5 rounded-full bg-[#FD4100]" />
                    <ChevronDown className="h-3 w-3 text-gray-400" />
                  </>
                )}
              </Link>
            ))}
          </div>
          <div className="flex items-center">
            {rightLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="px-4 py-3.5 text-[13px] font-medium text-gray-600 transition-colors hover:text-[#FD4100]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="absolute left-0 right-0 top-full border-b border-gray-200 bg-white px-4 pb-4 pt-2 shadow-lg lg:hidden">
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="ძებნა..."
              className="h-11 w-full rounded-full border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#FD4100] focus:outline-none"
            />
          </div>
          
          <div className="flex flex-col">
            {[...navLinks, ...rightLinks].map((link, index) => (
              <Link
                key={index}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="border-b border-gray-100 px-2 py-3 text-[13px] font-medium text-gray-700 last:border-0"
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Link
              href="/add-car"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 rounded-full border-2 border-[#FD4100] py-3 text-[13px] font-semibold text-[#FD4100]"
            >
              <Plus className="h-4 w-4" />
              დამატება
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 rounded-full bg-[#FD4100] py-3 text-[13px] font-semibold text-white"
            >
              <User className="h-4 w-4" />
              შესვლა
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
