'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

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
    'footer.description': 'საქართველოს ყველაზე დიდი ავტომობილების ონლაინ მარკეტი. იყიდე და გაყიდე მანქანები მარტივად.',
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
    'footer.description': 'Крупнейший онлайн-рынок автомобилей в Грузии. Покупайте и продавайте машины легко.',
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
    'footer.description': 'The largest online car marketplace in Georgia. Buy and sell cars with ease.',
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
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ka')

  useEffect(() => {
    const saved = window.localStorage.getItem('language') as Language | null
    if (saved === 'ka' || saved === 'ru' || saved === 'en') {
      setLanguageState(saved)
    }
  }, [])

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
