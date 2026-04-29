"use client";
import { Heart, ArrowRight } from 'lucide-react';

interface CarProps {
  name: string;
  price: string;
  image: string;
}

export default function CarCard({ name, price, image }: CarProps) {
  return (
    <div className="group cursor-pointer">
      {/* სურათის კონტეინერი - მომრგვალებული და რბილი ჩრდილით */}
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm">
        <img 
          src={image} 
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <button className="absolute right-3 top-3 rounded-full bg-white/80 p-2 text-gray-900 backdrop-blur-sm transition-colors hover:bg-white hover:text-red-500">
          <Heart size={18} />
        </button>
      </div>

      {/* ინფორმაცია - მეტი სივრცე და დახვეწილი ფონტები */}
      <div className="mt-4 px-1">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Premium Listing</h3>
          <span className="text-lg font-bold text-gray-900">${Number(price).toLocaleString()}</span>
        </div>
        <h2 className="mt-1 text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
          {name}
        </h2>
        
        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
          <span className="text-sm text-gray-500 font-medium">ავტომატიკა • 2.5L</span>
          <div className="flex items-center gap-1 text-sm font-bold text-blue-600">
            დეტალები <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </div>
  );
}
