"use client";

import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [menuOpen, setMenuOpen] =
    useState(false);

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
            maxWidth: 900,
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
                  color: "#111",
                }}
              >
                AUTO
              </h1>

              <p
                style={{
                  margin: 0,
                  color: "#666",
                }}
              >
                ავტომანქანები
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
                display: "flex",
                gap: 8,
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
            maxWidth: 900,
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
          maxWidth: 900,
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
            boxShadow:
              "0 20px 50px rgba(0,0,0,0.2)",
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
                  marginBottom: 20,
                  lineHeight: 1,
                }}
              >
                AUTOMANQANEBI.GE
              </h1>

              <p
                style={{
                  fontSize: 24,
                  opacity: 0.9,
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

          {/* STATS */}

          <div
            style={{
              display: "flex",
              gap: 30,
              marginTop: 40,
              flexWrap: "wrap",
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: 42,
                  margin: 0,
                }}
              >
                12+
              </h2>

              <p>განცხადება</p>
            </div>

            <div>
              <h2
                style={{
                  fontSize: 42,
                  margin: 0,
                }}
              >
                24/7
              </h2>

              <p>ხელმისაწვდომი</p>
            </div>

            <div>
              <h2
                style={{
                  fontSize: 42,
                  margin: 0,
                }}
              >
                უფასო
              </h2>

              <p>განთავსება</p>
            </div>
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
              placeholder="🔍 ძებნა..."
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
      </div>
    </div>
  );
}