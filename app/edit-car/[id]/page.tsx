"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditCar({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    const cars = JSON.parse(
      localStorage.getItem("userCars") ||
        "[]"
    );

    const car = cars.find(
      (c: any) =>
        c.id === Number(params.id)
    );

    if (car) {
      setName(car.name);
      setPrice(car.price);
      setImage(car.image);
    }
  }, [params.id]);

  const updateCar = () => {
    const cars = JSON.parse(
      localStorage.getItem("userCars") ||
        "[]"
    );

    const updatedCars = cars.map(
      (car: any) => {
        if (
          car.id === Number(params.id)
        ) {
          return {
            ...car,
            name,
            price,
            image,
          };
        }

        return car;
      }
    );

    localStorage.setItem(
      "userCars",
      JSON.stringify(updatedCars)
    );

    alert("განახლდა ✏️");

    router.push("/");
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
          ✏️ მანქანის შეცვლა
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
          onClick={updateCar}
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
      </div>
    </div>
  );
}