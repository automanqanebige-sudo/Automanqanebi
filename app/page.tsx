// app/page.tsx
import CarCard from '@/components/CarCard';

const cars = [
  { id: 1, name: "BMW M5", price: "25000", image: "/bmw.jpg" }, // სურათები ჩააგდე public ფოლდერში
  { id: 2, name: "Mercedes S-Class", price: "32000", image: "/merc.jpg" },
  { id: 3, name: "Toyota Camry", price: "14000", image: "/toyota.jpg" },
  { id: 4, name: "Range Rover", price: "45000", image: "/rr.jpg" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Hero სექცია (ის მწვანე ბანერი რაც გაქვს) */}
      <div className="bg-green-600 p-8 rounded-b-[40px] text-white text-center mb-6">
        <h1 className="text-3xl font-bold mb-2">AUTOMANQANEBI</h1>
        <p className="opacity-90">იყიდე, გაყიდე, იქირავე — მარტივად</p>
        <button className="mt-4 bg-white text-green-600 px-6 py-2 rounded-full font-bold flex items-center gap-2 mx-auto">
          + დამატება
        </button>
      </div>

      {/* ძებნის ველი */}
      <div className="px-4 mb-8">
        <div className="relative max-w-md mx-auto">
          <input 
            type="text" 
            placeholder="მოძებნე მანქანა..." 
            className="w-full p-4 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-green-500 outline-none"
          />
          <button className="absolute right-2 top-2 bg-green-500 text-white px-4 py-2 rounded-xl">
            ძებნა
          </button>
        </div>
      </div>

      {/* მანქანების Grid */}
      <div className="px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {cars.map((car) => (
          <CarCard 
            key={car.id}
            name={car.name}
            price={car.price}
            image={car.image}
          />
        ))}
      </div>
    </main>
  );
}
