"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const cars = [
  {
    id: 1,
    name: "BMW X5",
    price: 15000,
    image:
      "https://source.unsplash.com/featured/?bmw",
    year: 2022,
    fuel: "Petrol",
  },
  {
    id: 2,
    name: "Mercedes E-Class",
    price: 13000,
    image:
      "https://source.unsplash.com/featured/?mercedes",
    year: 2021,
    fuel: "Diesel",
  },
  {
    id: 3,
    name: "Toyota Camry",
    price: 10000,
    image:
      "https://source.unsplash.com/featured/?toyota",
    year: 2020,
    fuel: "Hybrid",
  },
  {
    id: 4,
    name: "Audi A6",
    price: 17000,
    image:
      "https://source.unsplash.com/featured/?audi",
    year: 2023,
    fuel: "Petrol",
  },
  {
    id: 5,
    name: "Porsche Cayenne",
    price: 25000,
    image:
      "https://source.unsplash.com/featured/?porsche",
    year: 2024,
    fuel: "Hybrid",
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

  const filteredCars = cars.filter((car) =>
    car.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        background: "#0f0f0f",
        minHeight: "100vh",
        padding: 20,
        color: "white",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 550,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h1
            style={{
              fontSize: 32,
            }}
          >
            🚗 AutoMarket
          </h1>

          <Link href="/favorites">
            <button
              style={{
                padding: "10px 16px",
                borderRadius: 12,
                border: "none",
                background: "#ff0055",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              ❤️ {favorites.length}
            </button>
          </Link>
        </div>

        <input
          placeholder="🔍 მოძებნე მანქანა..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          style={{
            width: "100%",
            padding: 16,
            borderRadius: 16,
            border: "none",
            marginBottom: 25,
            fontSize: 16,
            outline: "none",
          }}
        />

        {filteredCars.map((car) => (
          <div
            key={car.id}
            style={{
              background: "#1a1a1a",
              borderRadius: 24,
              overflow: "hidden",
              marginBottom: 25,
              boxShadow:
                "0 0 20px rgba(0,0,0,0.4)",
            }}
          >
            <img
              src={car.image}
              alt={car.name}
              style={{
                width: "100%",
                height: 240,
                objectFit: "cover",
              }}
            />

            <div style={{ padding: 20 }}>
              <Link href={`/car/${car.id}`}>
                <h2
                  style={{
                    fontSize: 24,
                    marginBottom: 10,
                    cursor: "pointer",
                  }}
                >
                  {car.name}
                </h2>
              </Link>

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  marginBottom: 15,
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    background: "#333",
                    padding:
                      "6px 12px",
                    borderRadius: 10,
                    fontSize: 14,
                  }}
                >
                  📅 {car.year}
                </span>

                <span
                  style={{
                    background: "#333",
                    padding:
                      "6px 12px",
                    borderRadius: 10,
                    fontSize: 14,
                  }}
                >
                  ⛽ {car.fuel}
                </span>
              </div>

              <p
                style={{
                  color: "#00ff99",
                  fontSize: 26,
                  fontWeight: "bold",
                  marginBottom: 20,
                }}
              >
                ${car.price}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: 10,
                }}
              >
                <button
                  onClick={() =>
                    addToFavorites(car.id)
                  }
                  style={{
                    flex: 1,
                    padding: 14,
                    borderRadius: 14,
                    border: "none",
                    background:
                      favorites.includes(
                        car.id
                      )
                        ? "#ff0055"
                        : "#ff9900",
                    color: "white",
                    fontWeight: "bold",
                    cursor: "pointer",
                    fontSize: 15,
                  }}
                >
                  {favorites.includes(car.id)
                    ? "💔 წაშლა"
                    : "❤️ ფავორიტი"}
                </button>

                <Link
                  href={`/car/${car.id}`}
                  style={{
                    flex: 1,
                  }}
                >
                  <button
                    style={{
                      width: "100%",
                      padding: 14,
                      borderRadius: 14,
                      border: "none",
                      background:
                        "#2563eb",
                      color: "white",
                      fontWeight: "bold",
                      cursor: "pointer",
                      fontSize: 15,
                    }}
                  >
                    🚘 დეტალები
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}

        <div
          style={{
            position: "fixed",
            bottom: 20,
            left: 20,
            right: 20,
            background: "#1a1a1a",
            borderRadius: 20,
            padding: 16,
            display: "flex",
            justifyContent:
              "space-around",
            maxWidth: 550,
            margin: "0 auto",
          }}
        >
          <Link href="/">
            <span
              style={{
                color: "white",
                fontSize: 24,
              }}
            >
              🏠
            </span>
          </Link>

          <Link href="/favorites">
            <span
              style={{
                color: "white",
                fontSize: 24,
              }}
            >
              ❤️
            </span>
          </Link>

          <span
            style={{
              color: "white",
              fontSize: 24,
            }}
          >
            👤
          </span>
        </div>
      </div>
    </div>
  );
}