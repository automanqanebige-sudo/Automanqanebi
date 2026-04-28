"use client";

import { useState } from "react";
import Link from "next/link";

export default function AddCarPage() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] =
    useState("");

  const handleAddCar = () => {
    if (
      !name ||
      !price ||
      !image ||
      !description
    ) {
      alert("შეავსე ყველა ველი");
      return;
    }

    const newCar = {
      id: Date.now(),
      name,
      price,
      image,
      description,
    };

    const savedCars = JSON.parse(
      localStorage.getItem("userCars") || "[]"
    );

    savedCars.push(newCar);

    localStorage.setItem(
      "userCars",
      JSON.stringify(savedCars)
    );

    alert("🚗 მანქანა დაემატა");

    setName("");
    setPrice("");
    setImage("");
    setDescription("");
  };

  return (
    <div
      style={{
        background: "#0f0f0f",
        minHeight: "100vh",
        color: "white",
        padding: 20,
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 600,
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

        <h1
          style={{
            marginBottom: 25,
            fontSize: 34,
          }}
        >
          🚘 მანქანის დამატება
        </h1>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 15,
          }}
        >
          <input
            placeholder="მანქანის სახელი"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            style={inputStyle}
          />

          <input
            placeholder="ფასი"
            value={price}
            onChange={(e) =>
              setPrice(e.target.value)
            }
            style={inputStyle}
          />

          <input
            placeholder="ფოტოს URL"
            value={image}
            onChange={(e) =>
              setImage(e.target.value)
            }
            style={inputStyle}
          />

          <textarea
            placeholder="აღწერა"
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            style={{
              ...inputStyle,
              minHeight: 140,
              resize: "none",
            }}
          />

          {image && (
            <img
              src={image}
              alt="preview"
              style={{
                width: "100%",
                borderRadius: 20,
                height: 250,
                objectFit: "cover",
              }}
            />
          )}

          <button
            onClick={handleAddCar}
            style={{
              padding: 18,
              borderRadius: 18,
              border: "none",
              background: "#22c55e",
              color: "white",
              fontWeight: "bold",
              fontSize: 18,
              cursor: "pointer",
            }}
          >
            🚀 დამატება
          </button>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: 16,
  borderRadius: 16,
  border: "none",
  background: "#1e1e1e",
  color: "white",
  fontSize: 16,
  outline: "none",
};