import { NextResponse } from "next/server";
import { collection, getDocs, addDoc } from "firebase/firestore/lite";
import { db } from "@/lib/firebase";

export const runtime = "nodejs";

export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, "cars"));
    const cars: unknown[] = [];

    querySnapshot.forEach((docSnap) => {
      cars.push({
        id: docSnap.id,
        ...docSnap.data(),
      });
    });

    return NextResponse.json(cars, { status: 200 });
  } catch (error) {
    console.error("GET ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch cars" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.name || !body.price) {
      return NextResponse.json({ error: "Name and price are required" }, { status: 400 });
    }

    const docRef = await addDoc(collection(db, "cars"), {
      name: body.name,
      price: body.price,
      createdAt: new Date(),
    });

    return NextResponse.json({ id: docRef.id, message: "Car added successfully" }, { status: 201 });
  } catch (error) {
    console.error("POST ERROR:", error);
    return NextResponse.json({ error: "Failed to add car" }, { status: 500 });
  }
}
