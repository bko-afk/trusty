'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { dictionary, locales, type Locale } from './dictionary'

type LanguageContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (typeof dictionary)['ru']
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

const STORAGE_KEY = 'trusty-locale'

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('ru')

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Locale | null
    if (stored && locales.includes(stored)) {
      setLocaleState(stored)
      return
    }
    // Если ранее язык не выбирался — пробуем определить по языку браузера
    const browserLang = window.navigator.language?.slice(0, 2)
    if (browserLang === 'en' || browserLang === 'es') {
      setLocaleState(browserLang)
    }
  }, [])

  function setLocale(next: Locale) {
    setLocaleState(next)
    window.localStorage.setItem(STORAGE_KEY, next)
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t: dictionary[locale] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return ctx
}
