import { NextResponse } from "next/server";
import { collection, getDocs, addDoc } from "firebase/firestore/lite";
import { getDb } from "@/lib/firebase";

export const runtime = "nodejs";

export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(getDb(), "cars"));
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

    const brand = typeof body?.brand === "string" ? body.brand.trim() : "";
    const model = typeof body?.model === "string" ? body.model.trim() : "";
    const year = body?.year != null && body.year !== "" ? String(body.year).trim() : "";

    if (brand && model && body?.name === undefined && body?.price === undefined) {
      const description = `${brand} ${model}${year ? ` (${year})` : ""} — საგამოძახებო კომპლექტაცია; დეტალებისთვის დაგვიკავშირდით.`;
      return NextResponse.json({ description });
    }

    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const price = body?.price;

    if (!name || price === undefined || price === null || price === "") {
      return NextResponse.json(
        { error: "Name and price are required" },
        { status: 400 },
      );
    }

    const docRef = await addDoc(collection(getDb(), "cars"), {
      name,
      price: Number(price),
      createdAt: new Date(),
    });

    return NextResponse.json({ id: docRef.id, message: "Car added successfully" }, { status: 201 });
  } catch (error) {
    console.error("POST ERROR:", error);
    return NextResponse.json({ error: "Failed to add car" }, { status: 500 });
  }
}
