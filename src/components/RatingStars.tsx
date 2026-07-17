'use client'

import { useLanguage } from '@/i18n/LanguageContext'

export function RatingStars({ value, size = 'md' }: { value: number; size?: 'sm' | 'md' | 'lg' }) {
  const { locale } = useLanguage()
  const rounded = Math.round(value)
  const box = { sm: 'h-4 w-4 text-[10px]', md: 'h-5 w-5 text-xs', lg: 'h-7 w-7 text-base' }[size]
  const ariaLabel =
    locale === 'ru' ? `Рейтинг ${value} из 5` : locale === 'es' ? `Puntuación ${value} de 5` : `Rating ${value} of 5`

  return (
    <span className="inline-flex items-center gap-0.5" aria-label={ariaLabel}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`flex items-center justify-center rounded ${box} ${
            i < rounded ? 'bg-brand text-white' : 'bg-gray-200 text-gray-400'
          }`}
        >
          ★
        </span>
      ))}
    </span>
  )
}
