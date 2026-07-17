'use client'

import { useState } from 'react'

export function FormRatingInput({
  name,
  label,
  defaultValue = 5,
  compact = false,
}: {
  name: string
  label: string
  defaultValue?: number
  compact?: boolean
}) {
  const [value, setValue] = useState(defaultValue)

  return (
    <div className={compact ? '' : 'rounded-sm border border-gray-200 bg-[#f8fafb] p-4'}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm font-bold text-brand-dark">{label}</span>
        <span className="text-sm font-extrabold text-brand">{value}/5</span>
      </div>
      <input type="hidden" name={name} value={value} />
      <div className="mt-2 flex gap-1" role="radiogroup" aria-label={label}>
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            role="radio"
            aria-checked={value === rating}
            aria-label={`${rating} / 5`}
            onClick={() => setValue(rating)}
            className="group rounded-sm p-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className={`${compact ? 'h-6 w-6' : 'h-8 w-8'} transition-colors ${rating <= value ? 'text-amber-400' : 'text-gray-200 group-hover:text-amber-200'}`}>
              <path fill="currentColor" d="m12 2.4 2.84 5.75 6.35.92-4.6 4.48 1.09 6.33L12 16.9l-5.68 2.98 1.09-6.33-4.6-4.48 6.35-.92L12 2.4Z" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  )
}
