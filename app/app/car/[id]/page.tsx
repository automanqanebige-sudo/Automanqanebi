"use client";

import Link from "next/link";

const cars = [
  {
    id: 1,
    name: "BMW X5",
    price: "$15000",
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e",
    description: "ძალიან კომფორტული BMW X5 სრული პაკეტით.",
  },
  {
    id: 2,
    name: "Mercedes E-Class",
    price: "$13000",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
    description: "Mercedes E-Class იდეალურ მდგომარეობაში.",
  },
];

export default function CarPage({
  params,
}: {
  params: { id: string };
}) {
  const car = cars.find((c) => c.id === Number(params.id));

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
      <Link href="/">⬅ უკან</Link>

      <img
        src={car.image}
        alt={car.name}
        style={{
          width: "100%",
          borderRadius: 20,
          marginTop: 20,
        }}
      />

      <h1>{car.name}</h1>

      <h2>{car.price}</h2>

      <p>{car.description}</p>

      <button
        style={{
          background: "orange",
          color: "white",
          border: "none",
          padding: 15,
          borderRadius: 10,
          width: "100%",
          fontSize: 18,
        }}
      >
        📞 დარეკვა
      </button>
    </div>
  );
}