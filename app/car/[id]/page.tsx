"use client";

import Link from "next/link";

const cars = [
  {
    id: 1,
    name: "BMW X5",
    price: 15000,
    description:
      "ძალიან კომფორტული და სწრაფი SUV.",
  },
  {
    id: 2,
    name: "Mercedes E-Class",
    price: 13000,
    description:
      "ელეგანტური და ეკონომიური მანქანა.",
  },
  {
    id: 3,
    name: "Toyota Camry",
    price: 10000,
    description:
      "გამძლე და საიმედო სედანი.",
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
    return <h1>მანქანა ვერ მოიძებნა</h1>;
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
          }}
        >
          ⬅ უკან
        </button>
      </Link>

      <h1>{car.name}</h1>

      <p
        style={{
          color: "#00ff99",
          fontSize: 24,
        }}
      >
        ${car.price}
      </p>

      <p>{car.description}</p>
    </div>
  );
}