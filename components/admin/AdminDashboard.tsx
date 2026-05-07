"use client"

import { useState } from "react"
import {
  LayoutDashboard,
  Car,
  Users,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Star,
} from "lucide-react"

export default function AdminDashboard() {
  const [cars] = useState([
    {
      id: 1,
      title: "Mercedes-Benz E350",
      price: "$18,500",
      vip: true,
    },
    {
      id: 2,
      title: "BMW X5",
      price: "$24,000",
      vip: false,
    },
    {
      id: 3,
      title: "Toyota Prius",
      price: "$9,800",
      vip: false,
    },
  ])

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-72 bg-black text-white p-6">
        <h1 className="text-2xl font-bold mb-10">
          AUTO ADMIN
        </h1>

        <nav className="space-y-4">
          <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" />
          <SidebarItem icon={<Car size={20} />} text="Cars" />
          <SidebarItem icon={<Users size={20} />} text="Users" />
          <SidebarItem icon={<Settings size={20} />} text="Settings" />
        </nav>

        <button className="flex items-center gap-2 mt-10 text-red-400 hover:text-red-500">
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8">
        {/* Top */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">
              Dashboard
            </h2>
            <p className="text-gray-500">
              მანქანების მართვის პანელი
            </p>
          </div>

          <button className="flex items-center gap-2 bg-black text-white px-5 py-3 rounded-xl hover:bg-gray-800 transition">
            <Plus size={20} />
            Add Car
          </button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <StatCard title="Cars" value="128" />
          <StatCard title="Users" value="54" />
          <StatCard title="VIP Ads" value="12" />
        </div>

        {/* Cars Table */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-xl font-bold mb-6">
            მანქანების სია
          </h3>

          <div className="space-y-4">
            {cars.map((car) => (
              <div
                key={car.id}
                className="flex items-center justify-between border rounded-xl p-4"
              >
                <div>
                  <h4 className="font-semibold text-lg">
                    {car.title}
                  </h4>

                  <p className="text-gray-500">
                    {car.price}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {car.vip && (
                    <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                      <Star size={14} />
                      VIP
                    </span>
                  )}

                  <button className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

function SidebarItem({
  icon,
  text,
}: {
  icon: React.ReactNode
  text: string
}) {
  return (
    <button className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-white/10 transition">
      {icon}
      <span>{text}</span>
    </button>
  )
}

function StatCard({
  title,
  value,
}: {
  title: string
  value: string
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow">
      <p className="text-gray-500 mb-2">{title}</p>

      <h3 className="text-3xl font-bold">
        {value}
      </h3>
    </div>
  )
}
