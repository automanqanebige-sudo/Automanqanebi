"use client";

import { useState } from "react";
import Link from "next/link";

const cars = [
  {
    id: 1,
    name: "BMW M5",
    price: 25000,
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e",
  },

  {
    id: 2,
    name: "Mercedes S-Class",
    price: 32000,
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
  },

  {
    id: 3,
    name: "Toyota Camry",
    price: 14000,
    image:
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341",
  },

  {
    id: 4,
    name: "Range Rover",
    price: 45000,
    image:
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8",
  },
];

export default function Home() {
  const [menuOpen, setMenuOpen] =
    useState(false);

  const [favorites, setFavorites] =
    useState<number[]>([]);

  const addToFavorites = (
    id: number
  ) => {
    if (
      favorites.includes(id)
    ) {
      return;
    }

    setFavorites([
      ...favorites,
      id,
    ]);

    alert(
      "დაემატა ფავორიტებში ❤️"
    );
  };

  return (
    <div
      style={{
        background: "#f3f3f3",
        minHeight: "100vh",
        paddingBottom: 50,
      }}
    >
      {/* HEADER */}

      <div
        style={{
          background: "white",
          padding: 20,
          borderBottom:
            "1px solid #ddd",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 20,
                background: "#00aa55",
                display: "flex",
                alignItems: "center",
                justifyContent:
                  "center",
                fontSize: 30,
              }}
            >
              🚗
            </div>

            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: 28,
                }}
              >
                AUTOMANQANEBI
              </h1>

              <p
                style={{
                  margin: 0,
                  color: "#666",
                }}
              >
                ავტომობილები
              </p>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                background: "#f1f1f1",
                padding:
                  "8px 14px",
                borderRadius: 999,
                fontSize: 20,
              }}
            >
              🇬🇪 🇷🇺 🇬🇧
            </div>

            <button
              onClick={() =>
                setMenuOpen(
                  !menuOpen
                )
              }
              style={{
                border: "none",
                background:
                  "transparent",
                fontSize: 34,
                cursor: "pointer",
              }}
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* MENU */}

      {menuOpen && (
        <div
          style={{
            background: "white",
            maxWidth: 1200,
            margin:
              "20px auto",
            borderRadius: 24,
            padding: 25,
            boxShadow:
              "0 10px 30px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection:
                "column",
              gap: 20,
              fontSize: 22,
            }}
          >
            <Link href="/">
              მთავარი
            </Link>

            <Link href="/favorites">
              ❤️ ფავორიტები
            </Link>

            <Link href="/add-car">
              ➕ დამატება
            </Link>

            <Link href="/profile">
              👤 პროფილი
            </Link>
          </div>
        </div>
      )}

      {/* HERO */}

      <div
        style={{
          maxWidth: 1200,
          margin:
            "30px auto",
          padding: 20,
        }}
      >
        <div
          style={{
            background:
              "linear-gradient(135deg,#008f4c,#00cc66)",
            borderRadius: 40,
            padding: 35,
            color: "white",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 20,
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  marginBottom: 20,
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    background:
                      "rgba(255,255,255,0.2)",
                    padding:
                      "8px 18px",
                    borderRadius: 999,
                  }}
                >
                  🇬🇪 საქართველო
                </div>

                <div
                  style={{
                    background:
                      "rgba(255,255,255,0.2)",
                    padding:
                      "8px 18px",
                    borderRadius: 999,
                  }}
                >
                  ✅ #1 მარკეტი
                </div>
              </div>

              <h1
                style={{
                  fontSize: 60,
                  lineHeight: 1,
                  marginBottom: 20,
                }}
              >
                AUTOMANQANEBI.GE
              </h1>

              <p
                style={{
                  fontSize: 24,
                  maxWidth: 500,
                }}
              >
                იყიდე, გაყიდე,
                იქირავე —
                სწრაფად და
                მარტივად
              </p>
            </div>

            <Link href="/add-car">
              <button
                style={{
                  padding:
                    "18px 30px",
                  borderRadius: 18,
                  border: "none",
                  background:
                    "white",
                  color: "#00aa55",
                  fontWeight:
                    "bold",
                  fontSize: 22,
                  cursor: "pointer",
                }}
              >
                ➕ დამატება
              </button>
            </Link>
          </div>
        </div>

        {/* SEARCH */}

        <div
          style={{
            background: "white",
            marginTop: 30,
            borderRadius: 30,
            padding: 25,
            boxShadow:
              "0 10px 30px rgba(0,0,0,0.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 15,
              flexWrap: "wrap",
            }}
          >
            <input
              placeholder="🔍 მოძებნე მანქანა..."
              style={{
                flex: 1,
                minWidth: 200,
                padding: 20,
                borderRadius: 20,
                border:
                  "1px solid #ddd",
                fontSize: 20,
              }}
            />

            <button
              style={{
                padding:
                  "20px 35px",
                borderRadius: 20,
                border: "none",
                background:
                  "#00aa55",
                color: "white",
                fontWeight:
                  "bold",
                fontSize: 20,
              }}
            >
              ძებნა
            </button>
          </div>
        </div>

        {/* CARS */}

        <div
          style={{
            marginTop: 40,
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(280px,1fr))",
            gap: 25,
          }}
        >
          {cars.map((car) => (
            <div
              key={car.id}
              style={{
                background: "white",
                borderRadius: 30,
                overflow: "hidden",
                boxShadow:
                  "0 10px 30px rgba(0,0,0,0.1)",
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

              <div
                style={{
                  padding: 25,
                }}
              >
                <h2
                  style={{
                    marginBottom: 15,
                    fontSize: 30,
                  }}
                >
                  {car.name}
                </h2>

                <p
                  style={{
                    color: "#00aa55",
                    fontSize: 32,
                    fontWeight:
                      "bold",
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
                      addToFavorites(
                        car.id
                      )
                    }
                    style={{
                      flex: 1,
                      padding: 16,
                      borderRadius: 18,
                      border: "none",
                      background:
                        "orange",
                      color: "white",
                      fontWeight:
                        "bold",
                      fontSize: 18,
                      cursor: "pointer",
                    }}
                  >
                    ❤️ ფავორიტი
                  </button>

                  <Link
                    href={`/car/${car.id}`}
                  >
                    <button
                      style={{
                        padding:
                          "16px 20px",
                        borderRadius: 18,
                        border: "none",
                        background:
                          "#0066ff",
                        color: "white",
                        fontWeight:
                          "bold",
                        cursor:
                          "pointer",
                      }}
                    >
                      👁️
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}