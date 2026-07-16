'use client'

import { useLanguage } from '@/i18n/LanguageContext'
import { locales, localeLabels } from '@/i18n/dictionary'

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage()

  return (
    <div className="flex items-center gap-1 rounded-full border border-gray-200 p-0.5 text-xs font-medium">
      {locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          className={`rounded-full px-2 py-1 transition-colors ${
            l === locale ? 'bg-brand text-white' : 'text-gray-500 hover:text-brand'
          }`}
          aria-pressed={l === locale}
        >
          {localeLabels[l]}
        </button>
      ))}
    </div>
  )
}
