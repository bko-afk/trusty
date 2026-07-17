export function RatingCircle({ value, size = 'md' }: { value: number; size?: 'sm' | 'md' }) {
  const dims = size === 'sm' ? 'h-9 w-9 text-xs' : 'h-11 w-11 text-sm'
  const color =
    value >= 4 ? 'border-emerald-500 text-emerald-600' : value >= 2.5 ? 'border-amber-500 text-amber-600' : 'border-rose-500 text-rose-600'

  return (
    <span
      className={`flex ${dims} shrink-0 items-center justify-center rounded-full border-2 ${color} font-semibold bg-white`}
    >
      {value.toFixed(1)}
    </span>
  )
}
