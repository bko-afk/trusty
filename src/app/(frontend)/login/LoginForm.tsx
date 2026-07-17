'use client'

import Link from 'next/link'
import Image from 'next/image'
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
    <div className="container-page py-8 max-w-3xl">
      <Breadcrumbs items={[{ label: t.common.home, href: '/' }, { label: t.auth.login }]} />

      <div className="card overflow-hidden grid sm:grid-cols-2">
        <div className="bg-brand-light/40 p-6 sm:p-8 flex flex-col justify-center gap-4">
          <div className="relative h-24 w-24 mx-auto sm:mx-0">
            <Image src="/images/pages/login.svg" alt="" fill className="object-contain" />
          </div>
          <h1 className="text-xl font-bold text-brand-dark">{t.auth.login}</h1>
          <p className="text-sm text-gray-600">{t.auth.loginIntro}</p>
        </div>

        <div className="p-6 sm:p-8">
          <form onSubmit={onSubmit} className="space-y-4" aria-busy={status === 'loading'}>
            <div>
              <label className="block text-sm font-medium mb-1">{t.auth.email}</label>
              <input
                name="email"
                type="email"
                required
                maxLength={254}
                autoComplete="email"
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t.auth.password}</label>
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>
            <button type="submit" disabled={status === 'loading'} className="btn-primary w-full">
              {t.auth.loginBtn}
            </button>
            {status === 'error' && <p role="alert" className="text-rose-600 text-sm">{t.auth.loginError}</p>}
            <p className="text-sm text-center text-gray-500">
              <Link href="/register" className="text-brand hover:underline">
                {t.auth.noAccountYet}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
