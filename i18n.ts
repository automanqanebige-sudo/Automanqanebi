import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';

export const locales = ['ka', 'en', 'ru'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'ka';

export const localeNames: Record<Locale, string> = {
  ka: 'ქართული',
  en: 'English',
  ru: 'Русский',
};

export const localeFlags: Record<Locale, string> = {
  ka: '🇬🇪',
  en: '🇬🇧',
  ru: '🇷🇺',
};

function getLocaleFromBrowser(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale;
  
  const browserLocales = acceptLanguage.split(',').map(l => l.split(';')[0].trim().toLowerCase());
  
  for (const browserLocale of browserLocales) {
    if (browserLocale.startsWith('ka')) return 'ka';
    if (browserLocale.startsWith('en')) return 'en';
    if (browserLocale.startsWith('ru')) return 'ru';
  }
  
  return defaultLocale;
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const headerStore = await headers();
  
  // Check cookie first
  const cookieLocale = cookieStore.get('locale')?.value as Locale | undefined;
  
  // Then check browser language
  const acceptLanguage = headerStore.get('accept-language');
  const browserLocale = getLocaleFromBrowser(acceptLanguage);
  
  // Use cookie locale if valid, otherwise browser locale, fallback to default
  const locale = cookieLocale && locales.includes(cookieLocale) 
    ? cookieLocale 
    : browserLocale;
  
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
