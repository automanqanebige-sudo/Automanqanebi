"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const cars = [
  {
    id: 1,
    name: "BMW X5",
    price: 15000,
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e",
  },
  {
    id: 2,
    name: "Mercedes E-Class",
    price: 13000,
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
  },
  {
    id: 3,
    name: "Toyota Camry",
    price: 10000,
    image:
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341",
  },
];

export default function Home() {
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("favorites");

    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  const toggleFavorite = (id: number) => {
    let updated: number[] = [];

    if (favorites.includes(id)) {
      updated = favorites.filter((f) => f !== id);
    } else {
      updated = [...favorites, id];
    }

    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const filteredCars = cars.filter((car) =>
    car.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        background: "#111",
        minHeight: "100vh",
        padding: 20,
        color: "white",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h1 style={{ margin: 0 }}>🚗 ავტომანქანები</h1>

        <Link href="/favorites">
          <button
            style={{
              background: "orange",
              border: "none",
              padding: "10px 15px",
              borderRadius: 10,
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            ❤️ ფავორიტები
          </button>
        </Link>
      </div>

      <input
        placeholder="🔍 ძებნა..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: 15,
          width: "100%",
          marginBottom: 25,
          borderRadius: 12,
          border: "none",
          fontSize: 16,
        }}
      />

      {filteredCars.map((car) => (
        <div
          key={car.id}
          style={{
            background: "#1e1e1e",
            borderRadius: 20,
            overflow: "hidden",
            marginBottom: 25,
            boxShadow: "0 0 10px rgba(0,0,0,0.3)",
          }}
        >
          <img
            src={car.image}
            alt={car.name}
            style={{
              width: "100%",
              height: 220,
              objectFit: "cover",
            }}
          />

          <div style={{ padding: 20 }}>
            <h2>{car.name}</h2>

            <p
              style={{
                color: "orange",
                fontSize: 20,
                fontWeight: "bold",
              }}
            >
              ${car.price}
            </p>

            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 15,
              }}
            >
              <Link href={`/car/${car.id}`}>
                <button
                  style={{
                    background: "#333",
                    color: "white",
                    border: "none",
                    padding: "12px 20px",
                    borderRadius: 10,
                    cursor: "pointer",
                  }}
                >
                  👁 ნახვა
                </button>
              </Link>

              <button
                onClick={() => toggleFavorite(car.id)}
                style={{
                  background: favorites.includes(car.id)
                    ? "red"
                    : "orange",
                  color: "white",
                  border: "none",
                  padding: "12px 20px",
                  borderRadius: 10,
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                {favorites.includes(car.id)
                  ? "💔 Remove"
                  : "❤️ ფავორიტი"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}