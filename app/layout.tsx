import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CurrencyProvider } from "../context/CurrencyContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "AUTOMANQANEBI.GE | ავტომობილების ყიდვა-გაყიდვა",
  description: "იყიდე და გაყიდე ავტომობილები საუკეთესო ფასად საქართველოში",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ka" className={inter.variable}>
      <body className="min-h-screen bg-[#0f172a] font-sans text-slate-100 antialiased">
        <CurrencyProvider>
          {children}
        </CurrencyProvider>
      </body>
    </html>
  );
}
