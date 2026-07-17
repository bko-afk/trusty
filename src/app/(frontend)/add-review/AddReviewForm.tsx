'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { HowToSteps } from '@/components/HowToSteps'
import { WhyBlock } from '@/components/WhyBlock'
import { FormRatingInput } from '@/components/FormRatingInput'
import { SubmissionFormSection } from '@/components/SubmissionFormSection'
import { useLanguage } from '@/i18n/LanguageContext'
import { useCustomer } from '@/lib/useCustomer'
import { countries, countryName } from '@/lib/countries'
import { insuranceTypeLabel } from '@/lib/insuranceTypeLabel'

type Company = { id: string; name: string; slug: string }
type InsuranceType = { id: string; slug: string; title: string }

const extraCopy = {
  ru: {
    experience: 'Какой у вас опыт?', purchase: 'Покупка и использование полиса', claim: 'Страховой случай и выплата',
    policyType: 'Вид страхования', optional: 'Не указано', country: 'Страна поездки или лечения',
    claimOutcome: 'Результат страхового случая', claimAmount: 'Сумма требования или выплаты',
    responseTime: 'Скорость ответа компании', amountPlaceholder: 'Например, 1 200 USD',
    outcomes: ['Выплачено полностью', 'Выплачено частично', 'Отказано', 'Рассматривается'],
    times: ['В тот же день', '1-3 дня', '4-7 дней', '8-30 дней', 'Более 30 дней', 'Ответа не было'],
  },
  en: {
    experience: 'What was your experience?', purchase: 'Buying and using a policy', claim: 'Claim and reimbursement',
    policyType: 'Insurance type', optional: 'Not specified', country: 'Travel or treatment country',
    claimOutcome: 'Claim outcome', claimAmount: 'Claim or payout amount', responseTime: 'Company response time',
    amountPlaceholder: 'For example, USD 1,200', outcomes: ['Paid in full', 'Partially paid', 'Denied', 'Pending'],
    times: ['Same day', '1-3 days', '4-7 days', '8-30 days', 'More than 30 days', 'No response'],
  },
  es: {
    experience: '¿Cuál fue tu experiencia?', purchase: 'Compra y uso de la póliza', claim: 'Siniestro y reembolso',
    policyType: 'Tipo de seguro', optional: 'No especificado', country: 'País del viaje o tratamiento',
    claimOutcome: 'Resultado del siniestro', claimAmount: 'Importe reclamado o pagado',
    responseTime: 'Tiempo de respuesta', amountPlaceholder: 'Por ejemplo, 1.200 USD',
    outcomes: ['Pagado por completo', 'Pagado parcialmente', 'Rechazado', 'En revisión'],
    times: ['El mismo día', '1-3 días', '4-7 días', '8-30 días', 'Más de 30 días', 'Sin respuesta'],
  },
} as const

