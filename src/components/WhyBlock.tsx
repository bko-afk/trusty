export function WhyBlock({ title, text }: { title: string; text: string }) {
  return (
    <section className="card p-6 mb-8 bg-brand-light/40 border-brand-light">
      <h2 className="text-lg font-semibold mb-2 text-brand-dark">{title}</h2>
      <p className="text-gray-600 leading-relaxed">{text}</p>
    </section>
  )
}
