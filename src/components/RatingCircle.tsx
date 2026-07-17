export function RatingCircle({ value, size = 'md' }: { value: number; size?: 'sm' | 'md' }) {
  const dims = size === 'sm' ? 'h-9 w-9 text-xs' : 'h-11 w-11 text-sm'

  return (
    <span
      className={`flex ${dims} shrink-0 items-center justify-center rounded-full border-2 border-brand-dark text-brand-dark font-semibold bg-white`}
    >
      {value.toFixed(1)}
    </span>
  )
}
