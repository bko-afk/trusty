'use client'

import Link from '@/components/LocalizedLink'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { useLanguage } from '@/i18n/LanguageContext'
import { localizePath } from '@/i18n/routing'

export function RegisterForm() {
  const { locale, t } = useLanguage()
  const router = useRouter()
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    const formEl = e.currentTarget
    const form = new FormData(formEl)

    const email = form.get('email')
    const password = form.get('password')
    const confirmPassword = form.get('confirmPassword')
    const confirmInput = formEl.elements.namedItem('confirmPassword') as HTMLInputElement

    if (password !== confirmPassword) {
      confirmInput.setCustomValidity(t.auth.confirmPassword)
      confirmInput.reportValidity()
      setStatus('idle')
      return
    }
    confirmInput.setCustomValidity('')

    try {
      const res = await fetch('/api/customer-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.get('name'),
          email,
          password,
          contactWebsite: form.get('contactWebsite'),
        }),
      })
      if (res.ok) {
        setStatus('success')
        try {
          const loginRes = await fetch('/api/customers/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, password }),
          })
          if (loginRes.ok) {
            window.location.href = localizePath('/account', locale)
            return
          }
        } catch {
          // fall through to login page if auto-login fails
        }
        setTimeout(() => router.push(localizePath('/login', locale)), 1200)
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="container-page py-8 max-w-3xl">
      <Breadcrumbs items={[{ label: t.common.home, href: '/' }, { label: t.auth.register }]} />

      <div className="card overflow-hidden grid sm:grid-cols-2">
        <div className="bg-brand-light/40 p-6 sm:p-8 flex flex-col justify-center gap-4">
          <div className="relative h-24 w-24 mx-auto sm:mx-0">
            <Image src="/images/pages/register.svg" alt="" fill className="object-contain" />
          </div>
          <h1 className="text-xl font-bold text-brand-dark">{t.auth.register}</h1>
          <p className="text-sm text-gray-600">{t.auth.registerIntro}</p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex gap-2">
              <span className="text-brand">✓</span>
              {t.auth.registerBenefit1}
            </li>
            <li className="flex gap-2">
              <span className="text-brand">✓</span>
              {t.auth.registerBenefit2}
            </li>
            <li className="flex gap-2">
              <span className="text-brand">✓</span>
              {t.auth.registerBenefit3}
            </li>
          </ul>
        </div>

        <div className="p-6 sm:p-8">
          {status === 'success' ? (
            <p>{t.auth.registerSuccess}</p>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4" aria-busy={status === 'loading'}>
              <input name="contactWebsite" type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
              <div>
                <label className="block text-sm font-medium mb-1">{t.auth.name}</label>
                <input name="name" required minLength={2} maxLength={80} autoComplete="name" className="w-full rounded-lg border border-gray-300 px-3 py-2" />
              </div>
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
                  minLength={8}
                  autoComplete="new-password"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t.auth.confirmPassword}</label>
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  onInput={(event) => event.currentTarget.setCustomValidity('')}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                />
              </div>
              <button type="submit" disabled={status === 'loading'} className="btn-primary w-full">
                {t.auth.registerBtn}
              </button>
              {status === 'error' && <p role="alert" className="text-rose-600 text-sm">{t.auth.registerError}</p>}
              <p className="text-sm text-center text-gray-500">
                <Link href="/login" className="text-brand hover:underline">
                  {t.auth.alreadyHaveAccount}
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
