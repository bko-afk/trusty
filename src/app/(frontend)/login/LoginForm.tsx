'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { useLanguage } from '@/i18n/LanguageContext'

export function LoginForm() {
  const { t } = useLanguage()
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    const form = new FormData(e.currentTarget)

    try {
      const res = await fetch('/api/customers/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: form.get('email'),
          password: form.get('password'),
        }),
      })
      if (res.ok) {
        window.location.href = '/account'
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="container-page py-8 max-w-md">
      <Breadcrumbs items={[{ label: t.common.home, href: '/' }, { label: t.auth.login }]} />
      <h1 className="text-2xl font-bold mb-6">{t.auth.login}</h1>

      <form onSubmit={onSubmit} className="card p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">{t.auth.email}</label>
          <input name="email" type="email" required className="w-full rounded-lg border border-gray-300 px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t.auth.password}</label>
          <input name="password" type="password" required className="w-full rounded-lg border border-gray-300 px-3 py-2" />
        </div>
        <button type="submit" disabled={status === 'loading'} className="btn-primary w-full">
          {t.auth.loginBtn}
        </button>
        {status === 'error' && <p className="text-rose-600 text-sm">{t.auth.loginError}</p>}
        <p className="text-xs text-center text-gray-400">{t.auth.passwordResetHint}</p>
        <p className="text-sm text-center text-gray-500">
          <Link href="/register" className="text-brand hover:underline">
            {t.auth.noAccountYet}
          </Link>
        </p>
      </form>
    </div>
  )
}
