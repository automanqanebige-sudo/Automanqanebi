"use client";

import {
  useState,
  useEffect,
} from "react";

import Link from "next/link";

import { db } from "@/lib/firebase";

import {
  collection,
  getDocs,
} from "firebase/firestore";

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
  const [search, setSearch] =
    useState("");

  const [favorites, setFavorites] =
    useState<number[]>([]);

  const [cars, setCars] =
    useState<any[]>(defaultCars);

  useEffect(() => {
    const savedFavorites =
      localStorage.getItem(
        "favorites"
      );

    if (savedFavorites) {
      setFavorites(
        JSON.parse(savedFavorites)
      );
    }

    loadCars();
  }, []);

  const loadCars = async () => {
    try {
      const querySnapshot =
        await getDocs(
          collection(db, "cars")
        );

      const firebaseCars =
        querySnapshot.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data(),
          })
        );

      setCars([
        ...defaultCars,
        ...firebaseCars,
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  const addToFavorites = (
    id: number | string
  ) => {
    let updated = [...favorites];

    if (
      !updated.includes(id as number)
    ) {
      updated.push(id as number);
    }

    setFavorites(updated);

    localStorage.setItem(
      "favorites",
      JSON.stringify(updated)
    );

    alert(
      "დაემატა ფავორიტებში ❤️"
    );
  };

  const filteredCars = cars.filter(
    (car) =>
      car.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
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
            fontSize: 40,
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
                fontWeight: "bold",
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
            padding: 14,
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

            <div
              style={{
                padding: 20,
              }}
            >
              <h2
                style={{
                  marginBottom: 10,
                  fontSize: 34,
                }}
              >
                {car.name}
              </h2>

              <p
                style={{
                  color: "#00ff99",
                  fontSize: 28,
                  marginBottom: 20,
                }}
              >
                ${car.price}
              </p>

              <button
                onClick={() =>
                  addToFavorites(
                    car.id
                  )
                }
                style={{
                  width: "100%",
                  padding: 14,
                  borderRadius: 12,
                  border: "none",
                  background: "orange",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: 18,
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