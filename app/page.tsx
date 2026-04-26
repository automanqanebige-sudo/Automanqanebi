"use client";
import { useState } from "react";

const cars = [
  { id: 1, name: "BMW X5", price: 15000 },
  { id: 2, name: "Mercedes E-Class", price: 13000 },
  { id: 3, name: "Toyota Camry", price: 10000 },
];

export default function Home() {
  const [search, setSearch] = useState("");

  const filteredCars = cars.filter((car) =>
    car.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: 20 }}>
      <h1>🚗 ავტომანქანები</h1>

      <input
        placeholder="ძებნა..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: 10, width: "100%", marginBottom: 20 }}
      />

      {filteredCars.map((car) => (
        <div key={car.id} style={{ marginBottom: 20 }}>
          <h2>{car.name}</h2>
          <p>${car.price}</p>
        </div>
      ))}
    </div>
  );
}