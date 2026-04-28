"use client";

import { useState } from "react";

import { db } from "@/lib/firebase";

import {
  collection,
  addDoc,
} from "firebase/firestore";

export default function AddCar() {
  const [name, setName] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [image, setImage] =
    useState("");

  const saveCar = async () => {
    if (
      !name ||
      !price ||
      !image
    ) {
      alert("შეავსე ყველა ველი");
      return;
    }

    try {
      await addDoc(
        collection(db, "cars"),
        {
          name,
          price,
          image,
          createdAt: Date.now(),
        }
      );

      alert(
        "მანქანა დაემატა Firebase-ში 🔥"
      );

      setName("");
      setPrice("");
      setImage("");
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
        <h1
          style={{
            marginBottom: 20,
          }}
        >
          ➕ მანქანის დამატება
        </h1>

        <input
          placeholder="მანქანის სახელი"
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
          placeholder="ფასი"
          value={price}
          onChange={(e) =>
            setPrice(e.target.value)
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
          placeholder="სურათის URL"
          value={image}
          onChange={(e) =>
            setImage(e.target.value)
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
          onClick={saveCar}
          style={{
            width: "100%",
            padding: 16,
            borderRadius: 12,
            border: "none",
            background: "#00aa55",
            color: "white",
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          🚗 დამატება
        </button>
      </div>
    </div>
  );
}