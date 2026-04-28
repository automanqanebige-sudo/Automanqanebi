"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import { db } from "@/lib/firebase";

import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

export default function Home() {
  const [cars, setCars] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  // წამოღება Firebase-დან

  const fetchCars = async () => {
    try {
      const querySnapshot =
        await getDocs(
          collection(db, "cars")
        );

      const carsData: any[] = [];

      querySnapshot.forEach((doc) => {
        carsData.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setCars(carsData);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchCars();
  }, []);

  // წაშლა

  const deleteCar = async (
    id: string
  ) => {
    const confirmDelete =
      confirm(
        "წავშალო მანქანა?"
      );

    if (!confirmDelete) return;

    try {
      await deleteDoc(
        doc(db, "cars", id)
      );

      alert(
        "მანქანა წაიშალა 🗑️"
      );

      fetchCars();
    } catch (error) {
      console.log(error);

      alert("შეცდომა");
    }
  };

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
        {/* TOP */}

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

          <Link href="/add-car">
            <button
              style={{
                padding:
                  "12px 18px",
                borderRadius: 12,
                border: "none",
                background:
                  "#00aa55",
                color: "white",
                fontWeight:
                  "bold",
              }}
            >
              ➕ დამატება
            </button>
          </Link>
        </div>

        {/* LOADING */}

        {loading && (
          <p>იტვირთება...</p>
        )}

        {/* EMPTY */}

        {!loading &&
          cars.length === 0 && (
            <p>
              მანქანები არ არის
            </p>
          )}

        {/* CARS */}

        {cars.map((car) => (
          <div
            key={car.id}
            style={{
              background:
                "#1e1e1e",
              borderRadius: 20,
              overflow:
                "hidden",
              marginBottom: 20,
            }}
          >
            {/* IMAGE */}

            <img
              src={car.image}
              alt={car.name}
              style={{
                width: "100%",
                height: 220,
                objectFit:
                  "cover",
              }}
            />

            <div
              style={{
                padding: 20,
              }}
            >
              {/* BRAND */}

              <div
                style={{
                  display: "flex",
                  alignItems:
                    "center",
                  gap: 10,
                  marginBottom: 10,
                }}
              >
                {car.logo && (
                  <img
                    src={car.logo}
                    alt="logo"
                    style={{
                      width: 40,
                      height: 40,
                      objectFit:
                        "contain",
                      background:
                        "white",
                      borderRadius: 10,
                      padding: 5,
                    }}
                  />
                )}

                <h2>
                  {car.name}
                </h2>
              </div>

              {/* PRICE */}

              <p
                style={{
                  color:
                    "#00ff99",
                  fontSize: 24,
                  fontWeight:
                    "bold",
                  marginBottom: 20,
                }}
              >
                ${car.price}
              </p>

              {/* BUTTONS */}

              <div
                style={{
                  display: "flex",
                  gap: 10,
                }}
              >
                <button
                  style={{
                    flex: 1,
                    padding: 14,
                    borderRadius: 12,
                    border: "none",
                    background:
                      "orange",
                    color:
                      "white",
                    fontWeight:
                      "bold",
                  }}
                >
                  ❤️ ფავორიტი
                </button>

                <button
                  onClick={() =>
                    deleteCar(
                      car.id
                    )
                  }
                  style={{
                    padding: 14,
                    borderRadius: 12,
                    border: "none",
                    background:
                      "red",
                    color:
                      "white",
                    fontWeight:
                      "bold",
                  }}
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}