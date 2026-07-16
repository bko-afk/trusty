'use client'

import { useLanguage } from '@/i18n/LanguageContext'

export function RatingStars({ value, size = 'md' }: { value: number; size?: 'sm' | 'md' | 'lg' }) {
  const { locale } = useLanguage()
  const rounded = Math.round(value)
  const dims = { sm: 'text-sm', md: 'text-base', lg: 'text-2xl' }[size]
  const ariaLabel =
    locale === 'ru' ? `Рейтинг ${value} из 5` : locale === 'es' ? `Puntuación ${value} de 5` : `Rating ${value} of 5`

  return (
    <span className={`inline-flex items-center gap-0.5 ${dims}`} aria-label={ariaLabel}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < rounded ? 'text-amber-500' : 'text-gray-300'}>
          ★
        </span>
      ))}
    </span>
  )
}
