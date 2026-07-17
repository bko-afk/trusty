'use client'

import { useState } from 'react'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { useLanguage } from '@/i18n/LanguageContext'
import { countries, countryFlag } from '@/lib/countries'
import { insuranceTypeLabel } from '@/lib/insuranceTypeLabel'

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9а-яё\s-]/gi, '')
    .trim()
    .replace(/\s+/g, '-')
}

export function AddCompanyForm({
  insuranceTypes,
}: {
  insuranceTypes: { id: string; slug: string; title: string }[]
}) {
  const { t, locale } = useLanguage()
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')

    const form = new FormData(e.currentTarget)
    const name = String(form.get('name') || '')
    const selectedTypes = form.getAll('insuranceTypes').map((id) => Number(id))

    try {
      const res = await fetch('/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          slug: slugify(name),
          website: form.get('website'),
          city: form.get('city'),
          country: form.get('country') || undefined,
          shortDescription: form.get('shortDescription'),
          insuranceTypes: selectedTypes,
          status: 'draft',
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
      <Breadcrumbs items={[{ label: t.common.home, href: '/' }, { label: t.nav.addCompany }]} />
      <h1 className="text-2xl font-bold mb-2">{t.addCompanyPage.title}</h1>
      <p className="text-gray-500 mb-6">{t.addCompanyPage.subtitle}</p>

      {status === 'success' ? (
        <div className="card p-6">{t.addCompanyPage.successMsg}</div>
      ) : (
        <form onSubmit={onSubmit} className="card p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t.addCompanyPage.nameLabel}</label>
            <input name="name" required className="w-full rounded-lg border border-gray-300 px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t.addCompanyPage.websiteLabel}</label>
            <input name="website" type="url" className="w-full rounded-lg border border-gray-300 px-3 py-2" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t.addCompanyPage.countryLabel}</label>
              <select name="country" defaultValue="" className="w-full rounded-lg border border-gray-300 px-3 py-2">
                <option value="">{t.addCompanyPage.countryPlaceholder}</option>
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {countryFlag(c.code)} {c[locale]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t.addCompanyPage.cityLabel}</label>
              <input name="city" className="w-full rounded-lg border border-gray-300 px-3 py-2" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t.addCompanyPage.insuranceTypesLabel}</label>
            <div className="flex flex-wrap gap-3">
              {insuranceTypes.map((type) => (
                <label key={type.id} className="flex items-center gap-1.5 text-sm">
                  <input type="checkbox" name="insuranceTypes" value={type.id} />
                  {insuranceTypeLabel(t, type)}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t.addCompanyPage.descriptionLabel}</label>
            <textarea
              name="shortDescription"
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>
          <button type="submit" disabled={status === 'loading'} className="btn-primary">
            {status === 'loading' ? t.addCompanyPage.submittingBtn : t.addCompanyPage.submitBtn}
          </button>
          {status === 'error' && <p className="text-rose-600 text-sm">{t.addCompanyPage.errorMsg}</p>}
        </form>
      )}
    </div>
  )
}
