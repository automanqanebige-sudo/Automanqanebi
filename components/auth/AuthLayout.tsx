'use client'

import Link from 'next/link'

export const AUTH_INPUT_CLASS =
  'w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-gray-900 outline-none transition-shadow focus:ring-2 focus:ring-green-500/30 focus:border-green-500'

interface Props {
  title: string
  subtitle: string
  children: React.ReactNode
}

export default function AuthLayout({ title, subtitle, children }: Props) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-10">
        <Link href="/" className="text-green-600 hover:text-green-700 text-sm">
          ← მთავარი
        </Link>

        <h1 className="text-4xl font-bold mt-6">{title}</h1>

        <p className="text-gray-500 mt-2 mb-8">{subtitle}</p>

        {children}
      </div>
    </div>
  )
}
