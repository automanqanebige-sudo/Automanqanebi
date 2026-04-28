"use client";

import Link from "next/link";

export default function ProfilePage() {
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
            textAlign: "center",
            marginBottom: 30,
          }}
        >
          <img
            src="https://i.pravatar.cc/200"
            alt="profile"
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              objectFit: "cover",
              marginBottom: 15,
            }}
          />

          <h1>👤 მომხმარებელი</h1>

          <p
            style={{
              color: "#aaa",
            }}
          >
            example@gmail.com
          </p>
        </div>

        <div
          style={{
            background: "#1e1e1e",
            borderRadius: 20,
            padding: 20,
            marginBottom: 20,
          }}
        >
          <h2>❤️ ფავორიტები</h2>
          <p>შენახული მანქანები</p>
        </div>

        <div
          style={{
            background: "#1e1e1e",
            borderRadius: 20,
            padding: 20,
            marginBottom: 20,
          }}
        >
          <h2>🚘 განცხადებები</h2>
          <p>შენი ატვირთული მანქანები</p>
        </div>

        <button
          style={{
            width: "100%",
            padding: 16,
            borderRadius: 16,
            border: "none",
            background: "#ff0055",
            color: "white",
            fontWeight: "bold",
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          🚪 გამოსვლა
        </button>
      </div>
    </div>
  );
}