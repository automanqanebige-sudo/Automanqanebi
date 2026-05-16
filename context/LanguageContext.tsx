'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { SITE_DOMAIN } from '@/lib/site'

export type Language = 'ka' | 'ru' | 'en'

type LanguageContextType = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const messages: Record<Language, Record<string, string>> = {
  ka: {
    'nav.home': 'მთავარი',
    'nav.addCar': 'დამატება',
    'nav.favorites': 'ფავორიტები',
    'nav.profile': 'პროფილი',
    'nav.chat': 'ჩატი',
    'nav.login': 'შესვლა',
    'nav.register': 'რეგისტრაცია',
    'nav.language': 'ენა',
    'footer.description': `${SITE_DOMAIN} — საქართველოს ყველაზე დიდი ავტომობილების ონლაინ მარკეტი. იყიდე და გაყიდე მანქანები მარტივად.`,
    'footer.marketplace': 'მარკეტი',
    'footer.account': 'ანგარიში',
    'footer.contact': 'კონტაქტი',
    'footer.about': 'ჩვენს შესახებ',
    'footer.privacy': 'კონფიდენციალურობა',
    'footer.terms': 'წესები და პირობები',
    'footer.messages': 'შეტყობინებები',
    'footer.addCar': 'მანქანის დამატება',
    'footer.allRights': 'ყველა უფლება დაცულია.',
    'footer.location': 'თბილისი, საქართველო',
    'home.hero.title': 'იპოვე შენი იდეალური მანქანა',
    'home.hero.subtitle': 'დაათვალიერე ათასობით ხარისხიანი ავტომობილი საქართველოს სანდო გამყიდველებისგან',
    'home.allListings': 'ყველა განცხადება',
    'home.listing': 'განცხადება',
    'home.listings': 'განცხადება',
    'home.found': 'ნაპოვნია',
    'home.sortBy': 'დალაგება',
    'home.sort.featured': 'გამორჩეული',
    'home.sort.priceLow': 'ფასი: ზრდადობით',
    'home.sort.priceHigh': 'ფასი: კლებადობით',
    'home.sort.mileage': 'ყველაზე ნაკლები გარბენი',
    'home.sort.year': 'ახალი წელი',
    'home.empty.title': 'მანქანა ვერ მოიძებნა',
    'home.empty.desc': 'შენს კრიტერიუმებს არც ერთი განცხადება არ შეესაბამება. სცადე ფილტრების შეცვლა.',
    'home.empty.clear': 'ფილტრების გასუფთავება',
    'search.placeholder': 'ძებნა მარკით ან მოდელით (მაგ. BMW, Mercedes)...',
    'search.button': 'ძებნა',
    'search.priceRange': 'ფასის დიაპაზონი',
    'search.minPrice': 'მინ. ფასი',
    'search.maxPrice': 'მაქს. ფასი',
    'search.from': 'დან',
    'search.to': 'მდე',
    'search.year': 'წელი',
    'search.minYear': 'მინ. წელი',
    'search.maxYear': 'მაქს. წელი',
    'search.fuelType': 'საწვავის ტიპი',
    'search.allFuel': 'ყველა ტიპი',
    'search.transmission': 'გადაცემათა კოლოფი',
    'search.allTransmission': 'ყველა ტიპი',
    'search.showMore': 'მეტი ფილტრი',
    'search.hideMore': 'ფილტრების დამალვა',
    'search.reset': 'გასუფთავება',
    'search.any': 'ნებისმიერი',
    'vip.title': 'VIP განცხადებები',
    'vip.subtitle': 'პრემიუმ მანქანები დამოწმებული გამყიდველებისგან',
    'vip.viewAll': 'ყველა VIP განცხადება',
    'car.back': 'უკან სიაში',
    'car.contact': 'გამყიდველთან დაკავშირება',
    'car.specs': 'მახასიათებლები',
    'car.year': 'წელი',
    'car.mileage': 'გარბენი',
    'car.fuel': 'საწვავი',
    'car.transmission': 'გადაცემათა კოლოფი',
    'car.location': 'მდებარეობა',
    'car.notFound': 'განცხადება ვერ მოიძებნა',
    'car.loading': 'იტვირთება...',
    'car.noImage': 'ფოტო არ არის',
    'car.addFavorite': 'ფავორიტებში',
    'car.removeFavorite': 'ფავორიტებიდან წაშლა',
    'fuel.Petrol': 'ბენზინი',
    'fuel.Diesel': 'დიზელი',
    'fuel.Hybrid': 'ჰიბრიდი',
    'fuel.Electric': 'ელექტრო',
    'fuel.LPG': 'გაზი (LPG)',
    'transmission.Automatic': 'ავტომატიკა',
    'transmission.Manual': 'მექანიკა',
    'transmission.Semi-Automatic': 'ნახევრ ავტომატიკა',
    'favorites.title': 'ფავორიტები',
    'favorites.empty': 'ფავორიტებში ჯერ არაფერი გაქვს დამატებული',
  },
  ru: {
    'nav.home': 'Главная',
    'nav.addCar': 'Добавить',
    'nav.favorites': 'Избранное',
    'nav.profile': 'Профиль',
    'nav.chat': 'Чат',
    'nav.login': 'Войти',
    'nav.register': 'Регистрация',
    'nav.language': 'Язык',
    'footer.description': `${SITE_DOMAIN} — крупнейший онлайн-рынок автомобилей в Грузии. Покупайте и продавайте машины легко.`,
    'footer.marketplace': 'Маркет',
    'footer.account': 'Аккаунт',
    'footer.contact': 'Контакты',
    'footer.about': 'О нас',
    'footer.privacy': 'Конфиденциальность',
    'footer.terms': 'Правила и условия',
    'footer.messages': 'Сообщения',
    'footer.addCar': 'Добавить авто',
    'footer.allRights': 'Все права защищены.',
    'footer.location': 'Тбилиси, Грузия',
    'home.hero.title': 'Найдите идеальный автомобиль',
    'home.hero.subtitle': 'Тысячи качественных авто от проверенных продавцов в Грузии',
    'home.allListings': 'Все объявления',
    'home.listing': 'объявление',
    'home.listings': 'объявлений',
    'home.found': 'найдено',
    'home.sortBy': 'Сортировка',
    'home.sort.featured': 'Рекомендуемые',
    'home.sort.priceLow': 'Цена: по возрастанию',
    'home.sort.priceHigh': 'Цена: по убыванию',
    'home.sort.mileage': 'Минимальный пробег',
    'home.sort.year': 'Новее по году',
    'home.empty.title': 'Авто не найдено',
    'home.empty.desc': 'По вашим критериям ничего не найдено. Измените фильтры.',
    'home.empty.clear': 'Сбросить фильтры',
    'search.placeholder': 'Поиск по марке или модели...',
    'search.button': 'Поиск',
    'search.priceRange': 'Цена',
    'search.minPrice': 'Мин. цена',
    'search.maxPrice': 'Макс. цена',
    'search.from': 'От',
    'search.to': 'До',
    'search.year': 'Год',
    'search.minYear': 'Мин. год',
    'search.maxYear': 'Макс. год',
    'search.fuelType': 'Топливо',
    'search.allFuel': 'Все типы',
    'search.transmission': 'Коробка',
    'search.allTransmission': 'Все типы',
    'search.showMore': 'Больше фильтров',
    'search.hideMore': 'Скрыть фильтры',
    'search.reset': 'Сбросить',
    'search.any': 'Любой',
    'vip.title': 'VIP объявления',
    'vip.subtitle': 'Премиум авто от проверенных продавцов',
    'vip.viewAll': 'Все VIP объявления',
    'car.back': 'Назад к списку',
    'car.contact': 'Связаться с продавцом',
    'car.specs': 'Характеристики',
    'car.year': 'Год',
    'car.mileage': 'Пробег',
    'car.fuel': 'Топливо',
    'car.transmission': 'Коробка',
    'car.location': 'Местоположение',
    'car.notFound': 'Объявление не найдено',
    'car.loading': 'Загрузка...',
    'car.noImage': 'Нет фото',
    'car.addFavorite': 'В избранное',
    'car.removeFavorite': 'Убрать из избранного',
    'fuel.Petrol': 'Бензин',
    'fuel.Diesel': 'Дизель',
    'fuel.Hybrid': 'Гибрид',
    'fuel.Electric': 'Электро',
    'fuel.LPG': 'Газ (LPG)',
    'transmission.Automatic': 'Автомат',
    'transmission.Manual': 'Механика',
    'transmission.Semi-Automatic': 'Робот',
    'favorites.title': 'Избранное',
    'favorites.empty': 'В избранном пока пусто',
  },
  en: {
    'nav.home': 'Home',
    'nav.addCar': 'Add Car',
    'nav.favorites': 'Favorites',
    'nav.profile': 'Profile',
    'nav.chat': 'Chat',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.language': 'Language',
    'footer.description': `${SITE_DOMAIN} — the largest online car marketplace in Georgia. Buy and sell cars with ease.`,
    'footer.marketplace': 'Marketplace',
    'footer.account': 'Account',
    'footer.contact': 'Contact',
    'footer.about': 'About Us',
    'footer.privacy': 'Privacy',
    'footer.terms': 'Terms and Conditions',
    'footer.messages': 'Messages',
    'footer.addCar': 'Add Car',
    'footer.allRights': 'All rights reserved.',
    'footer.location': 'Tbilisi, Georgia',
    'home.hero.title': 'Find Your Perfect Car',
    'home.hero.subtitle': 'Browse thousands of quality vehicles from trusted sellers across Georgia',
    'home.allListings': 'All Listings',
    'home.listing': 'listing',
    'home.listings': 'listings',
    'home.found': 'found',
    'home.sortBy': 'Sort by',
    'home.sort.featured': 'Featured',
    'home.sort.priceLow': 'Price: Low to High',
    'home.sort.priceHigh': 'Price: High to Low',
    'home.sort.mileage': 'Lowest Mileage',
    'home.sort.year': 'Newest Year',
    'home.empty.title': 'No cars found',
    'home.empty.desc': "We couldn't find any cars matching your criteria. Try adjusting your filters.",
    'home.empty.clear': 'Clear all filters',
    'search.placeholder': 'Search by brand or model (e.g. BMW, Mercedes)...',
    'search.button': 'Search',
    'search.priceRange': 'Price Range',
    'search.minPrice': 'Min Price',
    'search.maxPrice': 'Max Price',
    'search.from': 'From',
    'search.to': 'To',
    'search.year': 'Year',
    'search.minYear': 'Min Year',
    'search.maxYear': 'Max Year',
    'search.fuelType': 'Fuel Type',
    'search.allFuel': 'All Fuel Types',
    'search.transmission': 'Transmission',
    'search.allTransmission': 'All Transmissions',
    'search.showMore': 'Show more filters',
    'search.hideMore': 'Hide filters',
    'search.reset': 'Reset Filters',
    'search.any': 'Any',
    'vip.title': 'VIP Listings',
    'vip.subtitle': 'Premium vehicles from verified sellers',
    'vip.viewAll': 'View All VIP Listings',
    'car.back': 'Back to listings',
    'car.contact': 'Contact Seller',
    'car.specs': 'Specifications',
    'car.year': 'Year',
    'car.mileage': 'Mileage',
    'car.fuel': 'Fuel',
    'car.transmission': 'Transmission',
    'car.location': 'Location',
    'car.notFound': 'Listing not found',
    'car.loading': 'Loading...',
    'car.noImage': 'No image',
    'car.addFavorite': 'Add to favorites',
    'car.removeFavorite': 'Remove from favorites',
    'fuel.Petrol': 'Petrol',
    'fuel.Diesel': 'Diesel',
    'fuel.Hybrid': 'Hybrid',
    'fuel.Electric': 'Electric',
    'fuel.LPG': 'LPG',
    'transmission.Automatic': 'Automatic',
    'transmission.Manual': 'Manual',
    'transmission.Semi-Automatic': 'Semi-Automatic',
    'favorites.title': 'Favorites',
    'favorites.empty': 'No favorites yet',
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

/** Matches next-intl middleware URLs like /ka/..., /en/add-car (localePrefix: 'always'). */
function localeFromPathname(pathname: string): Language | null {
  const first = pathname.split('/').filter(Boolean)[0]
  if (first === 'ka' || first === 'ru' || first === 'en') return first
  return null
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [language, setLanguageState] = useState<Language>('ka')

  const urlLocale = localeFromPathname(pathname)

  useEffect(() => {
    if (urlLocale) {
      setLanguageState(urlLocale)
      window.localStorage.setItem('language', urlLocale)
      return
    }
    const saved = window.localStorage.getItem('language') as Language | null
    if (saved === 'ka' || saved === 'ru' || saved === 'en') {
      setLanguageState(saved)
    }
  }, [urlLocale])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    window.localStorage.setItem('language', lang)
  }

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: (key: string) => messages[language][key] ?? key,
    }),
    [language]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
