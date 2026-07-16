export function RatingStars({ value, size = 'md' }: { value: number; size?: 'sm' | 'md' | 'lg' }) {
  const rounded = Math.round(value)
  const dims = { sm: 'text-sm', md: 'text-base', lg: 'text-2xl' }[size]

  return (
    <span className={`inline-flex items-center gap-0.5 ${dims}`} aria-label={`Рейтинг ${value} из 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < rounded ? 'text-amber-500' : 'text-gray-300'}>
          ★
        </span>
      ))}
    </span>
  )
}
