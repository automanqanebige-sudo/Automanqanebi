"use client";

import { useState } from "react";
import { db } from "../../lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Sparkles, Upload, ArrowLeft, Loader2, Car } from "lucide-react";
import Link from "next/link";

export default function AddCarPage() {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [price, setPrice] = useState("");
  const [year, setYear] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [submitting, setSubmitting] = useState(false);
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
    setSubmitting(true);
    try {
      await addDoc(collection(db, "cars"), {
        brand,
        model,
        name: `${brand} ${model}`,
        price: Number(price),
        year: Number(year),
        image,
        description,
        createdAt: new Date(),
      });
      router.push("/");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-2xl px-4 py-10 lg:px-8">
        {/* Back link */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          მთავარზე დაბრუნება
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Car className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">მანქანის დამატება</h1>
              <p className="text-sm text-muted-foreground">შეავსეთ ინფორმაცია განცხადების გამოსაქვეყნებლად</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">მარკა</label>
              <input
                className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm text-card-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="მაგ. Toyota"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">მოდელი</label>
              <input
                className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm text-card-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="მაგ. Camry"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">ფასი ($)</label>
              <input
                className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm text-card-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                type="number"
                placeholder="15000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">წელი</label>
              <input
                className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm text-card-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                type="number"
                placeholder="2020"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">ფოტოს URL</label>
            <div className="flex items-center gap-2">
              <input
                className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm text-card-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="https://example.com/photo.jpg"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-dashed border-input text-muted-foreground">
                <Upload className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* AI Description */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">აღწერა</label>
              <button
                type="button"
                onClick={generateAIDescription}
                disabled={loadingAI}
                className="flex items-center gap-1.5 rounded-md bg-primary/10 px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/20 disabled:opacity-50"
              >
                {loadingAI ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5" />
                )}
                {loadingAI ? "გენერირდება..." : "AI აღწერა"}
              </button>
            </div>
            <textarea
              className="h-32 w-full resize-none rounded-lg border border-input bg-card px-3 py-2.5 text-sm text-card-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="ავტომობილის აღწერა..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                გამოქვეყნება...
              </>
            ) : (
              "გამოქვეყნება"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
