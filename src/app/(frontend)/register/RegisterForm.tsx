'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { useLanguage } from '@/i18n/LanguageContext'

export function RegisterForm() {
  const { t } = useLanguage()
  const router = useRouter()
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    const form = new FormData(e.currentTarget)

    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.get('name'),
          email: form.get('email'),
          password: form.get('password'),
        }),
      })
      if (res.ok) {
        setStatus('success')
        setTimeout(() => router.push('/login'), 1200)
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="container-page py-8 max-w-md">
      <Breadcrumbs items={[{ label: t.common.home, href: '/' }, { label: t.auth.register }]} />
      <h1 className="text-2xl font-bold mb-6">{t.auth.register}</h1>

      {status === 'success' ? (
        <div className="card p-6">{t.auth.registerSuccess}</div>
      ) : (
        <form onSubmit={onSubmit} className="card p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t.auth.name}</label>
            <input name="name" required className="w-full rounded-lg border border-gray-300 px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t.auth.email}</label>
            <input name="email" type="email" required className="w-full rounded-lg border border-gray-300 px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t.auth.password}</label>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>
          <button type="submit" disabled={status === 'loading'} className="btn-primary w-full">
            {t.auth.registerBtn}
          </button>
          {status === 'error' && <p className="text-rose-600 text-sm">{t.auth.registerError}</p>}
          <p className="text-sm text-center text-gray-500">
            <Link href="/login" className="text-brand hover:underline">
              {t.auth.alreadyHaveAccount}
            </Link>
          </p>
        </form>
      )}
    </div>
  )
}
