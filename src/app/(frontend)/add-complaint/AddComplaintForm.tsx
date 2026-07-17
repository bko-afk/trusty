'use client'

import { useState } from 'react'
import { Breadcrumbs } from '@/components/Breadcrumbs'
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
    setStatus('loading')

    const form = new FormData(e.currentTarget)

    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          company: form.get('company'),
          authorName: form.get('authorName'),
          authorEmail: form.get('authorEmail'),
          title: form.get('title'),
          body: form.get('body'),
          status: 'pending',
        }),
      })
      setStatus(res.ok ? 'success' : 'error')
      if (res.ok) e.currentTarget.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="container-page py-8 max-w-2xl">
      <Breadcrumbs items={[{ label: t.common.home, href: '/' }, { label: t.addComplaintPage.title }]} />
      <h1 className="text-2xl font-bold mb-2">{t.addComplaintPage.title}</h1>
      <p className="text-gray-500 mb-6">{t.addComplaintPage.subtitle}</p>

      {status === 'success' ? (
        <div className="card p-6">{t.addComplaintPage.successMsg}</div>
      ) : (
        <form onSubmit={onSubmit} className="card p-6 space-y-4">
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
                <input name="authorName" required className="w-full rounded-lg border border-gray-300 px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t.addComplaintPage.emailLabel}</label>
                <input name="authorEmail" type="email" className="w-full rounded-lg border border-gray-300 px-3 py-2" />
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">{t.addComplaintPage.titleLabel}</label>
            <input name="title" required className="w-full rounded-lg border border-gray-300 px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t.addComplaintPage.bodyLabel}</label>
            <textarea name="body" required rows={6} className="w-full rounded-lg border border-gray-300 px-3 py-2" />
          </div>
          <button type="submit" disabled={status === 'loading'} className="btn-primary">
            {status === 'loading' ? t.addComplaintPage.submittingBtn : t.addComplaintPage.submitBtn}
          </button>
          {status === 'error' && <p className="text-rose-600 text-sm">{t.addComplaintPage.errorMsg}</p>}
        </form>
      )}
    </div>
  )
}
