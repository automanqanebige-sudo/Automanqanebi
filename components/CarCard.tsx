import { Heart, Eye } from 'lucide-react';

export default function CarCard({ name, price, image }: { name: string, price: string, image: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
      <div className="relative h-48 w-full bg-gray-200">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800">{name}</h3>
        <p className="text-green-600 font-semibold text-xl mb-4">${price}</p>
        <div className="flex gap-2">
          <button className="flex-1 bg-orange-400 text-white py-2 rounded-xl flex items-center justify-center gap-2">
            <Heart size={18} /> ფავორიტი
          </button>
          <button className="bg-blue-600 text-white p-2 rounded-xl">
            <Eye size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
