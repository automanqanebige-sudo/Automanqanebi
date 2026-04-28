"use client";

import { useState } from "react";

import { db } from "@/lib/firebase";

import {
  collection,
  addDoc,
} from "firebase/firestore";

import { carBrands } from "@/data/cars";

export default function AddCarPage() {
  const [brand, setBrand] =
    useState("");

  const [model, setModel] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [image, setImage] =
    useState("");

  const selectedBrand =
    carBrands.find(
      (b) => b.brand === brand
    );

  const saveCar = async () => {
    if (
      !brand ||
      !model ||
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
          brand,
          model,
          name: `${brand} ${model}`,
          price,
          image,
          logo: selectedBrand?.logo,
          createdAt: Date.now(),
        }
      );

      alert(
        "მანქანა დაემატა 🔥"
      );

      setBrand("");
      setModel("");
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

        {/* BRAND */}

        <select
          value={brand}
          onChange={(e) => {
            setBrand(
              e.target.value
            );

            setModel("");
          }}
          style={{
            width: "100%",
            padding: 14,
            borderRadius: 12,
            marginBottom: 20,
          }}
        >
          <option value="">
            აირჩიე მარკა
          </option>

          {carBrands.map((car) => (
            <option
              key={car.brand}
              value={car.brand}
            >
              {car.brand}
            </option>
          ))}
        </select>

        {/* LOGO */}

        {selectedBrand && (
          <div
            style={{
              marginBottom: 20,
              textAlign: "center",
            }}
          >
            <img
              src={selectedBrand.logo}
              alt={brand}
              style={{
                width: 80,
                height: 80,
                objectFit: "contain",
                background: "white",
                borderRadius: 20,
                padding: 10,
              }}
            />
          </div>
        )}

        {/* MODEL */}

        <select
          value={model}
          onChange={(e) =>
            setModel(
              e.target.value
            )
          }
          style={{
            width: "100%",
            padding: 14,
            borderRadius: 12,
            marginBottom: 20,
          }}
        >
          <option value="">
            აირჩიე მოდელი
          </option>

          {selectedBrand?.models.map(
            (m) => (
              <option
                key={m}
                value={m}
              >
                {m}
              </option>
            )
          )}
        </select>

        {/* PRICE */}

        <input
          placeholder="ფასი"
          value={price}
          onChange={(e) =>
            setPrice(
              e.target.value
            )
          }
          style={{
            width: "100%",
            padding: 14,
            borderRadius: 12,
            border: "none",
            marginBottom: 20,
          }}
        />

        {/* IMAGE */}

        <input
          placeholder="სურათის ლინკი"
          value={image}
          onChange={(e) =>
            setImage(
              e.target.value
            )
          }
          style={{
            width: "100%",
            padding: 14,
            borderRadius: 12,
            border: "none",
            marginBottom: 20,
          }}
        />

        {/* BUTTON */}

        <button
          onClick={saveCar}
          style={{
            width: "100%",
            padding: 16,
            borderRadius: 14,
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