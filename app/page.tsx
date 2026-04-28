"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const defaultCars = [
  {
    id: 1,
    name: "BMW X5",
    price: 15000,
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1200&auto=format&fit=crop",
    description:
      "ძალიან კომფორტული და სწრაფი BMW X5.",
  },
  {
    id: 2,
    name: "Mercedes E-Class",
    price: 13000,
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop",
    description:
      "Mercedes E-Class იდეალური საოჯახო მანქანა.",
  },
  {
    id: 3,
    name: "Toyota Camry",
    price: 10000,
    image:
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop",
    description:
      "Toyota Camry ეკონომიური და გამძლე მანქანა.",
  },
];

export default function Home() {
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<
    number[]
  >([]);
  const [cars, setCars] =
    useState<any[]>([]);
  const [darkMode, setDarkMode] =
    useState(true);

  useEffect(() => {
    const savedFavorites =
      localStorage.getItem("favorites");

    if (savedFavorites) {
      setFavorites(
        JSON.parse(savedFavorites)
      );
    }

    const savedCars = JSON.parse(
      localStorage.getItem("userCars") ||
        "[]"
    );

    setCars([
      ...defaultCars,
      ...savedCars,
    ]);

    const savedTheme =
      localStorage.getItem("theme");

    if (savedTheme === "light") {
      setDarkMode(false);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !darkMode;

    setDarkMode(newTheme);

    localStorage.setItem(
      "theme",
      newTheme ? "dark" : "light"
    );
  };

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

  const deleteCar = (id: number) => {
    const updatedCars = cars.filter(
      (car) => car.id !== id
    );

    setCars(updatedCars);

    const userCars = updatedCars.filter(
      (car) => car.id > 3
    );

    localStorage.setItem(
      "userCars",
      JSON.stringify(userCars)
    );

    alert("მანქანა წაიშალა 🗑️");
  };

  const filteredCars = cars.filter((car) =>
    car.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        background: darkMode
          ? "#111"
          : "#f2f2f2",
        minHeight: "100vh",
        padding: 20,
        color: darkMode
          ? "white"
          : "black",
        transition: "0.3s",
      }}
    >
      <div
        style={{
          maxWidth: 500,
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
          <h1>
            🚗 ავტომანქანები
          </h1>

          <button
            onClick={toggleTheme}
            style={{
              padding:
                "10px 14px",
              borderRadius: 12,
              border: "none",
              background: darkMode
                ? "#333"
                : "#ddd",
              color: darkMode
                ? "white"
                : "black",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {darkMode
              ? "☀️ Light"
              : "🌙 Dark"}
          </button>
        </div>

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
                fontWeight: "bold",
                cursor: "pointer",
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
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              ➕ დამატება
            </button>
          </Link>

          <Link
            href="/profile"
            style={{ flex: 1 }}
          >
            <button
              style={{
                width: "100%",
                padding: 14,
                borderRadius: 12,
                border: "none",
                background: "#0066ff",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              👤 პროფილი
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
            outline: "none",
          }}
        />

        {filteredCars.length === 0 && (
          <div
            style={{
              textAlign: "center",
              marginTop: 40,
              opacity: 0.7,
            }}
          >
            მანქანა ვერ მოიძებნა 😢
          </div>
        )}

        {filteredCars.map((car) => (
          <div
            key={car.id}
            style={{
              background: darkMode
                ? "#1e1e1e"
                : "white",
              borderRadius: 20,
              overflow: "hidden",
              marginBottom: 20,
              boxShadow:
                "0 5px 20px rgba(0,0,0,0.2)",
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
                <h2
                  style={{
                    marginBottom: 10,
                    cursor: "pointer",
                  }}
                >
                  {car.name}
                </h2>
              </Link>

              <p
                style={{
                  color: "#00ff99",
                  fontSize: 22,
                  marginBottom: 10,
                  fontWeight: "bold",
                }}
              >
                ${car.price}
              </p>

              <p
                style={{
                  opacity: 0.8,
                  marginBottom: 20,
                  lineHeight: 1.5,
                }}
              >
                {car.description}
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
                    borderRadius: 12,
                    border: "none",
                    background: "orange",
                    color: "white",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  ❤️ ფავორიტი
                </button>

                {car.id > 3 && (
                  <>
                    <Link
                      href={`/edit-car/${car.id}`}
                    >
                      <button
                        style={{
                          padding: 14,
                          borderRadius: 12,
                          border: "none",
                          background: "#0066ff",
                          color: "white",
                          fontWeight: "bold",
                          cursor: "pointer",
                        }}
                      >
                        ✏️
                      </button>
                    </Link>

                    <button
                      onClick={() =>
                        deleteCar(car.id)
                      }
                      style={{
                        padding: 14,
                        borderRadius: 12,
                        border: "none",
                        background: "red",
                        color: "white",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    >
                      🗑️
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}