"use client";

import { useState } from "react";
import { db, auth } from "../../lib/firebase"; // შეცვლილი იმპორტი
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function AddCarPage() {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [price, setPrice] = useState("");
  const [year, setYear] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const router = useRouter();

  const generateAIDescription = async () => {
    if (!brand || !model) return alert("მიუთითეთ მარკა და მოდელი");
    setLoadingAI(true);
    try {
      const res = await fetch("/api/generate-description", {
        method: "POST",
        body: JSON.stringify({ brand, model, year }),
      });
      const data = await res.json();
      setDescription(data.description);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "cars"), {
        brand, model, price: Number(price), year: Number(year), image, description,
        createdAt: new Date(),
      });
      router.push("/");
    } catch (err) { console.error(err); }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <h1 className="text-xl font-bold mb-4">მანქანის დამატება</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="w-full p-2 border rounded" placeholder="მარკა" onChange={e => setBrand(e.target.value)} />
        <input className="w-full p-2 border rounded" placeholder="მოდელი" onChange={e => setModel(e.target.value)} />
        <input className="w-full p-2 border rounded" type="number" placeholder="ფასი" onChange={e => setPrice(e.target.value)} />
        <input className="w-full p-2 border rounded" type="number" placeholder="წელი" onChange={e => setYear(e.target.value)} />
        <input className="w-full p-2 border rounded" placeholder="ფოტოს URL" onChange={e => setImage(e.target.value)} />
        
        <div className="flex flex-col gap-2">
          <button type="button" onClick={generateAIDescription} className="bg-purple-600 text-white p-2 rounded text-sm">
            {loadingAI ? "AI წერს..." : "✨ AI აღწერის გენერაცია"}
          </button>
          <textarea className="w-full p-2 border rounded h-32" placeholder="აღწერა" value={description} onChange={e => setDescription(e.target.value)} />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded font-bold">გამოქვეყნება</button>
      </form>
    </div>
  );
}
