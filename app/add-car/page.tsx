"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { db } from "../../lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Sparkles, Upload, ArrowLeft, Loader2, Car, ChevronDown } from "lucide-react";
import Link from "next/link";
import { carBrands } from "@/data/cars";
import type { FuelType, TransmissionType, VehicleType } from "@/types/car";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 35 }, (_, i) => currentYear - i);

export default function AddCarPage() {
  const t = useTranslations();
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

  const fuelTypes: { value: FuelType; label: string }[] = [
    { value: 'Gasoline', label: t('filters.petrol') },
    { value: 'Diesel', label: t('filters.diesel') },
    { value: 'Hybrid', label: t('filters.hybrid') },
    { value: 'Electric', label: t('filters.electric') },
    { value: 'LPG', label: t('filters.lpg') },
  ];

  const vehicleTypes = [
    { value: 'car' as VehicleType, label: t('addCar.vehicleTypes.car') },
    { value: 'moto' as VehicleType, label: t('addCar.vehicleTypes.moto') },
    { value: 'atv' as VehicleType, label: t('addCar.vehicleTypes.atv') },
  ];

  const selectedBrand = carBrands.find(b => b.brand === brand);
  const models = selectedBrand?.models || [];

  const generateAIDescription = async () => {
    if (!brand || !model) return alert(t('addCar.selectBrandModel'));
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
      alert(t('addCar.requiredFields'));
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
      alert(t('addCar.errorOccurred'));
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
          {t('addCar.backToHome')}
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Car className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{t('addCar.title')}</h1>
              <p className="text-sm text-muted-foreground">{t('addCar.subtitle')}</p>
            </div>
          </div>
        </div>

        {/* Vehicle type tabs */}
        <div className="mb-6 flex gap-2">
          {vehicleTypes.map(type => (
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
              <label className="mb-1.5 block text-sm font-medium text-foreground">{t('filters.brand')} *</label>
              <select
                value={brand}
                onChange={(e) => { setBrand(e.target.value); setModel(""); }}
                className="h-11 w-full appearance-none rounded-lg border border-input bg-card px-3 pr-9 text-sm text-card-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                required
              >
                <option value="">{t('filters.selectBrand')}</option>
                {carBrands.map(b => (
                  <option key={b.brand} value={b.brand}>{b.brand}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-9 h-4 w-4 text-muted-foreground" />
            </div>
            <div className="relative">
              <label className="mb-1.5 block text-sm font-medium text-foreground">{t('filters.model')} *</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                disabled={!brand}
                className="h-11 w-full appearance-none rounded-lg border border-input bg-card px-3 pr-9 text-sm text-card-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="">{t('filters.selectModel')}</option>
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
              <label className="mb-1.5 block text-sm font-medium text-foreground">{t('filters.price')} (₾) *</label>
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
              <label className="mb-1.5 block text-sm font-medium text-foreground">{t('filters.year')}</label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="h-11 w-full appearance-none rounded-lg border border-input bg-card px-3 pr-9 text-sm text-card-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">{t('filters.selectYear')}</option>
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
              <label className="mb-1.5 block text-sm font-medium text-foreground">{t('car.mileage')} ({t('common.km')})</label>
              <input
                className="h-11 w-full rounded-lg border border-input bg-card px-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                type="number"
                placeholder="50000"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
              />
            </div>
            <div className="relative">
              <label className="mb-1.5 block text-sm font-medium text-foreground">{t('filters.fuel')}</label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value as FuelType | "")}
                className="h-11 w-full appearance-none rounded-lg border border-input bg-card px-3 pr-9 text-sm text-card-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">{t('filters.select')}</option>
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
              <label className="mb-1.5 block text-sm font-medium text-foreground">{t('filters.transmission')}</label>
              <select
                value={transmission}
                onChange={(e) => setTransmission(e.target.value as TransmissionType | "")}
                className="h-11 w-full appearance-none rounded-lg border border-input bg-card px-3 pr-9 text-sm text-card-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">{t('filters.select')}</option>
                <option value="Automatic">{t('filters.automatic')}</option>
                <option value="Manual">{t('filters.manual')}</option>
                <option value="Tiptronic">{t('filters.tiptronic')}</option>
                <option value="Variator">{t('filters.variator')}</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-9 h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">{t('filters.location')}</label>
              <input
                className="h-11 w-full rounded-lg border border-input bg-card px-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                type="text"
                placeholder={t('filters.tbilisi')}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">{t('addCar.phone')}</label>
            <input
              className="h-11 w-full rounded-lg border border-input bg-card px-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              type="tel"
              placeholder={t('addCar.phonePlaceholder')}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">{t('addCar.photoUrl')}</label>
            <div className="flex gap-2">
              <input
                className="h-11 flex-1 rounded-lg border border-input bg-card px-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                type="url"
                placeholder={t('addCar.photoUrlPlaceholder')}
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
              <button
                type="button"
                className="flex h-11 items-center gap-2 rounded-lg border border-dashed border-input bg-card px-4 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
              >
                <Upload className="h-4 w-4" />
                {t('addCar.browse')}
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">{t('car.description')}</label>
              <button
                type="button"
                onClick={generateAIDescription}
                disabled={loadingAI}
                className="flex items-center gap-1.5 rounded-md bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20 disabled:opacity-50"
              >
                {loadingAI ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5" />
                )}
                {loadingAI ? t('addCar.generating') : t('addCar.generateDescription')}
              </button>
            </div>
            <textarea
              className="min-h-[100px] w-full resize-none rounded-lg border border-input bg-card px-3 py-2.5 text-sm text-card-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder={t('addCar.descriptionPlaceholder')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="h-12 w-full rounded-lg bg-primary font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {t('addCar.publishing')}
              </span>
            ) : (
              t('addCar.publish')
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
