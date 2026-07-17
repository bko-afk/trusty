import type { ReactNode } from 'react'

export function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="flex items-center gap-2.5 text-xl font-semibold">
      <span className="inline-block h-5 w-1.5 shrink-0 rounded-full bg-brand" />
      {children}
    </h2>
  )
}
