'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { HowToSteps } from '@/components/HowToSteps'
import { WhyBlock } from '@/components/WhyBlock'
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
  const preselected = companies.find((c) => c.slug === preselectedSlug)

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
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          company: Number(form.get('company')),
          authorName: form.get('authorName'),
          authorEmail: form.get('authorEmail'),
          title: form.get('title'),
          body: form.get('body'),
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
      <Breadcrumbs items={[{ label: t.common.home, href: '/' }, { label: t.addComplaintPage.title }]} />

      <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2">{t.addComplaintPage.title}</h1>
          <p className="text-gray-500">{t.addComplaintPage.introText}</p>
        </div>
        <div className="relative h-28 w-28 shrink-0">
          <Image src="/images/pages/complaint.svg" alt="" fill className="object-contain" />
        </div>
      </div>

      <HowToSteps
        title={t.addComplaintPage.stepsTitle}
        subtitle={t.addComplaintPage.stepsSubtitle}
        steps={[
          { title: t.addComplaintPage.step1Title, text: t.addComplaintPage.step1Text },
          { title: t.addComplaintPage.step2Title, text: t.addComplaintPage.step2Text },
          { title: t.addComplaintPage.step3Title, text: t.addComplaintPage.step3Text },
        ]}
      />

      <WhyBlock title={t.addComplaintPage.whyTitle} text={t.addComplaintPage.whyText} />

      <h2 className="text-lg font-semibold mb-3">{t.addComplaintPage.formTitle}</h2>

      {status === 'success' ? (
        <div className="card p-6">{t.addComplaintPage.successMsg}</div>
      ) : (
        <form onSubmit={onSubmit} className="card p-6 space-y-4" aria-busy={status === 'loading'}>
          <div>
            <label className="block text-sm font-medium mb-1">{t.addComplaintPage.companyLabel}</label>
            <select
              name="company"
              required
              defaultValue={preselected?.id || ''}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            >
              <option value="" disabled>
                {t.addComplaintPage.companyPlaceholder}
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
              {t.addComplaintPage.loggedInAs} <strong>{customer.name || customer.email}</strong>
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t.addComplaintPage.nameLabel}</label>
                <input name="authorName" required minLength={2} maxLength={80} autoComplete="name" className="w-full rounded-lg border border-gray-300 px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t.addComplaintPage.emailLabel}</label>
                <input name="authorEmail" type="email" required maxLength={254} autoComplete="email" className="w-full rounded-lg border border-gray-300 px-3 py-2" />
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">{t.addComplaintPage.titleLabel}</label>
            <input name="title" required minLength={5} maxLength={160} className="w-full rounded-lg border border-gray-300 px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t.addComplaintPage.bodyLabel}</label>
            <textarea name="body" required minLength={30} maxLength={5000} rows={6} className="w-full rounded-lg border border-gray-300 px-3 py-2" />
          </div>
          <button type="submit" disabled={status === 'loading'} className="btn-primary">
            {status === 'loading' ? t.addComplaintPage.submittingBtn : t.addComplaintPage.submitBtn}
          </button>
          {status === 'error' && <p role="alert" className="text-rose-600 text-sm">{t.addComplaintPage.errorMsg}</p>}
        </form>
      )}
    </div>
  )
}
