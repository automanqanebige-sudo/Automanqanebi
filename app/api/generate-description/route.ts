import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  const { brand, model, year, condition } = await req.json();

  const modelAI = genAI.getGenerativeModel({ model: "gemini-pro" });
  const prompt = `დამიწერე საინტერესო და მომხიბვლელი გასაყიდი განცხადების ტექსტი ქართულად შემდეგ მანქანაზე: 
  მარკა: ${brand}, მოდელი: ${model}, წელი: ${year}, მდგომარეობა: ${condition}. 
  ტექსტი უნდა იყოს მაქსიმუმ 3-4 წინადადება.`;

  const result = await modelAI.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  return NextResponse.json({ description: text });
}
