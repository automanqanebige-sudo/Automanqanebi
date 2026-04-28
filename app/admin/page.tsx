"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export default function AdminPage() {
  const [cars, setCars] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  // წამოღება Firebase-დან

  const fetchCars = async () => {
    try {
      const snapshot =
        await getDocs(
          collection(db, "cars")
        );

      const data: any[] = [];

      snapshot.forEach((doc) => {
        data.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setCars(data);
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
        "წაიშალა 🗑️"
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
        color: "white",
        padding: 20,
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            marginBottom: 30,
          }}
        >
          🛠️ Admin Panel
        </h1>

        {loading && (
          <p>იტვირთება...</p>
        )}

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
            <img
              src={car.image}
              alt={car.name}
              style={{
                width: "100%",
                height: 250,
                objectFit:
                  "cover",
              }}
            />

            <div
              style={{
                padding: 20,
              }}
            >
              <h2>
                {car.name}
              </h2>

              <p
                style={{
                  color:
                    "#00ff99",
                  fontSize: 22,
                  fontWeight:
                    "bold",
                }}
              >
                ${car.price}
              </p>

              <button
                onClick={() =>
                  deleteCar(
                    car.id
                  )
                }
                style={{
                  marginTop: 15,
                  padding:
                    "12px 18px",
                  borderRadius: 12,
                  border: "none",
                  background:
                    "red",
                  color:
                    "white",
                  fontWeight:
                    "bold",
                  cursor:
                    "pointer",
                }}
              >
                🗑️ წაშლა
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}