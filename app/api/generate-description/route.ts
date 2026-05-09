import { NextResponse } from "next/server";
import { collection, getDocs } from "firebase/firestore/lite";
import { getDb } from "@/lib/firebase";

export const runtime = "nodejs";

/** სია / დებაგი — პირდაპირ Firestore-იდან */
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

/**
 * AI აღწერის ღილაკი add-car გვერდზე — ტან აგზავნის { brand, model, year }.
 * (სრული GenAI შეგიძლია მერე დაამატო; ახლა სტაბილური ტექსტი დაბრუნდება.)
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const brand = String(body?.brand ?? "").trim();
    const model = String(body?.model ?? "").trim();
    const yearRaw = body?.year;
    const year =
      yearRaw !== undefined && yearRaw !== null && String(yearRaw).trim() !== ""
        ? String(yearRaw).trim()
        : "";

    if (!brand || !model) {
      return NextResponse.json(
        { error: "Brand and model are required" },
        { status: 400 },
      );
    }

    const description = [
      `${brand} ${model}${year ? `, ${year} წლის` : ""}. `,
      "მოკლე შეფასება: გირჩევთ გადაამოწმოთ ტექნიკური მდგომარეობა, სერვისის ისტორია და იურიდიული დოკუმენტები გარიგებამდე. ",
      "დამატებითი დეტალები და ფოტოები გაზრდის განცხადების სანდოობას.",
    ].join("");

    return NextResponse.json({ description });
  } catch (error) {
    console.error("POST ERROR:", error);
    return NextResponse.json({ error: "Failed to generate description" }, { status: 500 });
  }
}
