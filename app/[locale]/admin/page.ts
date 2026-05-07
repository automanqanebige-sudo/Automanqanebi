"use client";

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Car, 
  Users, 
  Settings, 
  BarChart3, 
  PlusCircle, 
  Search, 
  Bell,
  LogOut,
  ChevronRight
} from 'lucide-react';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const stats = [
    { label: 'სულ მანქანები', value: '1,284', icon: Car, color: 'bg-blue-500' },
    { label: 'აქტიური მომხმარებელი', value: '8,432', icon: Users, color: 'bg-green-500' },
    { label: 'თვიური გაყიდვები', value: '42', icon: BarChart3, color: 'bg-purple-500' },
  ];

  const recentCars = [
    { id: 1, model: 'BMW M4', price: '$54,000', status: 'აქტიური', date: '2 წუთის წინ' },
    { id: 2, model: 'Mercedes-Benz G63', price: '$120,000', status: 'მოდერაციაზე', date: '15 წუთის წინ' },
    { id: 3, model: 'Porsche 911', price: '$98,000', status: 'გაყიდული', date: '1 საათის წინ' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:block">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-600">BASS44 Admin</h1>
        </div>
        <nav className="mt-4 px-4 space-y-2">
          <SidebarItem 
            icon={<LayoutDashboard size={20} />} 
            label="დესბორდი" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <SidebarItem 
            icon={<Car size={20} />} 
            label="მანქანების მართვა" 
            active={activeTab === 'cars'} 
            onClick={() => setActiveTab('cars')} 
          />
          <SidebarItem 
            icon={<Users size={20} />} 
            label="მომხმარებლები" 
            active={activeTab === 'users'} 
            onClick={() => setActiveTab('users')} 
          />
          <SidebarItem 
            icon={<Settings size={20} />} 
            label="პარამეტრები" 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')} 
          />
        </nav>
        <div className="absolute bottom-8 w-64 px-4">
          <button className="flex items-center gap-3 text-red-500 hover:bg-red-50 w-full p-3 rounded-lg transition">
            <LogOut size={20} />
            <span className="font-medium">გასვლა</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 h-16 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-8">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="ძებნა..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              A
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold dark:text-white text-gray-800">სისტემის მიმოხილვა</h2>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition shadow-lg">
              <PlusCircle size={20} />
              ახალი მანქანის დამატება
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <div className={`${stat.color} p-3 rounded-lg text-white`}>
                    <stat.icon size={24} />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold dark:text-white">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h3 className="font-bold text-gray-800 dark:text-white">ბოლო დამატებული მანქანები</h3>
              <button className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
                ყველას ნახვა <ChevronRight size={16} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-400 text-sm uppercase">
                    <th className="px-6 py-4 font-medium">მოდელი</th>
                    <th className="px-6 py-4 font-medium">ფასი</th>
                    <th className="px-6 py-4 font-medium">სტატუსი</th>
                    <th className="px-6 py-4 font-medium">დრო</th>
                    <th className="px-6 py-4 font-medium">მართვა</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {recentCars.map((car) => (
                    <tr key={car.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                      <td className="px-6 py-4 font-medium dark:text-white">{car.model}</td>
                      <td className="px-6 py-4 dark:text-gray-300">{car.price}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                          car.status === 'აქტიური' ? 'bg-green-100 text-green-700' : 
                          car.status === 'მოდერაციაზე' ? 'bg-yellow-100 text-yellow-700' : 
                          'bg-red-100 text-red-700'
                        }`}>
                          {car.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-sm">{car.date}</td>
                      <td className="px-6 py-4">
                        <button className="text-gray-400 hover:text-blue-600 transition">რედაქტირება</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 w-full p-3 rounded-lg transition-all ${
        active 
        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 shadow-sm' 
        : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
      {active && <div className="ml-auto w-1.5 h-1.5 bg-blue-600 rounded-full"></div>}
    </button>
  );
}
