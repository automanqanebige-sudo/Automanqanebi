import type { Metadata, Viewport } from 'next'
import { Inter, Noto_Sans_Georgian } from 'next/font/google'
import './globals.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import MobileBottomNav from '../components/MobileBottomNav'
import LoadingScreen from '../components/ui/LoadingScreen'
import PageTransition from '../components/ui/PageTransition'
import { CurrencyProvider } from '../context/CurrencyContext'
import { LanguageProvider } from '../context/LanguageContext'
import { SiteSettingsProvider } from '../context/SiteSettingsContext'
import { FavoritesProvider } from '../context/FavoritesContext'
import { CompareProvider } from '../context/CompareContext'
import { AuthProvider } from '../context/AuthContext'
import GoogleAuthRedirectHandler from '../components/auth/GoogleAuthRedirectHandler'
import MaintenanceBanner from '../components/MaintenanceBanner'
import { SiteBannersProvider } from '../context/SiteBannersContext'
import { SiteBannerGlobalStrip } from '../components/SiteBannerSlot'
import CompareBar from '../components/CompareBar'
import { SITE_DOMAIN, SITE_LOGO_MAIN, SITE_LOGO_TLD, SITE_URL } from '../lib/site'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const notoGeorgian = Noto_Sans_Georgian({
  subsets: ['georgian', 'latin'],
  variable: '--font-noto-georgian',
  weight: ['400', '500', '600', '700'],
})

const siteTitle = `${SITE_LOGO_MAIN}${SITE_LOGO_TLD}`

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${siteTitle} | ავტომობილების მარკეტი`,
  description: `საქართველოს ყველაზე დიდი ავტომობილების ონლაინ მარკეტი (${SITE_DOMAIN}). იყიდე და გაყიდე მანქანები მარტივად და სწრაფად.`,
  keywords: [
    SITE_DOMAIN,
    'automanqanebi',
    'ავტომობილები',
    'მანქანები',
    'გაყიდვა',
    'ყიდვა',
    'საქართველო',
    'თბილისი',
  ],
  applicationName: siteTitle,
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    type: 'website',
    locale: 'ka_GE',
    url: SITE_URL,
    siteName: siteTitle,
    title: `${siteTitle} | ავტომობილების მარკეტი`,
  },
}

export const viewport: Viewport = {
  themeColor: '#1a7a4c',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

const themeScript = `
(function(){
  try {
    var t = localStorage.getItem('theme');
    if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  } catch(e) {}
})();
`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ka" className={`${inter.variable} ${notoGeorgian.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-screen flex-col bg-background font-sans antialiased">
        <LanguageProvider>
          <AuthProvider>
            <GoogleAuthRedirectHandler />
            <CurrencyProvider>
              <SiteSettingsProvider>
                <SiteBannersProvider>
                  <FavoritesProvider>
                    <CompareProvider>
                      <LoadingScreen />
                      <Navbar />
                      <MaintenanceBanner />
                      <SiteBannerGlobalStrip placement="global_top" />
                      <main className="flex-1 pb-20 md:pb-0">
                        <PageTransition>{children}</PageTransition>
                      </main>
                      <SiteBannerGlobalStrip placement="global_footer" />
                      <Footer />
                      <MobileBottomNav />
                      <CompareBar />
                    </CompareProvider>
                  </FavoritesProvider>
                </SiteBannersProvider>
              </SiteSettingsProvider>
            </CurrencyProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
