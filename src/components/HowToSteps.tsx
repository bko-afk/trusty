type Step = { title: string; text: string }

export function HowToSteps({
  title,
  subtitle,
  steps,
  compact = false,
}: {
  title: string
  subtitle: string
  steps: Step[]
  compact?: boolean
}) {
  return (
    <section className={compact ? 'border border-gray-200 bg-white p-6' : 'mb-8'}>
      <div className={`flex flex-wrap gap-x-2 gap-y-1 ${compact ? 'items-start' : 'mb-4 items-baseline'}`}>
        <h2 className="text-lg font-extrabold text-brand-dark">{title}</h2>
        <span className="text-sm font-semibold text-brand">{subtitle}</span>
      </div>
      <div className={compact ? 'mt-5' : 'grid gap-4 sm:grid-cols-3'}>
        {steps.map((step, i) => (
          <div key={step.title} className={compact ? 'relative flex gap-4 pb-6 last:pb-0' : 'relative border border-gray-200 bg-white p-5'}>
            {compact && i < steps.length - 1 && <span aria-hidden="true" className="absolute left-[15px] top-8 h-[calc(100%-1.75rem)] w-px bg-gray-200" />}
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white ${compact ? '' : 'mb-4'}`}>
              {i + 1}
            </div>
            <div>
              <div className="mb-1 font-bold text-brand-dark">{step.title}</div>
              <p className="text-sm leading-relaxed text-gray-500">{step.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
