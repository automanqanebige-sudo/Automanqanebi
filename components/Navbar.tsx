'use client'

import Link from 'next/link'

export default function Navbar() {
  return (
    <div className="bg-black text-white px-6 py-4 flex justify-between items-center">
      
      <h1 className="text-xl font-bold">AutoMarket</h1>

      <div className="flex gap-4">
        <Link href="/">მთავარი</Link>
        <Link href="/favorites">ფავორიტები</Link>
        <Link href="/add-car">დამატება</Link>
      </div>
    </div>
  )
}