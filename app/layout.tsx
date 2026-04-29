import type { Metadata } from "next";
import "./globals.css"; // ეს ხაზი აუცილებელია Tailwind-ისთვის!
import Navbar from "../components/Navbar";

export const metadata: Metadata = {
  title: "AUTOMANQANEBI",
  description: "საუკეთესო ავტო პლატფორმა",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ka">
      <body className="antialiased bg-gray-50">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
