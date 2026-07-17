'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { HowToSteps } from '@/components/HowToSteps'
import { WhyBlock } from '@/components/WhyBlock'
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
    <div className="container-page py-8 max-w-3xl">
      <Breadcrumbs items={[{ label: t.common.home, href: '/' }, { label: t.nav.addReview }]} />

      <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2">{t.addReviewPage.title}</h1>
          <p className="text-gray-500">{t.addReviewPage.introText}</p>
        </div>
        <div className="relative h-28 w-28 shrink-0">
          <Image src="/images/pages/write-review.svg" alt="" fill className="object-contain" />
        </div>
      </div>

      <HowToSteps
        title={t.addReviewPage.stepsTitle}
        subtitle={t.addReviewPage.stepsSubtitle}
        steps={[
          { title: t.addReviewPage.step1Title, text: t.addReviewPage.step1Text },
          { title: t.addReviewPage.step2Title, text: t.addReviewPage.step2Text },
          { title: t.addReviewPage.step3Title, text: t.addReviewPage.step3Text },
        ]}
      />

      <WhyBlock title={t.addReviewPage.whyTitle} text={t.addReviewPage.whyText} />

      <h2 className="text-lg font-semibold mb-3">{t.addReviewPage.formTitle}</h2>

      {status === 'success' ? (
        <div className="card p-6">{t.addReviewPage.successMsg}</div>
      ) : (
        <form onSubmit={onSubmit} className="card p-6 space-y-4" aria-busy={status === 'loading'}>
          <div>
            <label className="block text-sm font-medium mb-1">{t.addReviewPage.companyLabel}</label>
            <select
              name="company"
              required
              defaultValue={preselected?.id || ''}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            >
              <option value="" disabled>
                {t.addReviewPage.companyPlaceholder}
              </option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          {customer ? (
            <p className="text-sm text-gray-500">
              {t.addReviewPage.loggedInAs} <strong>{customer.name || customer.email}</strong>
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t.addReviewPage.nameLabel}</label>
                <input name="authorName" required minLength={2} maxLength={80} autoComplete="name" className="w-full rounded-lg border border-gray-300 px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t.addReviewPage.emailLabel}</label>
                <input name="authorEmail" type="email" maxLength={254} autoComplete="email" className="w-full rounded-lg border border-gray-300 px-3 py-2" />
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">{t.addReviewPage.ratingLabel}</label>
            <select name="rating" required defaultValue="5" className="w-full rounded-lg border border-gray-300 px-3 py-2">
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <fieldset>
            <legend className="block text-sm font-medium mb-2">{copy.experience}</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className={`cursor-pointer border p-4 ${experienceType === 'purchase' ? 'border-brand bg-brand-light/30' : 'border-gray-200'}`}><input type="radio" name="experienceType" value="purchase" checked={experienceType === 'purchase'} onChange={() => setExperienceType('purchase')} className="mr-2 accent-brand" />{copy.purchase}</label>
              <label className={`cursor-pointer border p-4 ${experienceType === 'claim' ? 'border-brand bg-brand-light/30' : 'border-gray-200'}`}><input type="radio" name="experienceType" value="claim" checked={experienceType === 'claim'} onChange={() => setExperienceType('claim')} className="mr-2 accent-brand" />{copy.claim}</label>
            </div>
          </fieldset>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium">{copy.policyType}<select name="policyType" defaultValue="" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"><option value="">{copy.optional}</option>{insuranceTypes.map((type) => <option key={type.id} value={type.id}>{insuranceTypeLabel(t, type)}</option>)}</select></label>
            <label className="text-sm font-medium">{copy.country}<select name="tripCountry" defaultValue="" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"><option value="">{copy.optional}</option>{countries.map((country) => <option key={country.code} value={country.code}>{countryName(country.code, locale)}</option>)}</select></label>
          </div>
          {experienceType === 'claim' && (
            <div className="grid gap-4 border-l-4 border-brand bg-brand-light/20 p-4 sm:grid-cols-2">
              <label className="text-sm font-medium">{copy.claimOutcome}<select name="claimOutcome" defaultValue="pending" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2">{['paid', 'partially_paid', 'denied', 'pending'].map((value, index) => <option key={value} value={value}>{copy.outcomes[index]}</option>)}</select></label>
              <label className="text-sm font-medium">{copy.claimAmount}<input name="claimAmount" maxLength={120} placeholder={copy.amountPlaceholder} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" /></label>
            </div>
          )}
          <label className="block text-sm font-medium">{copy.responseTime}<select name="responseTime" defaultValue="" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"><option value="">{copy.optional}</option>{['same_day', '1_3_days', '4_7_days', '8_30_days', 'more_30_days', 'no_response'].map((value, index) => <option key={value} value={value}>{copy.times[index]}</option>)}</select></label>
          <fieldset>
            <legend className="block text-sm font-medium mb-2">{t.addReviewPage.criteriaLabel}</legend>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {Object.entries(t.companyReviewsPage.criteria).map(([key, label]) => (
                <label key={key} className="text-sm text-gray-600">
                  <span className="mb-1 block">{label}</span>
                  <select name={key} required defaultValue="5" className="w-full rounded-lg border border-gray-300 px-3 py-2">
                    {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </label>
              ))}
            </div>
          </fieldset>
          <div>
            <label className="block text-sm font-medium mb-1">{t.addReviewPage.titleLabel}</label>
            <input name="title" required minLength={5} maxLength={160} className="w-full rounded-lg border border-gray-300 px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t.addReviewPage.bodyLabel}</label>
            <textarea name="body" required minLength={30} maxLength={5000} rows={5} className="w-full rounded-lg border border-gray-300 px-3 py-2" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t.addReviewPage.prosLabel}</label>
              <textarea name="pros" rows={3} maxLength={1200} className="w-full rounded-lg border border-gray-300 px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t.addReviewPage.consLabel}</label>
              <textarea name="cons" rows={3} maxLength={1200} className="w-full rounded-lg border border-gray-300 px-3 py-2" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="recommend" defaultChecked />
            {t.addReviewPage.recommendLabel}
          </label>
          <button type="submit" disabled={status === 'loading'} className="btn-primary">
            {status === 'loading' ? t.addReviewPage.submittingBtn : t.addReviewPage.submitBtn}
          </button>
          {status === 'error' && <p role="alert" className="text-rose-600 text-sm">{t.addReviewPage.errorMsg}</p>}
        </form>
      )}
    </div>
  )
}
