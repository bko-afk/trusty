'use client'

import { useState } from 'react'

type Company = { id: string; name: string; slug: string }

export function AddReviewForm({
  companies,
  preselectedSlug,
}: {
  companies: Company[]
  preselectedSlug?: string
}) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const preselected = companies.find((c) => c.slug === preselectedSlug)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')

    const form = new FormData(e.currentTarget)
    const prosText = String(form.get('pros') || '')
    const consText = String(form.get('cons') || '')

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: form.get('company'),
          authorName: form.get('authorName'),
          authorEmail: form.get('authorEmail'),
          title: form.get('title'),
          body: form.get('body'),
          rating: Number(form.get('rating')),
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
          status: 'pending',
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
      <div className="card p-6">Спасибо за отзыв! Он появится на сайте после модерации.</div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="card p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Компания *</label>
        <select
          name="company"
          required
          defaultValue={preselected?.id || ''}
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
        >
          <option value="" disabled>
            Выберите компанию
          </option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Ваше имя *</label>
          <input name="authorName" required className="w-full rounded-lg border border-gray-300 px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input name="authorEmail" type="email" className="w-full rounded-lg border border-gray-300 px-3 py-2" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Оценка *</label>
        <select name="rating" required defaultValue="5" className="w-full rounded-lg border border-gray-300 px-3 py-2">
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Заголовок отзыва *</label>
        <input name="title" required className="w-full rounded-lg border border-gray-300 px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Текст отзыва *</label>
        <textarea name="body" required rows={5} className="w-full rounded-lg border border-gray-300 px-3 py-2" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Плюсы (по одному в строке)</label>
          <textarea name="pros" rows={3} className="w-full rounded-lg border border-gray-300 px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Минусы (по одному в строке)</label>
          <textarea name="cons" rows={3} className="w-full rounded-lg border border-gray-300 px-3 py-2" />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="recommend" defaultChecked />
        Рекомендую эту компанию
      </label>
      <button type="submit" disabled={status === 'loading'} className="btn-primary">
        {status === 'loading' ? 'Отправка...' : 'Отправить отзыв'}
      </button>
      {status === 'error' && (
        <p className="text-rose-600 text-sm">Не удалось отправить отзыв. Попробуйте ещё раз.</p>
      )}
    </form>
  )
}
