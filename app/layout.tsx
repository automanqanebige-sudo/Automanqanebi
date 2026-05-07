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
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ka" className={`${inter.variable} dark`}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <CurrencyProvider>
          {children}
        </CurrencyProvider>
      </body>
    </html>
  );
}
