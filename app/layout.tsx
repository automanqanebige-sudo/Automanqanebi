import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CurrencyProvider } from "../context/CurrencyContext";
import { LanguageProvider } from "../context/LanguageContext";
import { SITE_DOMAIN, SITE_LOGO_MAIN, SITE_LOGO_TLD, SITE_URL } from "../lib/site";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const siteTitle = `${SITE_LOGO_MAIN}${SITE_LOGO_TLD}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${siteTitle} | ავტომობილების მარკეტი`,
  description: `საქართველოს ყველაზე დიდი ავტომობილების ონლაინ მარკეტი (${SITE_DOMAIN}). იყიდე და გაყიდე მანქანები მარტივად და სწრაფად.`,
  keywords: [
    SITE_DOMAIN,
    "automanqanebi",
    "ავტომობილები",
    "მანქანები",
    "გაყიდვა",
    "ყიდვა",
    "საქართველო",
    "თბილისი",
  ],
  applicationName: siteTitle,
  openGraph: {
    type: "website",
    locale: "ka_GE",
    url: SITE_URL,
    siteName: siteTitle,
    title: `${siteTitle} | ავტომობილების მარკეტი`,
  },
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
        <LanguageProvider>
          <CurrencyProvider>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </CurrencyProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
