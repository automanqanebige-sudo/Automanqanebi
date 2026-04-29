"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

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

  // მანქანების წამოღება

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
        display: "flex",
        minHeight: "100vh",
        background: "#111",
        color: "white",
      }}
    >
      {/* SIDEBAR */}

      <div
        style={{
          width: 250,
          background: "#1a1a1a",
          padding: 20,
          borderRight:
            "1px solid #333",
        }}
      >
        <h2
          style={{
            marginBottom: 30,
          }}
        >
          🛠️ ADMIN
        </h2>

        <div
          style={{
            display: "flex",
            flexDirection:
              "column",
            gap: 15,
          }}
        >
          <Link href="/">
            <button
              style={menuButton}
            >
              🏠 მთავარი
            </button>
          </Link>

          <Link href="/add-car">
            <button
              style={menuButton}
            >
              ➕ დამატება
            </button>
          </Link>

          <button
            style={menuButton}
          >
            🚗 მანქანები
          </button>
        </div>
      </div>

      {/* CONTENT */}

      <div
        style={{
          flex: 1,
          padding: 30,
        }}
      >
        {/* TOP */}

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: 30,
          }}
        >
          <h1>
            Dashboard
          </h1>

          <div
            style={{
              background:
                "#1e1e1e",
              padding:
                "10px 20px",
              borderRadius: 12,
            }}
          >
            🚗 მანქანები:
            {" "}
            {cars.length}
          </div>
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

        {/* CARDS */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
          }}
        >
          {cars.map((car) => (
            <div
              key={car.id}
              style={{
                background:
                  "#1e1e1e",
                borderRadius: 20,
                overflow:
                  "hidden",
              }}
            >
              <img
                src={car.image}
                alt={car.name}
                style={{
                  width: "100%",
                  height: 200,
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
                    fontWeight:
                      "bold",
                    fontSize: 22,
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
                    width: "100%",
                    padding: 12,
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
    </div>
  );
}

// BUTTON STYLE

const menuButton = {
  width: "100%",
  padding: 14,
  borderRadius: 12,
  border: "none",
  background: "#2a2a2a",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};