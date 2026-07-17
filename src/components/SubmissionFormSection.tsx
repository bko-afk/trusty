import type { ReactNode } from 'react'

export function SubmissionFormSection({
  number,
  title,
  description,
  children,
}: {
  number: string
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <section className="border border-gray-200 bg-white p-5 shadow-[0_18px_55px_rgba(7,27,69,0.05)] sm:p-7">
      <div className="flex gap-4 border-b border-gray-100 pb-5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-extrabold text-white">{number}</span>
        <div>
          <h2 className="text-xl font-extrabold tracking-[-0.02em] text-brand-dark">{title}</h2>
          {description && <p className="mt-1 text-sm leading-6 text-gray-500">{description}</p>}
        </div>
      </div>
      <div className="mt-6 space-y-5">{children}</div>
    </section>
  )
}
