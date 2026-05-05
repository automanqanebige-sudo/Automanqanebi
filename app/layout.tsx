import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CurrencyProvider } from "../context/CurrencyContext";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AUTOMANQANEBI.GE | ავტომობილების მარკეტი",
  description: "საქართველოს ყველაზე დიდი ავტომობილების ონლაინ მარკეტი. იყიდე და გაყიდე მანქანები მარტივად და სწრაფად.",
  keywords: ["ავტომობილები", "მანქანები", "გაყიდვა", "ყიდვა", "საქართველო", "თბილისი"],
};

export const viewport: Viewport = {
  themeColor: "#16a34a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ka" className={`${inter.variable} bg-background`}>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <CurrencyProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </CurrencyProvider>
      </body>
    </html>
  );
}
