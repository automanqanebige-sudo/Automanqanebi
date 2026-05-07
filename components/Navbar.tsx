'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Search, Plus, User, Menu, X, Heart, Bell, LogOut } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export default function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    setProfileOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0f172a]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 lg:h-20 lg:px-6">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <Image
            src="/logo.jpg"
            alt="Automanqanebi.ge"
            width={48}
            height={48}
            className="h-10 w-10 rounded-lg object-cover lg:h-12 lg:w-12"
            priority
          />
          <div className="hidden sm:block">
            <span className="text-lg font-bold tracking-tight text-white lg:text-xl">
              AUTOMANQANEBI
            </span>
            <span className="text-lg font-bold text-orange-500 lg:text-xl">.GE</span>
          </div>
        </Link>

        {/* Search bar - center */}
        <div className="hidden flex-1 justify-center md:flex">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="მოძებნე მარკა, მოდელი ან ID..."
              className="h-12 w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 text-sm text-white placeholder:text-slate-500 transition-all focus:border-orange-500/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2 lg:gap-3">
          {/* Favorites */}
          <Link
            href="/favorites"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-400 transition-all hover:bg-white/10 hover:text-white lg:h-11 lg:w-11"
          >
            <Heart className="h-5 w-5" />
          </Link>

          {/* Notifications */}
          <button className="relative hidden h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-400 transition-all hover:bg-white/10 hover:text-white sm:flex lg:h-11 lg:w-11">
            <Bell className="h-5 w-5" />
          </button>

          {/* Profile / Login */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="hidden h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white/5 transition-all hover:bg-white/10 sm:flex lg:h-11 lg:w-11"
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-orange-500 text-sm font-bold text-white">
                    {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </div>
                )}
              </button>

              {/* Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 top-14 w-56 rounded-xl border border-white/10 bg-slate-800 p-2 shadow-2xl">
                  <div className="border-b border-white/10 px-3 py-2">
                    <p className="text-sm font-medium text-white">{user.displayName || 'მომხმარებელი'}</p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                  <div className="mt-2 space-y-1">
                    <Link
                      href="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white"
                    >
                      <User className="h-4 w-4" />
                      ჩემი პროფილი
                    </Link>
                    <Link
                      href="/favorites"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white"
                    >
                      <Heart className="h-4 w-4" />
                      ფავორიტები
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
                    >
                      <LogOut className="h-4 w-4" />
                      გასვლა
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-400 transition-all hover:bg-white/10 hover:text-white sm:flex lg:h-11 lg:w-11"
            >
              <User className="h-5 w-5" />
            </Link>
          )}

          {/* Add car CTA */}
          <Link
            href="/add-car"
            className="hidden items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:from-orange-600 hover:to-orange-700 hover:shadow-orange-500/40 sm:flex lg:px-6 lg:py-3"
          >
            <Plus className="h-4 w-4" />
            <span>დამატება</span>
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-400 transition-all hover:bg-white/10 hover:text-white md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#0f172a] md:hidden">
          {/* Mobile search */}
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="მოძებნე მარკა, მოდელი..."
                className="h-12 w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-orange-500/50 focus:outline-none"
              />
            </div>
          </div>

          {/* Mobile nav links */}
          <div className="space-y-1 px-4 pb-4">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                pathname === '/' ? 'bg-orange-500/10 text-orange-500' : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              მანქანები
            </Link>
            <Link
              href="/services"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 hover:bg-white/5"
            >
              სერვისები
            </Link>
            <Link
              href="/blog"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 hover:bg-white/5"
            >
              ბლოგი
            </Link>
          </div>

          {/* Mobile actions */}
          <div className="border-t border-white/10 p-4">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="" className="h-10 w-10 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
                      {user.displayName?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-white">{user.displayName || 'მომხმარებელი'}</p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/add-car"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 py-3 text-sm font-semibold text-white"
                  >
                    <Plus className="h-4 w-4" />
                    დამატება
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setMobileOpen(false); }}
                    className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-white"
                  >
                    <LogOut className="h-4 w-4" />
                    გასვლა
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/add-car"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 py-3 text-sm font-semibold text-white"
                >
                  <Plus className="h-4 w-4" />
                  დამატება
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-white"
                >
                  <User className="h-4 w-4" />
                  შესვლა
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
