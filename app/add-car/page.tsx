"use client";

import { useState } from "react";
import { db, auth } from "../../lib/firebase";
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

  // AI ტექსტის გენერაციის ფუნქცია
  const generateAIDescription = async () => {
    if (!brand || !model) {
      alert("გთხოვთ ჯერ მიუთითოთ მარკა და მოდელი");
      return;
    }
    
    setLoadingAI(true);
    try {
      const response = await fetch("/api/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand, model, year }),
      });
      const data = await response.json();
      setDescription(data.description);
    } catch (error) {
      console.error("AI Error:", error);
      alert("AI გენერაცია ვერ მოხერხდა");
    } finally {
      setLoadingAI(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) {
      alert("გთხოვთ გაიაროთ ავტორიზაცია");
      return;
    }

    try {
      await addDoc(collection(db, "cars"), {
        brand,
        model,
        price: Number(price),
        year: Number(year),
        image,
        description,
        userId: auth.currentUser.uid,
        createdAt: new Date(),
      });
      router.push("/");
    } catch (error) {
      console.error("Error adding car:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">მანქანის დამატება</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="მარკა (მაგ: BMW)"
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="მოდელი (მაგ: M5)"
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="ფასი ($)"
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="წელი"
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
          />
        </div>

        <input
          type="text"
          placeholder="ფოტოს ლინკი (URL)"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          required
        />

        <div className="relative">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">აღწერა</label>
            <button
              type="button"
              onClick={generateAIDescription}
              disabled={loadingAI}
              className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-full transition-all flex items-center gap-1 shadow-sm"
            >
              {loadingAI ? "✨ AI წერს..." : "✨ AI გენერაცია"}
            </button>
          </div>
          <textarea
            placeholder="დაწერეთ დეტალები..."
            className="w-full p-3 border rounded-lg h-32 focus:ring-2 focus:ring-blue-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors shadow-md"
        >
          განცხადების განთავსება
        </button>
      </form>
    </div>
  );
}
