"use client";
import { useState } from 'react';
import { CarFront, Menu, X, User, Heart, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { useCurrency } from '../context/CurrencyContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { currency, toggleCurrency } = useCurrency();

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-[100]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-blue-600 p-2 rounded-xl text-white group-hover:rotate-12 transition-transform">
              <CarFront size={24} />
            </div>
            <span className="text-2xl font-black text-gray-900 tracking-tighter">AUTO.GE</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">
              მთავარი
            </Link>
            
            <Link href="/favorites" className="text-sm font-semibold text-gray-600 hover:text-blue-600 flex items-center gap-1">
              <Heart size={16} /> ფავორიტები
            </Link>

            {/* ვალუტის გადამრთველი ღილაკი */}
            <button 
              onClick={toggleCurrency}
              className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 text-blue-600 border border-gray-200"
            >
              ვალუტა: {currency === 'USD' ? '$ (USD)' : '₾ (GEL)'}
            </button>

            <Link href="/add-car" className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
              <PlusCircle size={18} /> განცხადება
            </Link>
            
            <Link href="/profile" className="text-gray-900 hover:bg-gray-100 p-2 rounded-full transition-all border border-gray-100">
              <User size={22} />
            </Link>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center gap-4">
            <button 
              onClick={toggleCurrency}
              className="bg-gray-100 px-3 py-1 rounded-lg font-bold text-sm"
            >
              {currency === 'USD' ? '$' : '₾'}
            </button>
            <button className="text-gray-900" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b shadow-2xl p-6 flex flex-col gap-4 animate-in slide-in-from-top duration-300">
          <Link href="/" onClick={() => setIsOpen(false)} className="text-lg font-bold text-gray-800 p-2 hover:bg-gray-50 rounded-lg">მთავარი</Link>
          <Link href="/favorites" onClick={() => setIsOpen(false)} className="text-lg font-bold text-gray-800 flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg">
            <Heart size={20} className="text-red-500" /> ფავორიტები
          </Link>
          <Link href="/profile" onClick={() => setIsOpen(false)} className="text-lg font-bold text-gray-800 flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg">
            <User size={20} className="text-blue-600" /> პროფილი
          </Link>
          <Link href="/add-car" onClick={() => setIsOpen(false)} className="bg-blue-600 text-white p-4 rounded-2xl text-center font-bold shadow-lg shadow-blue-200">
            განცხადების დამატება
          </Link>
        </div>
      )}
    </nav>
  );
}
