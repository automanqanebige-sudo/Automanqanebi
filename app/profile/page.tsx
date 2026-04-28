"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [phone, setPhone] =
    useState("");

  useEffect(() => {
    const savedName =
      localStorage.getItem("profileName");

    const savedPhone =
      localStorage.getItem("profilePhone");

    if (savedName) {
      setName(savedName);
    }

    if (savedPhone) {
      setPhone(savedPhone);
    }
  }, []);

  const saveProfile = () => {
    localStorage.setItem(
      "profileName",
      name
    );

    localStorage.setItem(
      "profilePhone",
      phone
    );

    alert("პროფილი შენახულია 👤");
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
              background: "#333",
              color: "white",
            }}
          >
            ⬅ უკან
          </button>
        </Link>

        <h1
          style={{
            marginBottom: 20,
          }}
        >
          👤 პროფილი
        </h1>

        <input
          placeholder="სახელი"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          style={{
            width: "100%",
            padding: 14,
            marginBottom: 15,
            borderRadius: 12,
            border: "none",
          }}
        />

        <input
          placeholder="ტელეფონი"
          value={phone}
          onChange={(e) =>
            setPhone(e.target.value)
          }
          style={{
            width: "100%",
            padding: 14,
            marginBottom: 20,
            borderRadius: 12,
            border: "none",
          }}
        />

        <button
          onClick={saveProfile}
          style={{
            width: "100%",
            padding: 16,
            borderRadius: 12,
            border: "none",
            background: "#00aa55",
            color: "white",
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          💾 შენახვა
        </button>

        <div
          style={{
            marginTop: 30,
            background: "#1e1e1e",
            padding: 20,
            borderRadius: 20,
          }}
        >
          <h2>📋 ინფორმაცია</h2>

          <p>
            👤 სახელი:{" "}
            {name || "არ არის"}
          </p>

          <p>
            📞 ტელეფონი:{" "}
            {phone || "არ არის"}
          </p>
        </div>
      </div>
    </div>
  );
}