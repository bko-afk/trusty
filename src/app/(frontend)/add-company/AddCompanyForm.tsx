'use client'

import { useState } from 'react'

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
  insuranceTypes: { id: string; title: string }[]
}) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')

    const form = new FormData(e.currentTarget)
    const name = String(form.get('name') || '')
    const selectedTypes = form.getAll('insuranceTypes')

    try {
      const res = await fetch('/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          slug: slugify(name),
          website: form.get('website'),
          city: form.get('city'),
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

  if (status === 'success') {
    return (
      <div className="card p-6">
        Спасибо! Заявка отправлена и появится на сайте после проверки модератором.
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="card p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Название компании *</label>
        <input name="name" required className="w-full rounded-lg border border-gray-300 px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Сайт компании</label>
        <input name="website" type="url" className="w-full rounded-lg border border-gray-300 px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Город</label>
        <input name="city" className="w-full rounded-lg border border-gray-300 px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Виды страхования</label>
        <div className="flex flex-wrap gap-3">
          {insuranceTypes.map((type) => (
            <label key={type.id} className="flex items-center gap-1.5 text-sm">
              <input type="checkbox" name="insuranceTypes" value={type.id} />
              {type.title}
            </label>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Краткое описание</label>
        <textarea
          name="shortDescription"
          rows={4}
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
        />
      </div>
      <button type="submit" disabled={status === 'loading'} className="btn-primary">
        {status === 'loading' ? 'Отправка...' : 'Отправить на модерацию'}
      </button>
      {status === 'error' && (
        <p className="text-rose-600 text-sm">Не удалось отправить форму. Попробуйте ещё раз.</p>
      )}
    </form>
  )
}
