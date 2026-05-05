import { NextResponse } from "next/server";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";

// ❗ ეს აუცილებელია Firebase-ისთვის
export const runtime = "nodejs";

// 🔐 Firebase config (აიღე .env-დან)
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY!,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.FIREBASE_PROJECT_ID!,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.FIREBASE_APP_ID!,
};

// 🔥 App initialization (ერთჯერადად)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

// =======================
// ✅ GET (მონაცემების წამოღება)
// =======================
export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, "cars"));

    const cars: any[] = [];

    querySnapshot.forEach((doc) => {
      cars.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return NextResponse.json(cars, { status: 200 });
  } catch (error) {
    console.error("GET ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch cars" },
      { status: 500 }
    );
  }
}

// =======================
// ✅ POST (ახალი მანქანის დამატება)
// =======================
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 🔒 basic validation
    if (!body.name || !body.price) {
      return NextResponse.json(
        { error: "Name and price are required" },
        { status: 400 }
      );
    }

    const docRef = await addDoc(collection(db, "cars"), {
      name: body.name,
      price: body.price,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { id: docRef.id, message: "Car added successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST ERROR:", error);

    return NextResponse.json(
      { error: "Failed to add car" },
      { status: 500 }
    );
  }
}
