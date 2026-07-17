'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { useLanguage } from '@/i18n/LanguageContext'
import { useCustomer } from '@/lib/useCustomer'

type ActivityItem = {
  id: string
  title: string
  status: keyof ReturnType<typeof useLanguage>['t']['auth']['submissionStatus']
  createdAt: string
  company?: { name?: string; slug?: string } | number
}
type SubscriptionItem = { id: string; name: string; slug: string }
type SubscriptionUpdate = ActivityItem & { type: 'review' | 'complaint' }

const accountCopy = {
  ru: { overview: 'Обзор аккаунта', submissions: 'Мои обращения', quickActions: 'Быстрые действия', writeReview: 'Оставить отзыв', fileComplaint: 'Подать жалобу', openCatalog: 'Открыть каталог', followed: 'Подписки на компании', noFollowed: 'Вы пока не подписаны ни на одну компанию.', updates: 'Обновления подписок', newReview: 'Новый отзыв', newComplaint: 'Новая жалоба', reviewsStat: 'отзывов', complaintsStat: 'жалоб', followedStat: 'подписок', profileHint: 'Здесь собраны ваши публикации, статусы модерации и обновления компаний.' },
  en: { overview: 'Account overview', submissions: 'My submissions', quickActions: 'Quick actions', writeReview: 'Write a review', fileComplaint: 'File a complaint', openCatalog: 'Browse catalog', followed: 'Followed companies', noFollowed: 'You are not following any companies yet.', updates: 'Subscription updates', newReview: 'New review', newComplaint: 'New complaint', reviewsStat: 'reviews', complaintsStat: 'complaints', followedStat: 'following', profileHint: 'Your submissions, moderation statuses, and company updates are collected here.' },
  es: { overview: 'Resumen de la cuenta', submissions: 'Mis publicaciones', quickActions: 'Acciones rápidas', writeReview: 'Escribir reseña', fileComplaint: 'Presentar una queja', openCatalog: 'Abrir catálogo', followed: 'Empresas seguidas', noFollowed: 'Aún no sigues ninguna empresa.', updates: 'Actualizaciones', newReview: 'Nueva reseña', newComplaint: 'Nueva queja', reviewsStat: 'reseñas', complaintsStat: 'quejas', followedStat: 'seguidas', profileHint: 'Aquí encontrarás tus publicaciones, estados de moderación y actualizaciones.' },
} as const

