'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { useLanguage } from '@/i18n/LanguageContext'
import { useCustomer } from '@/lib/useCustomer'

export const dynamic = 'force-dynamic'

type ActivityItem = {
  id: string
  title: string
  status: keyof ReturnType<typeof useLanguage>['t']['auth']['submissionStatus']
  createdAt: string
  company?: { name?: string; slug?: string } | number
}

export default function AccountPage() {
  const { t, locale } = useLanguage()
  const { customer, loading, logout } = useCustomer()
  const [reviews, setReviews] = useState<ActivityItem[]>([])
  const [complaints, setComplaints] = useState<ActivityItem[]>([])
  const [activityLoading, setActivityLoading] = useState(false)

  useEffect(() => {
    if (!customer) {
      setReviews([])
      setComplaints([])
      return
    }

    const controller = new AbortController()
    setActivityLoading(true)
    fetch('/api/account-activity', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
      signal: controller.signal,
    })
      .then(async (response) => {
        const data = response.ok ? await response.json() : { reviews: [], complaints: [] }
        setReviews(data.reviews || [])
        setComplaints(data.complaints || [])
      })
      .catch((requestError) => {
        if (requestError instanceof DOMException && requestError.name === 'AbortError') return
        setReviews([])
        setComplaints([])
      })
      .finally(() => {
        if (!controller.signal.aborted) setActivityLoading(false)
      })

    return () => controller.abort()
  }, [customer])

  async function onLogout() {
    await logout()
    window.location.href = '/'
  }

  return (
    <div className="container-page py-8 max-w-3xl">
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

          <div className="border-t border-gray-200 pt-5">
            {activityLoading ? (
              <p className="text-sm text-gray-500">{t.auth.activityLoading}</p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                <ActivityList title={t.auth.myReviews} emptyText={t.auth.noReviewsYet} items={reviews} locale={locale} statusLabels={t.auth.submissionStatus} />
                <ActivityList title={t.auth.myComplaints} emptyText={t.auth.noComplaintsYet} items={complaints} locale={locale} statusLabels={t.auth.submissionStatus} />
              </div>
            )}
          </div>
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

function ActivityList({
  title,
  emptyText,
  items,
  locale,
  statusLabels,
}: {
  title: string
  emptyText: string
  items: ActivityItem[]
  locale: string
  statusLabels: Record<ActivityItem['status'], string>
}) {
  return (
    <section>
      <h2 className="font-bold">{title}</h2>
      {items.length === 0 ? (
        <p className="mt-2 text-sm text-gray-500">{emptyText}</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {items.map((item) => {
            const company = item.company && typeof item.company === 'object' ? item.company : null
            const content = (
              <>
                <span className="block font-medium text-brand-dark">{item.title}</span>
                <span className="mt-1 flex flex-wrap gap-x-2 text-xs text-gray-500">
                  {company?.name && <span>{company.name}</span>}
                  <span>{new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(item.createdAt))}</span>
                  <span>{statusLabels[item.status] || item.status}</span>
                </span>
              </>
            )

            return (
              <li key={item.id} className="rounded-lg border border-gray-200 p-3 text-sm">
                {company?.slug ? <Link href={`/companies/${company.slug}`}>{content}</Link> : content}
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
