"use client";

import { useEffect, useState } from "react";
import { db } from "../../lib/firebase"; // შეცვლილი იმპორტი
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

export default function AdminPage() {
  const [cars, setCars] = useState<any[]>([]);

  useEffect(() => {
    const fetchCars = async () => {
      const querySnapshot = await getDocs(collection(db, "cars"));
      setCars(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchCars();
  }, []);

  const deleteCar = async (id: string) => {
    await deleteDoc(doc(db, "cars", id));
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
