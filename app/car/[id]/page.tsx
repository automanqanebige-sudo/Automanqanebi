"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const cars = [
  {
    id: 1,
    name: "BMW X5",
    price: 15000,
    year: 2022,
    fuel: "Petrol",
    transmission: "Automatic",
    location: "Tbilisi",
    image:
      "https://source.unsplash.com/featured/?bmw",
    description:
      "BMW X5 იდეალურ მდგომარეობაშია. კომფორტული, სწრაფი და ეკონომიური SUV.",
  },
  {
    id: 2,
    name: "Mercedes E-Class",
    price: 13000,
    year: 2021,
    fuel: "Diesel",
    transmission: "Automatic",
    location: "Batumi",
    image:
      "https://source.unsplash.com/featured/?mercedes",
    description:
      "Mercedes E-Class ელეგანტური და პრემიუმ კლასის ავტომობილია.",
  },
  {
    id: 3,
    name: "Toyota Camry",
    price: 10000,
    year: 2020,
    fuel: "Hybrid",
    transmission: "Automatic",
    location: "Kutaisi",
    image:
      "https://source.unsplash.com/featured/?toyota",
    description:
      "Toyota Camry ძალიან გამძლე და ეკონომიური მანქანაა.",
  },
];

export default function CarPage({
  params,
}: {
  params: { id: string };
}) {
  const [favorites, setFavorites] = useState<
    number[]
  >([]);

  useEffect(() => {
    const saved =
      localStorage.getItem("favorites");

    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  const toggleFavorite = (id: number) => {
    let updated = [...favorites];

    if (updated.includes(id)) {
      updated = updated.filter(
        (item) => item !== id
      );
    } else {
      updated.push(id);
    }

    setFavorites(updated);

    localStorage.setItem(
      "favorites",
      JSON.stringify(updated)
    );
  };

  const car = cars.find(
    (c) => c.id === Number(params.id)
  );

  if (!car) {
    return (
      <div
        style={{
          background: "#111",
          color: "white",
          minHeight: "100vh",
          padding: 20,
        }}
      >
        <h1>❌ მანქანა ვერ მოიძებნა</h1>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#0f0f0f",
        minHeight: "100vh",
        color: "white",
        fontFamily: "sans-serif",
      }}
    >
      <img
        src={car.image}
        alt={car.name}
        style={{
          width: "100%",
          height: 320,
          objectFit: "cover",
        }}
      />

      <div
        style={{
          padding: 20,
          maxWidth: 700,
          margin: "0 auto",
        }}
      >
        <Link href="/">
          <button
            style={{
              padding: 12,
              borderRadius: 12,
              border: "none",
              marginBottom: 20,
              cursor: "pointer",
            }}
          >
            ⬅ უკან
          </button>
        </Link>

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <h1
            style={{
              fontSize: 34,
            }}
          >
            {car.name}
          </h1>

          <button
            onClick={() =>
              toggleFavorite(car.id)
            }
            style={{
              border: "none",
              background: "none",
              fontSize: 30,
              cursor: "pointer",
            }}
          >
            {favorites.includes(car.id)
              ? "❤️"
              : "🤍"}
          </button>
        </div>

        <h2
          style={{
            color: "#00ff99",
            fontSize: 32,
            marginBottom: 20,
          }}
        >
          ${car.price}
        </h2>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            marginBottom: 25,
          }}
        >
          <span
            style={{
              background: "#1e1e1e",
              padding: "10px 14px",
              borderRadius: 12,
            }}
          >
            📅 {car.year}
          </span>

          <span
            style={{
              background: "#1e1e1e",
              padding: "10px 14px",
              borderRadius: 12,
            }}
          >
            ⛽ {car.fuel}
          </span>

          <span
            style={{
              background: "#1e1e1e",
              padding: "10px 14px",
              borderRadius: 12,
            }}
          >
            ⚙️ {car.transmission}
          </span>

          <span
            style={{
              background: "#1e1e1e",
              padding: "10px 14px",
              borderRadius: 12,
            }}
          >
            📍 {car.location}
          </span>
        </div>

        <div
          style={{
            background: "#1a1a1a",
            padding: 20,
            borderRadius: 20,
            marginBottom: 25,
          }}
        >
          <h3
            style={{
              marginBottom: 10,
            }}
          >
            📄 აღწერა
          </h3>

          <p
            style={{
              color: "#ccc",
              lineHeight: 1.7,
            }}
          >
            {car.description}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
          }}
        >
          <a
            href="tel:+995555123456"
            style={{
              flex: 1,
            }}
          >
            <button
              style={{
                width: "100%",
                padding: 16,
                borderRadius: 16,
                border: "none",
                background: "#22c55e",
                color: "white",
                fontWeight: "bold",
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              📞 დარეკვა
            </button>
          </a>

          <a
            href="https://wa.me/995555123456"
            target="_blank"
            style={{
              flex: 1,
            }}
          >
            <button
              style={{
                width: "100%",
                padding: 16,
                borderRadius: 16,
                border: "none",
                background: "#2563eb",
                color: "white",
                fontWeight: "bold",
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              💬 შეტყობინება
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}