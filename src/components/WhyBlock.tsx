export function WhyBlock({ title, text }: { title: string; text: string }) {
  return (
    <section className="relative overflow-hidden border border-[#d8ebea] bg-[#f4fbfa] p-6">
      <span aria-hidden="true" className="absolute -right-8 -top-8 h-24 w-24 rounded-full border-[18px] border-[#579c9e]/10" />
      <div className="relative">
        <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#dff2f1] text-[#397f81]" aria-hidden="true"><svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"/><path d="M9.6 9a2.5 2.5 0 1 1 3.4 2.3c-.7.3-1 .8-1 1.7"/><path d="M12 17h.01"/></svg></span>
        <h2 className="mb-2 text-lg font-extrabold text-brand-dark">{title}</h2>
        <p className="text-sm leading-6 text-gray-600">{text}</p>
      </div>
    </section>
  )
}
