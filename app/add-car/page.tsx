"use client";

import { useState } from "react";
import { getDb } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore/lite";
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
      await addDoc(collection(getDb(), "cars"), {
        brand, model, price: Number(price), year: Number(year), image, description,
        createdAt: new Date(),
      });
      router.push("/");
    } catch (err) { console.error(err); }
  };

  return (
    <div className="mx-auto mt-10 max-w-xl rounded-xl border border-border bg-card p-6 shadow-sm">
      <h1 className="mb-4 text-xl font-bold text-foreground">მანქანის დამატება</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground outline-none ring-primary/20 focus:ring-2" placeholder="მარკა" onChange={e => setBrand(e.target.value)} />
        <input className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground outline-none ring-primary/20 focus:ring-2" placeholder="მოდელი" onChange={e => setModel(e.target.value)} />
        <input className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground outline-none ring-primary/20 focus:ring-2" type="number" placeholder="ფასი" onChange={e => setPrice(e.target.value)} />
        <input className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground outline-none ring-primary/20 focus:ring-2" type="number" placeholder="წელი" onChange={e => setYear(e.target.value)} />
        <input className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground outline-none ring-primary/20 focus:ring-2" placeholder="ფოტოს URL" onChange={e => setImage(e.target.value)} />
        
        <div className="flex flex-col gap-2">
          <button type="button" onClick={generateAIDescription} className="rounded-lg border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/15">
            {loadingAI ? "AI წერს..." : "✨ AI აღწერის გენერაცია"}
          </button>
          <textarea className="h-32 w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground outline-none ring-primary/20 focus:ring-2" placeholder="აღწერა" value={description} onChange={e => setDescription(e.target.value)} />
        </div>

        <button type="submit" className="w-full rounded-lg bg-primary py-3 font-bold text-primary-foreground transition-colors hover:bg-primary/90">გამოქვეყნება</button>
      </form>
    </div>
  );
}
