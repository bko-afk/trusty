'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { HowToSteps } from '@/components/HowToSteps'
import { WhyBlock } from '@/components/WhyBlock'
import { useLanguage } from '@/i18n/LanguageContext'
import { useCustomer } from '@/lib/useCustomer'

type Company = { id: string; name: string; slug: string }

export function AddReviewForm({
  companies,
  preselectedSlug,
}: {
  companies: Company[]
  preselectedSlug?: string
}) {
  const { t } = useLanguage()
  const { customer } = useCustomer()
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const preselected = companies.find((c) => c.slug === preselectedSlug)

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
