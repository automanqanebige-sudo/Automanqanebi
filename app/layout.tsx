import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import { CurrencyProvider } from "../context/CurrencyContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AUTOMANQANEBI | ავტომობილების პლატფორმა",
  description: "იყიდე და გაყიდე ავტომობილები საუკეთესო ფასად",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ka">
      <body className={`${inter.className} bg-gray-50 antialiased`}>
        <CurrencyProvider>
          {/* ნავიგაცია */}
          <Navbar />
          
          {/* მთავარი კონტენტი */}
          <main className="min-h-screen">
            {children}
          </main>
          
          {/* აქ შეგიძლიათ მოგვიანებით Footer დაამატოთ */}
        </CurrencyProvider>
      </body>
    </html>
  );
}
