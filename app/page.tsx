import CarCard from '../components/CarCard';
import { Search, Plus, MapPin } from 'lucide-react';

// დროებითი მონაცემები (შემდეგ ამას ბაზიდან წამოვიღებთ)
const carData = [
  { id: 1, name: "BMW M5 CS", price: "125000", image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1000" },
  { id: 2, name: "Mercedes G63 AMG", price: "185000", image: "https://images.unsplash.com/photo-1520031441872-265e4ff70366?q=80&w=1000" },
  { id: 3, name: "Porsche 911 Turbo", price: "210000", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1000" },
  { id: 4, name: "Range Rover Sport", price: "95000", image: "https://images.unsplash.com/photo-1506469717960-433ce8b6699e?q=80&w=1000" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      
      {/* ზედა მწვანე ბლოკი (Header Section) */}
      <div className="bg-green-600 pt-12 pb-20 px-6 rounded-b-[40px] shadow-lg relative">
        <div className="max-w-5xl mx-auto flex justify-between items-start">
          <div>
            <h1 className="text-white text-3xl font-black tracking-tighter">AUTOMANQANEBI</h1>
            <p className="text-green-100 opacity-80 text-sm">საუკეთესო ავტო-პლატფორმა საქართველოში</p>
          </div>
          <button className="bg-white/20 hover:bg-white/30 backdrop-blur-md p-2 rounded-full text-white transition-all">
             <Plus size={24} />
          </button>
        </div>
      </div>

      {/* ძებნის პანელი (Floating Search) */}
      <div className="px-6 -mt-10 max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-2 flex items-center gap-2 border border-gray-100">
          <div className="pl-3 text-gray-400">
            <Search size={20} />
          </div>
          <input 
            type="text" 
            placeholder="მოძებნე მარკა, მოდელი..." 
            className="flex-1 py-3 bg-transparent outline-none text-gray-700 font-medium"
          />
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md">
            ძებნა
          </button>
        </div>
      </div>

      {/* მანქანების სია (Grid) */}
      <div className="max-w-7xl mx-auto px-6 mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <MapPin size={20} className="text-green-600" />
            თბილისი, საქართველო
          </h2>
          <span className="text-sm font-medium text-blue-600 hover:underline cursor-pointer">ყველას ნახვა</span>
        </div>

        {/* აქ იხატება ჩვენი Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {carData.map((car) => (
            <CarCard 
              key={car.id}
              name={car.name}
              price={car.price}
              image={car.image}
            />
          ))}
        </div>
      </div>

    </main>
  );
}
