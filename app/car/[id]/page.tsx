"use client";

import Link from "next/link";

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

export default function CarPage({
  params,
}: {
  params: { id: string };
}) {
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
          padding: 20,
        }}
      >
        <h1>❌ მანქანა ვერ მოიძებნა</h1>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#111",
        minHeight: "100vh",
        color: "white",
        padding: 20,
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
          borderRadius: 20,
          overflow: "hidden",
        }}
      >
        <img
          src={car.image}
          alt={car.name}
          style={{
            width: "100%",
            height: 250,
            objectFit: "cover",
          }}
        />

        <div style={{ padding: 20 }}>
          <h1>{car.name}</h1>

          <h2 style={{ color: "#00ff99" }}>
            ${car.price}
          </h2>

          <p style={{ color: "#aaa" }}>
            ავტომობილი იდეალურ მდგომარეობაშია.
            დაბალი გარბენი, ეკონომიური და
            კომფორტული.
          </p>

          <button
            style={{
              width: "100%",
              padding: 14,
              borderRadius: 14,
              border: "none",
              background: "#ff9900",
              color: "white",
              fontWeight: "bold",
              marginTop: 20,
              cursor: "pointer",
            }}
          >
            📞 დარეკვა
          </button>
        </div>
      </div>
    </div>
  );
}