"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import Navbar from "@/components/Navbar";
import { Trash2 } from "lucide-react";

export default function AdminPage() {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "cars"));
        setCars(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  const deleteCar = async (id: string) => {
    if (!confirm("ნამდვილად გსურთ წაშლა?")) return;
    try {
      await deleteDoc(doc(db, "cars", id));
      setCars(cars.filter(car => car.id !== id));
    } catch (error) {
      console.error("Error deleting car:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-white">ადმინ პანელი</h1>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-orange-500" />
          </div>
        ) : cars.length === 0 ? (
          <p className="text-center text-slate-400">მანქანები არ მოიძებნა</p>
        ) : (
          <div className="space-y-2">
            {cars.map(car => (
              <div 
                key={car.id} 
                className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-800/50 p-4"
              >
                <span className="font-medium text-white">{car.brand} {car.model}</span>
                <button 
                  onClick={() => deleteCar(car.id)} 
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10 text-red-400 transition-colors hover:bg-red-500/20"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
