import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CurrencyProvider } from "../context/CurrencyContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "AUTOMANQANEBI | ავტომობილების პლატფორმა",
  description: "იყიდე და გაყიდე ავტომობილები საუკეთესო ფასად",
};

export const viewport: Viewport = {
  themeColor: "#0d1117",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ka" className={`${inter.variable} dark bg-background antialiased`}>
      <body className="font-sans">
        <CurrencyProvider>
          {children}
        </CurrencyProvider>
      </body>
    </html>
  );
}
