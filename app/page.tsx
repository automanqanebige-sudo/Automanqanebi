import CarCard from '../components/CarCard';
import { Search, SlidersHorizontal, CarFront } from 'lucide-react';

const carData = [
  { id: 1, name: "Porsche 911 Carrera", price: "125000", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1000" },
  { id: 2, name: "Audi RS6 Avant", price: "110000", image: "https://images.unsplash.com/photo-1606148632349-543303a39e30?q=80&w=1000" },
  { id: 3, name: "Mercedes S-Class", price: "95000", image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1000" },
  { id: 4, name: "BMW M4 Competition", price: "88000", image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1000" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      {/* Minimalist Navigation Placeholder */}
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <CarFront size={24} />
            </div>
            <span className="text-xl font-black text-gray-900 tracking-tighter">AUTO.GE</span>
          </div>
          <button className="bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-800 transition-all">
            განცხადების დამატება
          </button>
        </div>
      </nav>

      {/* Hero Section - ტექსტი და ძებნა */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
            იპოვე შენი <span className="text-blue-600 font-outline-2">ოცნების</span> მანქანა
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            ყველაზე დიდი ავტო-ბაზარი საქართველოში. მხოლოდ შემოწმებული განცხადებები და საუკეთესო ფასები.
          </p>
        </div>

        {/* Search Bar - სერიოზული და სუფთა */}
        <div className="max-w-4xl mx-auto bg-white p-3 rounded-[2rem] shadow-2xl shadow-blue-100 flex flex-col md:flex-row items-center gap-2">
          <div className="flex-1 flex items-center gap-3 px-4 w-full">
            <Search className="text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="მარკა, მოდელი, წელი..." 
              className="w-full py-4 outline-none text-gray-800 font-medium"
            />
          </div>
          <div className="h-10 w-[1px] bg-gray-100 hidden md:block"></div>
          <button className="flex items-center gap-2 px-6 text-gray-600 font-semibold hover:text-blue-600 transition-all w-full md:w-auto py-4">
            <SlidersHorizontal size={18} />
            ფილტრი
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-bold transition-all w-full md:w-auto shadow-lg shadow-blue-200">
            ძებნა
          </button>
        </div>
      </section>

      {/* Grid სექცია */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-bold text-gray-900">ახალი დამატებული</h2>
          <div className="flex gap-2">
            {['ყველა', 'სედანი', 'ჯიპი', 'კუპე'].map((cat) => (
              <button key={cat} className="px-4 py-2 rounded-full text-sm font-medium bg-white border hover:border-blue-600 hover:text-blue-600 transition-all">
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {carData.map((car) => (
            <CarCard key={car.id} {...car} />
          ))}
        </div>
      </section>
    </main>
  );
}
// update design
