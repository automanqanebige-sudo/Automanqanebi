"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import {
  useParams,
  useRouter,
} from "next/navigation";

export default function EditCar() {
  const params = useParams();

  const router = useRouter();

  const [name, setName] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [image, setImage] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  // წამოღება

  const fetchCar = async () => {
    try {
      const docRef = doc(
        db,
        "cars",
        params.id as string
      );

      const docSnap =
        await getDoc(docRef);

      if (docSnap.exists()) {
        const data =
          docSnap.data();

        setName(data.name);

        setPrice(data.price);

        setImage(data.image);
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchCar();
  }, []);

  // განახლება

  const updateCar = async () => {
    if (
      !name ||
      !price ||
      !image
    ) {
      alert("შეავსე ყველა ველი");

      return;
    }

    try {
      const docRef = doc(
        db,
        "cars",
        params.id as string
      );

      await updateDoc(docRef, {
        name,
        price,
        image,
      });

      alert(
        "განახლდა წარმატებით ✅"
      );

      router.push("/");
    } catch (error) {
      console.log(error);

      alert("შეცდომა");
    }
  };

  if (loading) {
    return (
      <div
        style={{
          background: "#111",
          minHeight: "100vh",
          color: "white",
          display: "flex",
          justifyContent:
            "center",
          alignItems: "center",
        }}
      >
        იტვირთება...
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
          maxWidth: 500,
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            marginBottom: 20,
          }}
        >
          ✏️ რედაქტირება
        </h1>

        {/* NAME */}

        <input
          placeholder="მანქანის სახელი"
          value={name}
          onChange={(e) =>
            setName(
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
          placeholder="სურათის URL"
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

        {/* PREVIEW */}

        {image && (
          <img
            src={image}
            alt="preview"
            style={{
              width: "100%",
              height: 220,
              objectFit: "cover",
              borderRadius: 20,
              marginBottom: 20,
            }}
          />
        )}

        {/* BUTTON */}

        <button
          onClick={updateCar}
          style={{
            width: "100%",
            padding: 16,
            borderRadius: 14,
            border: "none",
            background: "#0066ff",
            color: "white",
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          💾 შენახვა
        </button>
      </div>
    </div>
  );
}