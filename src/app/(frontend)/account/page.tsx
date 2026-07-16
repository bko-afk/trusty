'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { useLanguage } from '@/i18n/LanguageContext'
import { useCustomer } from '@/lib/useCustomer'

export const dynamic = 'force-dynamic'

export default function AccountPage() {
  const { t } = useLanguage()
  const { customer, loading, logout } = useCustomer()
  const router = useRouter()

  async function onLogout() {
    await logout()
    router.push('/')
    router.refresh()
  }

  return (
    <div className="container-page py-8 max-w-md">
      <Breadcrumbs items={[{ label: t.common.home, href: '/' }, { label: t.auth.myAccount }]} />
      <h1 className="text-2xl font-bold mb-6">{t.auth.myAccount}</h1>

      {loading ? (
        <p className="text-gray-500">{t.common.loading}</p>
      ) : customer ? (
        <div className="card p-6 space-y-4">
          <div>
            <div className="text-sm text-gray-500">{t.auth.name}</div>
            <div className="font-medium">{customer.name}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">{t.auth.email}</div>
            <div className="font-medium">{customer.email}</div>
          </div>
          <button type="button" onClick={onLogout} className="btn-secondary w-full">
            {t.auth.logoutBtn}
          </button>
        </div>
      ) : (
        <div className="card p-6 space-y-3">
          <p className="text-gray-500">{t.auth.notLoggedIn}</p>
          <Link href="/login" className="btn-primary inline-block">
            {t.auth.loginBtn}
          </Link>
        </div>
      )}
    </div>
  )
}
