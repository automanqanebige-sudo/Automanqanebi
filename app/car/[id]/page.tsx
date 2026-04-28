"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

const defaultCars = [
  {
    id: 1,
    name: "BMW X5",
    price: 15000,
    year: 2020,
    mileage: "85,000 KM",
    engine: "3.0 Turbo",
    phone: "+995599123456",
    description:
      "იდეალურ მდგომარეობაში. ახალი ჩამოყვანილი.",
    images: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e",
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
    ],
  },

  {
    id: 2,
    name: "Mercedes E-Class",
    price: 13000,
    year: 2019,
    mileage: "120,000 KM",
    engine: "2.0",
    phone: "+995599123456",
    description:
      "სუფთა მანქანა იდეალურ მდგომარეობაში.",
    images: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8",
    ],
  },

  {
    id: 3,
    name: "Toyota Camry",
    price: 10000,
    year: 2018,
    mileage: "140,000 KM",
    engine: "2.5",
    phone: "+995599123456",
    description:
      "ეკონომიური და გამძლე მანქანა.",
    images: [
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341",
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7",
    ],
  },
];

export default function CarDetails() {
  const params = useParams();

  const [car, setCar] = useState<any>(null);

  const [mainImage, setMainImage] =
    useState("");

  useEffect(() => {
    const savedCars = JSON.parse(
      localStorage.getItem("userCars") ||
        "[]"
    );

    const allCars = [
      ...defaultCars,
      ...savedCars,
    ];

    const foundCar = allCars.find(
      (c) => c.id === Number(params.id)
    );

    setCar(foundCar);

    if (foundCar?.images?.length > 0) {
      setMainImage(foundCar.images[0]);
    } else if (foundCar?.image) {
      setMainImage(foundCar.image);
    }
  }, [params.id]);

  if (!car) {
    return (
      <div
        style={{
          color: "white",
          padding: 30,
          background: "#111",
          minHeight: "100vh",
        }}
      >
        მანქანა ვერ მოიძებნა
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
              marginBottom: 20,
              padding: 12,
              borderRadius: 12,
              border: "none",
              background: "#222",
              color: "white",
            }}
          >
            ⬅️ უკან
          </button>
        </Link>

        <div
          style={{
            background: "#1e1e1e",
            borderRadius: 24,
            overflow: "hidden",
          }}
        >
          <img
            src={mainImage}
            alt={car.name}
            style={{
              width: "100%",
              height: 350,
              objectFit: "cover",
            }}
          />

          <div
            style={{
              display: "flex",
              gap: 10,
              padding: 10,
              overflowX: "auto",
            }}
          >
            {(car.images || [car.image]).map(
              (
                img: string,
                index: number
              ) => (
                <img
                  key={index}
                  src={img}
                  onClick={() =>
                    setMainImage(img)
                  }
                  style={{
                    width: 90,
                    height: 70,
                    objectFit: "cover",
                    borderRadius: 10,
                    cursor: "pointer",
                    border:
                      mainImage === img
                        ? "3px solid #00ff99"
                        : "2px solid #333",
                  }}
                />
              )
            )}
          </div>

          <div style={{ padding: 24 }}>
            <h1
              style={{
                fontSize: 34,
                marginBottom: 10,
              }}
            >
              {car.name}
            </h1>

            <h2
              style={{
                color: "#00ff99",
                fontSize: 32,
                marginBottom: 20,
              }}
            >
              ${car.price}
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 1fr",
                gap: 14,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  background: "#222",
                  padding: 16,
                  borderRadius: 14,
                }}
              >
                📅 წელი
                <br />
                <b>{car.year}</b>
              </div>

              <div
                style={{
                  background: "#222",
                  padding: 16,
                  borderRadius: 14,
                }}
              >
                🚘 გარბენი
                <br />
                <b>{car.mileage}</b>
              </div>

              <div
                style={{
                  background: "#222",
                  padding: 16,
                  borderRadius: 14,
                }}
              >
                ⚙️ ძრავი
                <br />
                <b>{car.engine}</b>
              </div>

              <div
                style={{
                  background: "#222",
                  padding: 16,
                  borderRadius: 14,
                }}
              >
                📞 ნომერი
                <br />
                <b>{car.phone}</b>
              </div>
            </div>

            <div
              style={{
                background: "#222",
                padding: 20,
                borderRadius: 16,
                marginBottom: 20,
                lineHeight: 1.7,
              }}
            >
              <h3
                style={{
                  marginBottom: 10,
                }}
              >
                📝 აღწერა
              </h3>

              {car.description}
            </div>

            <div
              style={{
                display: "flex",
                gap: 10,
              }}
            >
              <a
                href={`tel:${car.phone}`}
                style={{
                  flex: 1,
                }}
              >
                <button
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
                  📞 დარეკვა
                </button>
              </a>

              <a
                href={`https://wa.me/${car.phone.replace(
                  "+",
                  ""
                )}`}
                target="_blank"
              >
                <button
                  style={{
                    padding: 16,
                    borderRadius: 14,
                    border: "none",
                    background: "#25D366",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 18,
                  }}
                >
                  WhatsApp
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}