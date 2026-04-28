"use client";

import Link from "next/link";

const defaultCars = [
  {
    id: 1,
    name: "BMW X5",
    price: 15000,
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e",
    description:
      "ძალიან კომფორტული და სწრაფი BMW X5 იდეალურ მდგომარეობაში.",
  },
  {
    id: 2,
    name: "Mercedes E-Class",
    price: 13000,
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
    description:
      "Mercedes E-Class ეკონომიური და ელეგანტური ავტომობილი.",
  },
  {
    id: 3,
    name: "Toyota Camry",
    price: 10000,
    image:
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341",
    description:
      "Toyota Camry გამძლე და ოჯახისთვის იდეალური მანქანა.",
  },
];

export default function CarPage({
  params,
}: {
  params: { id: string };
}) {
  const savedCars = JSON.parse(
    localStorage.getItem("userCars") ||
      "[]"
  );

  const cars = [
    ...defaultCars,
    ...savedCars,
  ];

  const car = cars.find(
    (c) => c.id === Number(params.id)
  );

  if (!car) {
    return (
      <div
        style={{
          background: "#111",
          color: "white",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 30,
        }}
      >
        მანქანა ვერ მოიძებნა ❌
      </div>
    );
  }

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
          maxWidth: 700,
          margin: "0 auto",
          background: "#1e1e1e",
          borderRadius: 24,
          overflow: "hidden",
        }}
      >
        <img
          src={car.image}
          alt={car.name}
          style={{
            width: "100%",
            height: 350,
            objectFit: "cover",
          }}
        />

        <div style={{ padding: 25 }}>
          <h1
            style={{
              fontSize: 38,
              marginBottom: 20,
            }}
          >
            {car.name}
          </h1>

          <p
            style={{
              color: "#00ff99",
              fontSize: 32,
              fontWeight: "bold",
              marginBottom: 20,
            }}
          >
            ${car.price}
          </p>

          <p
            style={{
              fontSize: 18,
              lineHeight: 1.7,
              color: "#ccc",
              marginBottom: 30,
            }}
          >
            {car.description ||
              "აღწერა არ არის დამატებული."}
          </p>

          <Link href="/">
            <button
              style={{
                width: "100%",
                padding: 16,
                borderRadius: 14,
                border: "none",
                background: "#0066ff",
                color: "white",
                fontSize: 18,
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              ⬅️ უკან დაბრუნება
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}