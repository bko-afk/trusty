'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { HowToSteps } from '@/components/HowToSteps'
import { WhyBlock } from '@/components/WhyBlock'
import { SubmissionFormSection } from '@/components/SubmissionFormSection'
import { useLanguage } from '@/i18n/LanguageContext'
import { useCustomer } from '@/lib/useCustomer'

type Company = { id: string; name: string; slug: string }

export function AddComplaintForm({
  companies,
  preselectedSlug,
}: {
  companies: Company[]
  preselectedSlug?: string
}) {
  const { t } = useLanguage()
  const { customer } = useCustomer()
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const resultRef = useRef<HTMLDivElement>(null)
  const preselected = companies.find((c) => c.slug === preselectedSlug)

  useEffect(() => {
    if (status !== 'success') return
    resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    resultRef.current?.focus({ preventScroll: true })
  }, [status])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // Сохраняем ссылку на форму заранее: после await браузер уже
    // сбрасывает e.currentTarget (это стандартное поведение DOM после
    // завершения обработки события), и обращение к нему кидало бы
    // ошибку — из-за которой форма показывала "не удалось отправить",
    // даже когда запрос на сервере прошёл успешно.
    const formEl = e.currentTarget
    setStatus('loading')

    const form = new FormData(formEl)

    try {
      const res = await fetch('/api/submissions/complaint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          company: Number(form.get('company')),
          authorName: form.get('authorName'),
          authorEmail: form.get('authorEmail'),
          title: form.get('title'),
          body: form.get('body'),
          contactWebsite: form.get('contactWebsite'),
        }),
      })
      setStatus(res.ok ? 'success' : 'error')
      if (res.ok) formEl.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="bg-[#f3f6f9] pb-14">
      <div className="container-page max-w-6xl pt-8">
        <Breadcrumbs items={[{ label: t.common.home, href: '/' }, { label: t.addComplaintPage.title }]} />

        <header className="relative overflow-hidden bg-[#071b45] px-6 py-8 text-white sm:px-9 lg:px-12 lg:py-10">
          <div aria-hidden="true" className="absolute -right-20 -top-24 h-72 w-72 rounded-full border-[52px] border-white/5" />
          <div className="relative max-w-3xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#80c5c7]">{t.addComplaintPage.formTitle}</p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-[-0.04em] sm:text-5xl">{t.addComplaintPage.title}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">{t.addComplaintPage.introText}</p>
          </div>
          <div className="absolute -right-2 bottom-6 hidden h-36 w-36 opacity-90 sm:block lg:right-14">
            <Image src="/images/pages/complaint.svg" alt="" fill className="object-contain" />
          </div>
        </header>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <main>
            {status === 'success' ? (
              <div ref={resultRef} tabIndex={-1} className="border border-emerald-200 bg-white p-8 shadow-[0_18px_55px_rgba(7,27,69,0.05)] outline-none">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-2xl font-bold text-emerald-700">✓</span>
                <h2 className="mt-5 text-2xl font-extrabold text-brand-dark">{t.addComplaintPage.successMsg}</h2>
                <p className="mt-3 text-gray-500">{t.addComplaintPage.subtitle}</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-6" aria-busy={status === 'loading'}>
                <input name="contactWebsite" type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
                <SubmissionFormSection number="1" title={t.addComplaintPage.step1Title} description={t.addComplaintPage.step1Text}>
                  <div>
                    <label htmlFor="complaint-company" className="form-label">{t.addComplaintPage.companyLabel}</label>
                    <select id="complaint-company" name="company" required defaultValue={preselected?.id || ''} className="form-control">
                      <option value="" disabled>{t.addComplaintPage.companyPlaceholder}</option>
                      {companies.map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}
                    </select>
                  </div>
                  {customer ? (
                    <div className="flex items-center gap-3 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 font-bold text-white">✓</span>
                      <span>{t.addComplaintPage.loggedInAs} <strong>{customer.name || customer.email}</strong></span>
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div><label htmlFor="complaint-author" className="form-label">{t.addComplaintPage.nameLabel}</label><input id="complaint-author" name="authorName" required minLength={2} maxLength={80} autoComplete="name" className="form-control" /></div>
                      <div><label htmlFor="complaint-email" className="form-label">{t.addComplaintPage.emailLabel}</label><input id="complaint-email" name="authorEmail" type="email" required maxLength={254} autoComplete="email" className="form-control" /></div>
                    </div>
                  )}
                </SubmissionFormSection>

                <SubmissionFormSection number="2" title={t.addComplaintPage.step2Title} description={t.addComplaintPage.step2Text}>
                  <div><label htmlFor="complaint-title" className="form-label">{t.addComplaintPage.titleLabel}</label><input id="complaint-title" name="title" required minLength={5} maxLength={160} className="form-control" /></div>
                  <div><label htmlFor="complaint-body" className="form-label">{t.addComplaintPage.bodyLabel}</label><textarea id="complaint-body" name="body" required minLength={30} maxLength={5000} rows={9} className="form-control" /><span className="form-help">{t.addComplaintPage.whyText}</span></div>
                </SubmissionFormSection>

                <SubmissionFormSection number="3" title={t.addComplaintPage.step3Title} description={t.addComplaintPage.step3Text}>
                  <label className="flex cursor-pointer items-start gap-3 border border-brand-light bg-[#f7f3ff] p-4 text-sm leading-6 text-gray-600">
                    <input type="checkbox" required className="mt-1 h-5 w-5 shrink-0 accent-brand" />
                    <span>{t.addComplaintPage.subtitle}</span>
                  </label>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="max-w-md text-sm leading-6 text-gray-500">{t.addComplaintPage.stepsSubtitle}</p>
                    <button type="submit" disabled={status === 'loading'} className="btn-primary min-h-12 min-w-44 disabled:cursor-wait disabled:opacity-60">{status === 'loading' ? t.addComplaintPage.submittingBtn : t.addComplaintPage.submitBtn}</button>
                  </div>
                </SubmissionFormSection>
                {status === 'error' && <p role="alert" className="border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">{t.addComplaintPage.errorMsg}</p>}
              </form>
            )}
          </main>

          <aside className="space-y-5 lg:sticky lg:top-24">
            <HowToSteps compact title={t.addComplaintPage.stepsTitle} subtitle={t.addComplaintPage.stepsSubtitle} steps={[{ title: t.addComplaintPage.step1Title, text: t.addComplaintPage.step1Text }, { title: t.addComplaintPage.step2Title, text: t.addComplaintPage.step2Text }, { title: t.addComplaintPage.step3Title, text: t.addComplaintPage.step3Text }]} />
            <WhyBlock title={t.addComplaintPage.whyTitle} text={t.addComplaintPage.whyText} />
          </aside>
        </div>
      </div>
    </div>
  )
}
