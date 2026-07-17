type Step = { title: string; text: string }

export function HowToSteps({
  title,
  subtitle,
  steps,
}: {
  title: string
  subtitle: string
  steps: Step[]
}) {
  return (
    <section className="mb-8">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <span className="text-sm text-brand font-medium">{subtitle}</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {steps.map((step, i) => (
          <div key={i} className="card p-4 relative">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-white text-sm font-semibold mb-3">
              {i + 1}
            </div>
            <div className="font-medium mb-1">{step.title}</div>
            <p className="text-sm text-gray-500 leading-relaxed">{step.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
