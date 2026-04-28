"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const defaultCars = [
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
      localStorage.getItem("darkMode");

    if (savedTheme) {
      setDarkMode(
        JSON.parse(savedTheme)
      );
    }
  }, []);

  const toggleTheme = () => {
    const updated = !darkMode;

    setDarkMode(updated);

    localStorage.setItem(
      "darkMode",
      JSON.stringify(updated)
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
          : "#f5f5f5",
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
              padding: 10,
              borderRadius: 12,
              border: "none",
              background: darkMode
                ? "#333"
                : "#ddd",
              cursor: "pointer",
              fontSize: 18,
            }}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            marginBottom: 20,
            flexWrap: "wrap",
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
          }}
        />

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
                "0 0 10px rgba(0,0,0,0.2)",
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
                    color: darkMode
                      ? "white"
                      : "black",
                  }}
                >
                  {car.name}
                </h2>
              </Link>

              <p
                style={{
                  color: "#00cc66",
                  fontSize: 22,
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
                    borderRadius: 12,
                    border: "none",
                    background: "orange",
                    color: "white",
                    fontWeight: "bold",
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