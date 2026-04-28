"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const cars = [
  {
    id: 1,
    name: "BMW X5",
    price: 15000,
  },
  {
    id: 2,
    name: "Mercedes E-Class",
    price: 13000,
  },
  {
    id: 3,
    name: "Toyota Camry",
    price: 10000,
  },
];

export default function FavoritesPage() {
  const [favorites, setFavorites] =
    useState<number[]>([]);

  useEffect(() => {
    const saved =
      localStorage.getItem("favorites");

    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  const favoriteCars = cars.filter((car) =>
    favorites.includes(car.id)
  );

  return (
    <div
      style={{
        background: "#111",
        minHeight: "100vh",
        color: "white",
        padding: 20,
      }}
    >
      <h1>❤️ ფავორიტები</h1>

      <Link href="/">
        <button
          style={{
            padding: 12,
            borderRadius: 12,
            border: "none",
            marginBottom: 20,
          }}
        >
          ⬅ უკან
        </button>
      </Link>

      {favoriteCars.length === 0 ? (
        <p>ფავორიტები ცარიელია</p>
      ) : (
        favoriteCars.map((car) => (
          <div
            key={car.id}
            style={{
              background: "#1e1e1e",
              padding: 20,
              borderRadius: 16,
              marginBottom: 15,
            }}
          >
            <h2>{car.name}</h2>
            <p>${car.price}</p>
          </div>
        ))
      )}
    </div>
  );
}