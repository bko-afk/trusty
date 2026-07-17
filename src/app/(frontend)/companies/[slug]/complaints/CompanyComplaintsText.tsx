'use client'

import Link from 'next/link'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { useLanguage } from '@/i18n/LanguageContext'

type Complaint = {
  id: string
  authorName: string
  title: string
  body: string
  workflowStatus: 'submitted' | 'company_replied' | 'resolved' | 'unresolved'
  createdAt: string
  response?: { authorName: string; body: string; respondedAt?: string }
}

const copy = {
  ru: { title: 'Жалобы на', breadcrumb: 'Жалобы', add: 'Подать жалобу', empty: 'Опубликованных жалоб пока нет.', response: 'Официальный ответ компании', statuses: { submitted: 'Получена', company_replied: 'Компания ответила', resolved: 'Решена', unresolved: 'Не решена' } },
  en: { title: 'Complaints about', breadcrumb: 'Complaints', add: 'Submit a complaint', empty: 'There are no published complaints yet.', response: 'Official company response', statuses: { submitted: 'Submitted', company_replied: 'Company replied', resolved: 'Resolved', unresolved: 'Unresolved' } },
  es: { title: 'Quejas sobre', breadcrumb: 'Quejas', add: 'Presentar una queja', empty: 'Aún no hay quejas publicadas.', response: 'Respuesta oficial de la empresa', statuses: { submitted: 'Recibida', company_replied: 'La empresa respondió', resolved: 'Resuelta', unresolved: 'No resuelta' } },
} as const

export function CompanyComplaintsText({ slug, companyName, complaints }: { slug: string; companyName: string; complaints: Complaint[] }) {
  const { t, locale } = useLanguage()
  const text = copy[locale]

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: t.common.home, href: '/' }, { label: t.nav.catalog, href: '/companies' }, { label: companyName, href: `/companies/${slug}` }, { label: text.breadcrumb }]} />
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="text-3xl font-extrabold">{text.title} «{companyName}»</h1></div>
        <Link href={`/add-complaint?company=${slug}`} className="btn-primary">{text.add}</Link>
      </div>
      <div className="space-y-5">
        {complaints.map((complaint) => (
          <article key={complaint.id} className="border border-gray-200 bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-3"><div><div className="font-bold">{complaint.authorName}</div><time className="text-xs text-gray-500">{new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(complaint.createdAt))}</time></div><span className={`px-3 py-1 text-xs font-bold ${complaint.workflowStatus === 'resolved' ? 'bg-emerald-50 text-emerald-700' : complaint.workflowStatus === 'unresolved' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-800'}`}>{text.statuses[complaint.workflowStatus]}</span></div>
            <h2 className="mt-4 text-xl font-extrabold">{complaint.title}</h2><p className="mt-3 whitespace-pre-line leading-7 text-gray-600">{complaint.body}</p>
            {complaint.response && <div className="mt-5 border-l-4 border-brand bg-brand-light/25 p-4"><div className="text-xs font-bold uppercase tracking-wider text-brand">{text.response}</div><div className="mt-2 font-bold">{complaint.response.authorName}</div><p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-700">{complaint.response.body}</p></div>}
          </article>
        ))}
        {complaints.length === 0 && <div className="border border-gray-200 bg-white p-8 text-center text-gray-500">{text.empty}</div>}
      </div>
    </div>
  )
}
