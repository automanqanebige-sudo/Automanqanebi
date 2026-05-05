"use client";

import { useState } from "react";
import { db } from "../../lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Sparkles, Upload, ArrowLeft, Loader2, Car, ChevronDown } from "lucide-react";
import Link from "next/link";
import { carBrands } from "@/data/cars";
import type { FuelType, TransmissionType, VehicleType } from "@/types/car";

const fuelTypes: { value: FuelType; label: string }[] = [
  { value: 'Gasoline', label: 'ბენზინი' },
  { value: 'Diesel', label: 'დიზელი' },
  { value: 'Hybrid', label: 'ჰიბრიდი' },
  { value: 'Electric', label: 'ელექტრო' },
  { value: 'LPG', label: 'გაზი' },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 35 }, (_, i) => currentYear - i);

export default function AddCarPage() {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [price, setPrice] = useState("");
  const [year, setYear] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [mileage, setMileage] = useState("");
  const [fuelType, setFuelType] = useState<FuelType | "">("");
  const [transmission, setTransmission] = useState<TransmissionType | "">("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicleType, setVehicleType] = useState<VehicleType>("car");
  const [loadingAI, setLoadingAI] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const selectedBrand = carBrands.find(b => b.brand === brand);
  const models = selectedBrand?.models || [];

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
    if (!brand || !model || !price) {
      alert("შეავსეთ სავალდებულო ველები");
      return;
    }
    
    setSubmitting(true);
    try {
      await addDoc(collection(db, "cars"), {
        brand,
        model,
        name: `${brand} ${model}`,
        price: Number(price),
        year: year ? Number(year) : null,
        image,
        description,
        mileage: mileage ? Number(mileage) : null,
        fuelType: fuelType || null,
        transmission: transmission || null,
        location: location || null,
        phone: phone || null,
        vehicleType,
        createdAt: new Date(),
        tier: 'standard',
        views: 0,
      });
      router.push("/");
    } catch (err) {
      console.error(err);
      alert("შეცდომა მოხდა, სცადეთ თავიდან");
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
              <h1 className="text-2xl font-bold text-foreground">განცხადების დამატება</h1>
              <p className="text-sm text-muted-foreground">შეავსეთ ინფორმაცია განცხადების გამოსაქვეყნებლად</p>
            </div>
          </div>
        </div>

        {/* Vehicle type tabs */}
        <div className="mb-6 flex gap-2">
          {[
            { value: 'car' as VehicleType, label: 'მანქანა' },
            { value: 'moto' as VehicleType, label: 'მოტო' },
            { value: 'atv' as VehicleType, label: 'ATV' },
          ].map(type => (
            <button
              key={type.value}
              type="button"
              onClick={() => setVehicleType(type.value)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                vehicleType === type.value 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-card border border-border text-card-foreground hover:bg-secondary'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Brand & Model */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <label className="mb-1.5 block text-sm font-medium text-foreground">მარკა *</label>
              <select
                value={brand}
                onChange={(e) => { setBrand(e.target.value); setModel(""); }}
                className="h-11 w-full appearance-none rounded-lg border border-input bg-card px-3 pr-9 text-sm text-card-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                required
              >
                <option value="">აირჩიე მარკა</option>
                {carBrands.map(b => (
                  <option key={b.brand} value={b.brand}>{b.brand}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-9 h-4 w-4 text-muted-foreground" />
            </div>
            <div className="relative">
              <label className="mb-1.5 block text-sm font-medium text-foreground">მოდელი *</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                disabled={!brand}
                className="h-11 w-full appearance-none rounded-lg border border-input bg-card px-3 pr-9 text-sm text-card-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="">აირჩიე მოდელი</option>
                {models.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-9 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {/* Price & Year */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">ფასი (₾) *</label>
              <input
                className="h-11 w-full rounded-lg border border-input bg-card px-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                type="number"
                placeholder="15000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <label className="mb-1.5 block text-sm font-medium text-foreground">წელი</label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="h-11 w-full appearance-none rounded-lg border border-input bg-card px-3 pr-9 text-sm text-card-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">აირჩიე წელი</option>
                {years.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-9 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {/* Mileage & Fuel type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">გარბენი (კმ)</label>
              <input
                className="h-11 w-full rounded-lg border border-input bg-card px-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                type="number"
                placeholder="50000"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
              />
            </div>
            <div className="relative">
              <label className="mb-1.5 block text-sm font-medium text-foreground">საწვავის ტიპი</label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value as FuelType | "")}
                className="h-11 w-full appearance-none rounded-lg border border-input bg-card px-3 pr-9 text-sm text-card-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">აირჩიე</option>
                {fuelTypes.map(f => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-9 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {/* Transmission & Location */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <label className="mb-1.5 block text-sm font-medium text-foreground">გადაცემათა კოლოფი</label>
              <select
                value={transmission}
                onChange={(e) => setTransmission(e.target.value as TransmissionType | "")}
                className="h-11 w-full appearance-none rounded-lg border border-input bg-card px-3 pr-9 text-sm text-card-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">აირჩიე</option>
                <option value="Automatic">ავტომატიკა</option>
                <option value="Manual">მექანიკა</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-9 h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">მდებარეობა</label>
              <input
                className="h-11 w-full rounded-lg border border-input bg-card px-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="თბილისი"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">ტელეფონი</label>
            <input
              className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm text-card-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="+995 5XX XXX XXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* Image URL */}
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
