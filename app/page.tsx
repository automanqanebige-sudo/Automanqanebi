"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const defaultCars = [
  {
    id: 1,
    name: "BMW X5",
    price: 15000,
    image:
      "https://source.unsplash.com/featured/?bmw",
  },
  {
    id: 2,
    name: "Mercedes E-Class",
    price: 13000,
    image:
      "https://source.unsplash.com/featured/?mercedes",
  },
  {
    id: 3,
    name: "Toyota Camry",
    price: 10000,
    image:
      "https://source.unsplash.com/featured/?toyota",
  },
];

export default function Home() {
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<
    number[]
  >([]);
  const [cars, setCars] =
    useState(defaultCars);

  useEffect(() => {
    const savedFavorites =
      localStorage.getItem("favorites");

    if (savedFavorites) {
      setFavorites(
        JSON.parse(savedFavorites)
      );
    }

    const userCars = JSON.parse(
      localStorage.getItem("userCars") ||
        "[]"
    );

    if (userCars.length > 0) {
      setCars([...defaultCars, ...userCars]);
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
        <h1
          style={{
            marginBottom: 20,
          }}
        >
          🚗 ავტომანქანები
        </h1>

        <div
          style={{
            display: "flex",
            gap: 10,
            marginBottom: 20,
          }}
        >
          <Link
            href="/favorites"
            style={{ flex: 1 }}
          >
            <button
              style={{
                width: "100%",
                padding: 14,
                borderRadius: 12,
                border: "none",
                background: "#ff0055",
                color: "white",
              }}
            >
              ❤️ ფავორიტები
            </button>
          </Link>

          <Link
            href="/add-car"
            style={{ flex: 1 }}
          >
            <button
              style={{
                width: "100%",
                padding: 14,
                borderRadius: 12,
                border: "none",
                background: "#00aa55",
                color: "white",
              }}
            >
              ➕ დამატება
            </button>
          </Link>
        </div>

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

        {filteredCars.map((car: any) => (
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
              <h2>{car.name}</h2>

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