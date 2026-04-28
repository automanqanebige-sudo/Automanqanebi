"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import { auth } from "../lib/firebase";

const cars = [
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
  const [favorites, setFavorites] = useState<number[]>([]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem("favorites");

    if (saved) {
      setFavorites(JSON.parse(saved));
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const toggleFavorite = (id: number) => {
    let updated: number[] = [];

    if (favorites.includes(id)) {
      updated = favorites.filter((f) => f !== id);
    } else {
      updated = [...favorites, id];
    }

    setFavorites(updated);

    localStorage.setItem(
      "favorites",
      JSON.stringify(updated)
    );
  };

  const register = async () => {
    try {
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      alert("რეგისტრაცია წარმატებულია");
    } catch (error: any) {
      alert(error.message);
    }
  };

  const login = async () => {
    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      alert("შესვლა წარმატებულია");
    } catch (error: any) {
      alert(error.message);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const filteredCars = cars.filter((car) =>
    car.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        background: "#111",
        minHeight: "100vh",
        color: "white",
        padding: 20,
        fontFamily: "sans-serif",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: 30,
        }}
      >
        🚗 ავტომანქანები
      </h1>

      {!user ? (
        <div
          style={{
            background: "#1e1e1e",
            padding: 20,
            borderRadius: 16,
            marginBottom: 30,
          }}
        >
          <input
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            style={inputStyle}
          />

          <button
            onClick={register}
            style={buttonStyle}
          >
            რეგისტრაცია
          </button>

          <button
            onClick={login}
            style={{
              ...buttonStyle,
              background: "#2563eb",
            }}
          >
            შესვლა
          </button>
        </div>
      ) : (
        <div
          style={{
            marginBottom: 20,
          }}
        >
          <p>
            👤 {user.email}
          </p>

          <button
            onClick={logout}
            style={{
              ...buttonStyle,
              background: "red",
            }}
          >
            გამოსვლა
          </button>
        </div>
      )}

      <Link href="/favorites">
        <button
          style={{
            ...buttonStyle,
            background: "#e91e63",
            marginBottom: 20,
          }}
        >
          ❤️ ფავორიტები
        </button>
      </Link>

      <input
        placeholder="ძებნა..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        style={inputStyle}
      />

      {filteredCars.map((car) => (
        <div
          key={car.id}
          style={{
            background: "#1e1e1e",
            borderRadius: 20,
            overflow: "hidden",
            marginBottom: 25,
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
                toggleFavorite(car.id)
              }
              style={{
                ...buttonStyle,
                background: favorites.includes(car.id)
                  ? "red"
                  : "#ff9800",
              }}
            >
              {favorites.includes(car.id)
                ? "💔 წაშლა"
                : "❤️ ფავორიტი"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: 14,
  borderRadius: 12,
  border: "none",
  marginBottom: 15,
};

const buttonStyle = {
  width: "100%",
  padding: 14,
  borderRadius: 12,
  border: "none",
  color: "white",
  fontWeight: "bold" as const,
  marginBottom: 12,
  cursor: "pointer",
  background: "#ff9800",
};