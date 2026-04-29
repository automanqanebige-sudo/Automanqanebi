import type { Metadata } from "next";
import { Inter } from "next/font/google"; // თანამედროვე ფონტი
import "./globals.css"; // Tailwind-ის სტილები
import Navbar from "../components/Navbar";

// ფონტის კონფიგურაცია
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AUTOMANQANEBI | ავტომანქანების პლატფორმა",
  description: "იყიდე, გაყიდე და იქირავე ავტომობილები საქართველოში",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ka">
      <body className={`${inter.className} bg-gray-50 antialiased`}>
        {/* ნავიგაცია გამოჩნდება ყველა გვერდზე */}
        <Navbar />
        
        {/* მთავარი კონტენტი */}
        <div className="min-h-screen">
          {children}
        </div>

        {/* აქ შეგიძლია მომავალში Footer დაამატო */}
      </body>
    </html>
  );
}
