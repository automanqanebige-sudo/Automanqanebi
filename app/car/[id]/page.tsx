"use client";

import Link from "next/link";

const cars = [
  {
    id: 1,
    name: "BMW X5",
    price: 15000,
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e",
    description:
      "BMW X5 იდეალურ მდგომარეობაში.",
  },
  {
    id: 2,
    name: "Mercedes E-Class",
    price: 13000,
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
    description:
      "Mercedes E-Class ძალიან კომფორტული.",
  },
  {
    id: 3,
    name: "Toyota Camry",
    price: 10000,
    image:
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341",
    description:
      "Toyota Camry ეკონომიური მანქანა.",
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
        <h1>მანქანა ვერ მოიძებნა</h1>
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
      <div
        style={{
          maxWidth: 700,
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
              height: 320,
              objectFit: "cover",
            }}
          />

          <div style={{ padding: 20 }}>
            <h1
              style={{
                marginBottom: 10,
              }}
            >
              {car.name}
            </h1>

            <p
              style={{
                color: "#00ff99",
                fontSize: 28,
                marginBottom: 20,
              }}
            >
              ${car.price}
            </p>

            <p
              style={{
                color: "#ccc",
                lineHeight: 1.6,
                marginBottom: 30,
              }}
            >
              {car.description}
            </p>

            <button
              style={{
                width: "100%",
                padding: 16,
                borderRadius: 12,
                border: "none",
                background: "#00aa55",
                color: "white",
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              📞 დარეკვა
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}