export function WhyBlock({ title, text }: { title: string; text: string }) {
  return (
    <section className="relative overflow-hidden border border-brand-light bg-[#f7f3ff] p-6">
      <span aria-hidden="true" className="absolute -right-8 -top-8 h-24 w-24 rounded-full border-[18px] border-brand/5" />
      <div className="relative">
        <span className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-brand text-lg font-black text-white">?</span>
        <h2 className="mb-2 text-lg font-extrabold text-brand-dark">{title}</h2>
        <p className="text-sm leading-6 text-gray-600">{text}</p>
      </div>
    </section>
  )
}