export default function AccountPage() {
  const { t, locale } = useLanguage()
  const copy = accountCopy[locale]
  const { customer, loading, logout } = useCustomer()
  const [reviews, setReviews] = useState<ActivityItem[]>([])
  const [complaints, setComplaints] = useState<ActivityItem[]>([])
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([])
  const [updates, setUpdates] = useState<SubscriptionUpdate[]>([])
  const [activityLoading, setActivityLoading] = useState(false)

  useEffect(() => {
    if (!customer) {
      setReviews([])
      setComplaints([])
      setSubscriptions([])
      setUpdates([])
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
        setSubscriptions(data.subscriptions || [])
        setUpdates(data.updates || [])
      })
      .catch((requestError) => {
        if (requestError instanceof DOMException && requestError.name === 'AbortError') return
        setReviews([])
        setComplaints([])
        setSubscriptions([])
        setUpdates([])
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
    <div className="min-h-[70vh] bg-[#f3f6f9] pb-14">
      <div className="container-page max-w-6xl pt-8">
        <Breadcrumbs items={[{ label: t.common.home, href: '/' }, { label: t.auth.myAccount }]} />

        {loading ? (
          <div className="animate-pulse space-y-5" aria-label={t.common.loading}>
            <div className="h-48 bg-gray-200" />
            <div className="grid gap-4 sm:grid-cols-3"><div className="h-28 bg-gray-200" /><div className="h-28 bg-gray-200" /><div className="h-28 bg-gray-200" /></div>
          </div>
        ) : customer ? (
          <div className="space-y-7">
            <header className="relative overflow-hidden bg-[#071b45] p-6 text-white sm:p-8">
              <div aria-hidden="true" className="absolute -right-20 -top-28 h-72 w-72 rounded-full border-[52px] border-white/5" />
              <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-5">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand text-2xl font-extrabold uppercase">{(customer.name || customer.email).slice(0, 1)}</div>
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-[#80c5c7]">{copy.overview}</p>
                    <h1 className="mt-2 truncate text-3xl font-extrabold tracking-[-0.03em]">{customer.name || t.auth.myAccount}</h1>
                    <p className="mt-1 truncate text-sm text-white/60">{customer.email}</p>
                  </div>
                </div>
                <button type="button" onClick={onLogout} className="inline-flex min-h-11 items-center justify-center border border-white/20 px-5 text-sm font-bold text-white transition-colors hover:bg-white/10">{t.auth.logoutBtn}</button>
              </div>
              <p className="relative mt-6 max-w-2xl text-sm leading-6 text-white/60">{copy.profileHint}</p>
            </header>

            <section aria-label={copy.overview} className="grid gap-4 sm:grid-cols-3">
              <StatCard value={reviews.length} label={copy.reviewsStat} accent="purple" />
              <StatCard value={complaints.length} label={copy.complaintsStat} accent="teal" />
              <StatCard value={subscriptions.length} label={copy.followedStat} accent="navy" />
            </section>

            <section>
              <div className="mb-4 flex items-end justify-between gap-4"><div><p className="section-kicker">Trusty</p><h2 className="mt-1 text-2xl font-extrabold">{copy.quickActions}</h2></div></div>
              <div className="grid gap-px border border-gray-200 bg-gray-200 sm:grid-cols-3">
                <QuickAction href="/add-review" number="01" title={copy.writeReview} />
                <QuickAction href="/add-complaint" number="02" title={copy.fileComplaint} />
                <QuickAction href="/companies" number="03" title={copy.openCatalog} />
              </div>
            </section>

            <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_340px]">
              <section className="border border-gray-200 bg-white p-5 sm:p-7">
                <div className="border-b border-gray-100 pb-5"><p className="section-kicker">{copy.submissions}</p><h2 className="mt-1 text-2xl font-extrabold">{t.auth.myReviews} & {t.auth.myComplaints}</h2></div>
                {activityLoading ? (
                  <p className="py-8 text-sm text-gray-500">{t.auth.activityLoading}</p>
                ) : (
                  <div className="mt-6 grid gap-8 md:grid-cols-2">
                    <ActivityList type="review" title={t.auth.myReviews} emptyText={t.auth.noReviewsYet} items={reviews} locale={locale} statusLabels={t.auth.submissionStatus} />
                    <ActivityList type="complaint" title={t.auth.myComplaints} emptyText={t.auth.noComplaintsYet} items={complaints} locale={locale} statusLabels={t.auth.submissionStatus} />
                  </div>
                )}
              </section>

              <aside className="space-y-5">
                <section className="border border-gray-200 bg-white p-5">
                  <h2 className="font-extrabold text-brand-dark">{copy.followed}</h2>
                  {subscriptions.length > 0 ? <div className="mt-4 flex flex-wrap gap-2">{subscriptions.map((company) => <Link key={company.id} href={`/companies/${company.slug}`} className="border border-gray-200 px-3 py-2 text-sm font-bold text-brand-dark transition-colors hover:border-brand hover:text-brand">{company.name}</Link>)}</div> : <p className="mt-3 text-sm leading-6 text-gray-500">{copy.noFollowed}</p>}
                </section>
                {updates.length > 0 && <section className="border border-gray-200 bg-white p-5"><h2 className="font-extrabold text-brand-dark">{copy.updates}</h2><ul className="mt-4 space-y-3">{updates.map((update) => { const company = update.company && typeof update.company === 'object' ? update.company : null; return <li key={`${update.type}-${update.id}`} className="border-l-2 border-brand pl-3 text-sm"><Link href={company?.slug ? `/companies/${company.slug}/${update.type === 'review' ? 'reviews' : 'complaints'}` : '/companies'}><span className="text-[11px] font-extrabold uppercase tracking-wider text-brand">{update.type === 'review' ? copy.newReview : copy.newComplaint}</span><span className="mt-1 block font-bold leading-5 text-brand-dark">{update.title}</span>{company?.name && <span className="mt-1 block text-xs text-gray-500">{company.name}</span>}</Link></li> })}</ul></section>}
              </aside>
            </div>
          </div>
        ) : (
          <div className="grid overflow-hidden border border-gray-200 bg-white lg:grid-cols-[1fr_0.8fr]">
            <div className="p-7 sm:p-10">
              <p className="section-kicker">{t.auth.myAccount}</p>
              <h1 className="mt-3 text-4xl font-extrabold tracking-[-0.04em]">{t.auth.notLoggedIn}</h1>
              <p className="mt-4 max-w-lg leading-7 text-gray-500">{copy.profileHint}</p>
              <div className="mt-7 flex flex-wrap gap-3"><Link href="/login" className="btn-primary">{t.auth.loginBtn}</Link><Link href="/register" className="btn-secondary">{t.auth.registerBtn}</Link></div>
            </div>
            <div className="flex min-h-64 items-center justify-center bg-[#071b45] p-8"><div className="flex h-28 w-28 items-center justify-center rounded-full border-[16px] border-white/10 bg-brand text-4xl font-extrabold text-white">T</div></div>
          </div>
        )}
      </div>
    </div>
  )
}

function ActivityList({
  type,
  title,
  emptyText,
  items,
  locale,
  statusLabels,
}: {
  type: 'review' | 'complaint'
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
        <p className="mt-3 border border-dashed border-gray-200 p-4 text-sm leading-6 text-gray-500">{emptyText}</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {items.map((item) => {
            const company = item.company && typeof item.company === 'object' ? item.company : null
            const content = (
              <>
                <span className="block font-bold leading-5 text-brand-dark">{item.title}</span>
                <span className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                  {company?.name && <span>{company.name}</span>}
                  <span>{new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(item.createdAt))}</span>
                  <span className={`px-2 py-1 font-bold ${statusClass(item.status)}`}>{statusLabels[item.status] || item.status}</span>
                </span>
              </>
            )

            return (
              <li key={item.id} className="border border-gray-200 p-4 text-sm transition-colors hover:border-brand-light">
                {company?.slug ? <Link href={`/companies/${company.slug}/${type === 'review' ? 'reviews' : 'complaints'}`}>{content}</Link> : content}
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

function statusClass(status: ActivityItem['status']) {
  if (status === 'published') return 'bg-emerald-50 text-emerald-700'
  if (status === 'pending') return 'bg-amber-50 text-amber-800'
  if (status === 'rejected' || status === 'spam') return 'bg-rose-50 text-rose-700'
  return 'bg-gray-100 text-gray-600'
}

function StatCard({ value, label, accent }: { value: number; label: string; accent: 'purple' | 'teal' | 'navy' }) {
  const colors = accent === 'purple' ? 'border-brand text-brand' : accent === 'teal' ? 'border-[#579c9e] text-[#579c9e]' : 'border-[#071b45] text-[#071b45]'
  return <div className={`border-l-4 bg-white p-5 shadow-[0_12px_35px_rgba(7,27,69,0.04)] ${colors}`}><strong className="block text-3xl font-extrabold">{value}</strong><span className="mt-1 block text-sm font-semibold text-gray-500">{label}</span></div>
}

function QuickAction({ href, number, title }: { href: string; number: string; title: string }) {
  return <Link href={href} className="group flex min-h-28 items-center justify-between gap-4 bg-white p-5 transition-colors hover:bg-[#fbf9ff]"><span><span className="block text-xs font-extrabold text-brand">{number}</span><span className="mt-2 block text-lg font-extrabold text-brand-dark">{title}</span></span><span aria-hidden="true" className="text-2xl text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-brand">→</span></Link>
}
