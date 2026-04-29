"use client"; // აუცილებელია ინტერაქტიული ელემენტებისთვის

import { Heart, Eye } from 'lucide-react';
import Image from 'next/image';

interface CarProps {
  name: string;
  price: string;
  image: string;
}

export default function CarCard({ name, price, image }: CarProps) {
  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col">
      
      {/* სურათის სექცია */}
      <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
        <img 
          src={image || "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1000"} 
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* პატარა "New" ბეიჯი ეფექტისთვის */}
        <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
          ახალი
        </div>
      </div>

      {/* ინფორმაციის სექცია */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-800 line-clamp-1">{name}</h3>
        </div>
        
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-2xl font-black text-green-600">${Number(price).toLocaleString()}</span>
          <span className="text-gray-400 text-sm">/ სულ</span>
        </div>

        {/* ღილაკები */}
        <div className="flex gap-2 mt-auto">
          <button className="flex-[3] bg-orange-400 hover:bg-orange-500 text-white font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors active:scale-95">
            <Heart size={18} className="group-hover:fill-white transition-all" />
            <span>ფავორიტი</span>
          </button>
          
          <button className="flex-[1] bg-gray-100 hover:bg-blue-600 hover:text-white text-gray-600 py-2.5 rounded-xl flex items-center justify-center transition-all active:scale-95">
            <Eye size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
