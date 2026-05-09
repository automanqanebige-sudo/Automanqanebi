"use client";

import { useEffect, useState } from "react";
import { getDb } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore/lite";

export default function AdminPage() {
  const [cars, setCars] = useState<any[]>([]);

  useEffect(() => {
    const fetchCars = async () => {
      const querySnapshot = await getDocs(collection(getDb(), "cars"));
      setCars(
        querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() })),
      );
    };
    fetchCars();
  }, []);

  const deleteCar = async (id: string) => {
    await deleteDoc(doc(getDb(), "cars", id));
    setCars(cars.filter(car => car.id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">ადმინ პანელი</h1>
      {cars.map(car => (
        <div key={car.id} className="flex justify-between border-b p-2">
          <span>{car.brand} {car.model}</span>
          <button onClick={() => deleteCar(car.id)} className="text-red-500">წაშლა</button>
        </div>
      ))}
    </div>
  );
}
