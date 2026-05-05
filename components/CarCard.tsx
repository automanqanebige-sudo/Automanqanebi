'use client'

type Car = {
  id?: string
  name?: string
  price?: number
  image?: string
}

export default function CarCard({ car }: { car?: Car }) {
  if (!car) return null

  return (
    <div className="bg-[#111] text-white rounded-2xl overflow-hidden shadow-lg hover:scale-[1.02] transition">

      {car.image && (
        <img
          src={car.image}
          alt="car"
          className="w-full h-48 object-cover"
        />
      )}

      <div className="p-4">
        <h2 className="text-lg font-bold">
          {car?.name || "უცნობი მანქანა"}
        </h2>

        <p className="text-gray-400 mt-1">
          {car?.price ? car.price.toLocaleString() + " $" : "ფასი არ არის"}
        </p>

        <button className="mt-3 w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg transition">
          ნახვა
        </button>
      </div>
    </div>
  )
}