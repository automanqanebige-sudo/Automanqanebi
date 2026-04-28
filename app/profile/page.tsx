"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import { auth } from "@/lib/firebase";

import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

export default function ProfilePage() {
  const [user, setUser] =
    useState<any>(null);

  const [cars, setCars] =
    useState<any[]>([]);

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        (currentUser) => {
          setUser(currentUser);
        }
      );

    const savedCars = JSON.parse(
      localStorage.getItem(
        "userCars"
      ) || "[]"
    );

    setCars(savedCars);

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);

    alert("გამოხვედი ❤️");
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
          maxWidth: 500,
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
            background: "#1e1e1e",
            padding: 25,
            borderRadius: 20,
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          {user && (
            <>
              <img
                src={user.photoURL}
                alt="profile"
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  marginBottom: 20,
                  border:
                    "4px solid orange",
                }}
              />

              <h1
                style={{
                  marginBottom: 10,
                }}
              >
                {user.displayName}
              </h1>

              <p
                style={{
                  color: "#aaa",
                  marginBottom: 20,
                }}
              >
                {user.email}
              </p>

              <div
                style={{
                  background:
                    "linear-gradient(90deg, orange, red)",
                  padding: 12,
                  borderRadius: 12,
                  fontWeight: "bold",
                  marginBottom: 20,
                }}
              >
                👑 VIP USER
              </div>

              <button
                onClick={logout}
                style={{
                  width: "100%",
                  padding: 14,
                  borderRadius: 12,
                  border: "none",
                  background: "red",
                  color: "white",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                🚪 Logout
              </button>
            </>
          )}
        </div>

        <div
          style={{
            background: "#1e1e1e",
            padding: 20,
            borderRadius: 20,
          }}
        >
          <h2
            style={{
              marginBottom: 20,
            }}
          >
            🚗 ჩემი მანქანები
          </h2>

          {cars.length === 0 ? (
            <p>
              მანქანები ჯერ არ
              დაგიმატებია
            </p>
          ) : (
            cars.map((car) => (
              <div
                key={car.id}
                style={{
                  background: "#111",
                  borderRadius: 16,
                  overflow: "hidden",
                  marginBottom: 20,
                }}
              >
                <img
                  src={car.image}
                  alt={car.name}
                  style={{
                    width: "100%",
                    height: 200,
                    objectFit: "cover",
                  }}
                />

                <div
                  style={{
                    padding: 15,
                  }}
                >
                  <h3
                    style={{
                      marginBottom: 10,
                    }}
                  >
                    {car.name}
                  </h3>

                  <p
                    style={{
                      color:
                        "#00ff99",
                      fontSize: 20,
                    }}
                  >
                    ${car.price}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}