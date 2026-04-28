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
    const saved =
      localStorage.getItem("favorites");

    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  const addToFavorites = (id: number) => {
    let updated = [...favorites];

    if (!updated.includes(id)) {
      updated.push(id);
    }

    setFavorites(updated);

    localStorage.setItem(
      "favorites",
      JSON.stringify(updated)
    );

    alert("დაემატა ფავორიტებში ❤️");
  };

  const filteredCars = cars.filter((car) =>
    car.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        background: "#111",
        minHeight: "100vh",
        padding: 20,
        color: "white",
      }}
    >
      <div
        style={{
          maxWidth: 500,
          margin: "0 auto",
        }}
      >
        <h1>🚗 ავტომანქანები</h1>

        <Link href="/favorites">
          <button
            style={{
              width: "100%",
              padding: 14,
              borderRadius: 12,
              border: "none",
              background: "#ff0055",
              color: "white",
              marginBottom: 20,
            }}
          >
            ❤️ ფავორიტები
          </button>
        </Link>

        <input
          placeholder="ძებნა..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 12,
            border: "none",
            marginBottom: 20,
          }}
        />

        {filteredCars.map((car) => (
          <div
            key={car.id}
            style={{
              background: "#1e1e1e",
              borderRadius: 20,
              overflow: "hidden",
              marginBottom: 20,
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
              <Link href={`/car/${car.id}`}>
                <h2>{car.name}</h2>
              </Link>

              <p
                style={{
                  color: "#00ff99",
                  fontSize: 20,
                }}
              >
                ${car.price}
              </p>

              <button
                onClick={() =>
                  addToFavorites(car.id)
                }
                style={{
                  width: "100%",
                  padding: 14,
                  borderRadius: 12,
                  border: "none",
                  background: "orange",
                  color: "white",
                }}
              >
                ❤️ ფავორიტი
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}