export function AddReviewForm({
  companies,
  insuranceTypes,
  preselectedSlug,
}: {
  companies: Company[]
  insuranceTypes: InsuranceType[]
  preselectedSlug?: string
}) {
  const { t, locale } = useLanguage()
  const { customer } = useCustomer()
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [experienceType, setExperienceType] = useState<'purchase' | 'claim'>('purchase')
  const preselected = companies.find((c) => c.slug === preselectedSlug)
  const copy = extraCopy[locale]

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // Сохраняем ссылку на форму заранее: после await браузер уже
    // сбрасывает e.currentTarget, и обращение к нему кидало бы ошибку.
    const formEl = e.currentTarget
    setStatus('loading')

    const form = new FormData(formEl)
    const prosText = String(form.get('pros') || '')
    const consText = String(form.get('cons') || '')

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          company: Number(form.get('company')),
          authorName: form.get('authorName'),
          authorEmail: form.get('authorEmail'),
          title: form.get('title'),
          body: form.get('body'),
          rating: Number(form.get('rating')),
          experienceType: form.get('experienceType'),
          policyType: form.get('policyType') ? Number(form.get('policyType')) : undefined,
          tripCountry: form.get('tripCountry') || undefined,
          claimOutcome: experienceType === 'claim' ? form.get('claimOutcome') : 'not_applicable',
          claimAmount: experienceType === 'claim' ? form.get('claimAmount') : undefined,
          responseTime: form.get('responseTime') || undefined,
          criteria: {
            coverage: Number(form.get('coverage')),
            price: Number(form.get('price')),
            claimsService: Number(form.get('claimsService')),
            support: Number(form.get('support')),
          },
          recommend: form.get('recommend') === 'on',
          pros: prosText
            .split('\n')
            .map((t) => t.trim())
            .filter(Boolean)
            .map((text) => ({ text })),
          cons: consText
            .split('\n')
            .map((t) => t.trim())
            .filter(Boolean)
            .map((text) => ({ text })),
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
        <Breadcrumbs items={[{ label: t.common.home, href: '/' }, { label: t.nav.addReview }]} />

        <header className="relative overflow-hidden border border-gray-200 bg-white px-6 py-8 sm:px-9 lg:px-12 lg:py-10">
          <div className="max-w-3xl">
            <p className="section-kicker">{t.addReviewPage.formTitle}</p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-[-0.04em] text-brand-dark sm:text-5xl">{t.addReviewPage.title}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600">{t.addReviewPage.introText}</p>
          </div>
          <div className="absolute -right-6 bottom-0 hidden h-40 w-40 opacity-90 sm:block lg:right-10">
            <Image src="/images/pages/write-review.svg" alt="" fill className="object-contain" />
          </div>
        </header>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <main>
            {status === 'success' ? (
              <div className="border border-emerald-200 bg-white p-8 shadow-[0_18px_55px_rgba(7,27,69,0.05)]">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-2xl font-bold text-emerald-700">✓</span>
                <h2 className="mt-5 text-2xl font-extrabold text-brand-dark">{t.addReviewPage.successMsg}</h2>
                <p className="mt-3 text-gray-500">{t.addReviewPage.subtitle}</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-6" aria-busy={status === 'loading'}>
                <SubmissionFormSection number="1" title={t.addReviewPage.step1Title} description={t.addReviewPage.step1Text}>
                  <div>
                    <label htmlFor="review-company" className="form-label">{t.addReviewPage.companyLabel}</label>
                    <select id="review-company" name="company" required defaultValue={preselected?.id || ''} className="form-control">
                      <option value="" disabled>{t.addReviewPage.companyPlaceholder}</option>
                      {companies.map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}
                    </select>
                  </div>

                  {customer ? (
                    <div className="flex items-center gap-3 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 font-bold text-white">✓</span>
                      <span>{t.addReviewPage.loggedInAs} <strong>{customer.name || customer.email}</strong></span>
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div><label htmlFor="review-author" className="form-label">{t.addReviewPage.nameLabel}</label><input id="review-author" name="authorName" required minLength={2} maxLength={80} autoComplete="name" className="form-control" /></div>
                      <div><label htmlFor="review-email" className="form-label">{t.addReviewPage.emailLabel}</label><input id="review-email" name="authorEmail" type="email" maxLength={254} autoComplete="email" className="form-control" /></div>
                    </div>
                  )}

                  <fieldset>
                    <legend className="form-label">{copy.experience}</legend>
                    <div className="mt-2 grid gap-3 sm:grid-cols-2">
                      <label className={`flex cursor-pointer items-start gap-3 border p-4 transition-colors ${experienceType === 'purchase' ? 'border-brand bg-brand-light/25' : 'border-gray-200 bg-white hover:border-gray-300'}`}><input type="radio" name="experienceType" value="purchase" checked={experienceType === 'purchase'} onChange={() => setExperienceType('purchase')} className="mt-1 accent-brand" /><span className="font-semibold">{copy.purchase}</span></label>
                      <label className={`flex cursor-pointer items-start gap-3 border p-4 transition-colors ${experienceType === 'claim' ? 'border-brand bg-brand-light/25' : 'border-gray-200 bg-white hover:border-gray-300'}`}><input type="radio" name="experienceType" value="claim" checked={experienceType === 'claim'} onChange={() => setExperienceType('claim')} className="mt-1 accent-brand" /><span className="font-semibold">{copy.claim}</span></label>
                    </div>
                  </fieldset>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div><label htmlFor="review-policy" className="form-label">{copy.policyType}</label><select id="review-policy" name="policyType" defaultValue="" className="form-control"><option value="">{copy.optional}</option>{insuranceTypes.map((type) => <option key={type.id} value={type.id}>{insuranceTypeLabel(t, type)}</option>)}</select></div>
                    <div><label htmlFor="review-country" className="form-label">{copy.country}</label><select id="review-country" name="tripCountry" defaultValue="" className="form-control"><option value="">{copy.optional}</option>{countries.map((country) => <option key={country.code} value={country.code}>{countryName(country.code, locale)}</option>)}</select></div>
                  </div>

                  {experienceType === 'claim' && (
                    <div className="grid gap-4 border-l-4 border-brand bg-brand-light/15 p-5 sm:grid-cols-2">
                      <div><label htmlFor="review-outcome" className="form-label">{copy.claimOutcome}</label><select id="review-outcome" name="claimOutcome" defaultValue="pending" className="form-control">{['paid', 'partially_paid', 'denied', 'pending'].map((value, index) => <option key={value} value={value}>{copy.outcomes[index]}</option>)}</select></div>
                      <div><label htmlFor="review-amount" className="form-label">{copy.claimAmount}</label><input id="review-amount" name="claimAmount" maxLength={120} placeholder={copy.amountPlaceholder} className="form-control" /></div>
                    </div>
                  )}

                  <div><label htmlFor="review-response-time" className="form-label">{copy.responseTime}</label><select id="review-response-time" name="responseTime" defaultValue="" className="form-control"><option value="">{copy.optional}</option>{['same_day', '1_3_days', '4_7_days', '8_30_days', 'more_30_days', 'no_response'].map((value, index) => <option key={value} value={value}>{copy.times[index]}</option>)}</select></div>
                </SubmissionFormSection>

                <SubmissionFormSection number="2" title={t.addReviewPage.ratingLabel} description={t.addReviewPage.criteriaLabel}>
                  <FormRatingInput name="rating" label={t.addReviewPage.ratingLabel} />
                  <div className="grid gap-3 sm:grid-cols-2">
                    {Object.entries(t.companyReviewsPage.criteria).map(([key, label]) => (
                      <div key={key} className="border border-gray-200 p-4"><FormRatingInput name={key} label={label} compact /></div>
                    ))}
                  </div>
                </SubmissionFormSection>

                <SubmissionFormSection number="3" title={t.addReviewPage.step2Title} description={t.addReviewPage.step2Text}>
                  <div><label htmlFor="review-title" className="form-label">{t.addReviewPage.titleLabel}</label><input id="review-title" name="title" required minLength={5} maxLength={160} className="form-control" /></div>
                  <div><label htmlFor="review-body" className="form-label">{t.addReviewPage.bodyLabel}</label><textarea id="review-body" name="body" required minLength={30} maxLength={5000} rows={7} className="form-control" /><span className="form-help">{t.addReviewPage.subtitle}</span></div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div><label htmlFor="review-pros" className="form-label">{t.addReviewPage.prosLabel}</label><textarea id="review-pros" name="pros" rows={4} maxLength={1200} className="form-control" /></div>
                    <div><label htmlFor="review-cons" className="form-label">{t.addReviewPage.consLabel}</label><textarea id="review-cons" name="cons" rows={4} maxLength={1200} className="form-control" /></div>
                  </div>
                  <label className="flex cursor-pointer items-center gap-3 border border-gray-200 bg-[#f8fafb] p-4 text-sm font-semibold"><input type="checkbox" name="recommend" defaultChecked className="h-5 w-5 accent-brand" />{t.addReviewPage.recommendLabel}</label>
                </SubmissionFormSection>

                <div className="flex flex-col gap-3 border border-gray-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="max-w-md text-sm leading-6 text-gray-500">{t.addReviewPage.step3Text}</p>
                  <button type="submit" disabled={status === 'loading'} className="btn-primary min-h-12 min-w-44 disabled:cursor-wait disabled:opacity-60">{status === 'loading' ? t.addReviewPage.submittingBtn : t.addReviewPage.submitBtn}</button>
                </div>
                {status === 'error' && <p role="alert" className="border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">{t.addReviewPage.errorMsg}</p>}
              </form>
            )}
          </main>

          <aside className="space-y-5 lg:sticky lg:top-24">
            <HowToSteps compact title={t.addReviewPage.stepsTitle} subtitle={t.addReviewPage.stepsSubtitle} steps={[{ title: t.addReviewPage.step1Title, text: t.addReviewPage.step1Text }, { title: t.addReviewPage.step2Title, text: t.addReviewPage.step2Text }, { title: t.addReviewPage.step3Title, text: t.addReviewPage.step3Text }]} />
            <WhyBlock title={t.addReviewPage.whyTitle} text={t.addReviewPage.whyText} />
          </aside>
        </div>
      </div>
    </div>
  )
}
