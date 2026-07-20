import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/getPayloadClient'
import { CompanyComplaintsText } from './CompanyComplaintsText'
import { getPublishedCompany } from '@/lib/getPublishedContent'
import { getRequestLocale, localizedAlternates, localizedOpenGraph } from '@/i18n/seo'
import { localizePath } from '@/i18n/routing'

export const revalidate = 60

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const locale = await getRequestLocale()
  const company = await getPublishedCompany(slug, locale)
  if (!company) return { title: 'Company not found', robots: { index: false, follow: false } }

  const title = locale === 'ru' ? `Жалобы на ${company.name}` : locale === 'es' ? `Quejas sobre ${company.name}` : `${company.name} Complaints`
  const description = locale === 'ru'
    ? `Опубликованные жалобы клиентов на ${company.name}, ответы компании и статус решения обращений.`
    : locale === 'es'
      ? `Quejas publicadas sobre ${company.name}, respuestas de la empresa y estado de resolución.`
      : `Published customer complaints about ${company.name}, company responses, and case resolution status.`
  const canonical = `/companies/${slug}/complaints`
  return {
    title,
    description,
    alternates: localizedAlternates(canonical, locale),
    openGraph: { ...localizedOpenGraph(locale), url: localizePath(canonical, locale), title, description },
  }
}

export default async function CompanyComplaintsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const locale = await getRequestLocale()
  const payload = await getPayloadClient()
  const company = await getPublishedCompany(slug, locale)
  if (!company) notFound()

  const complaints = await payload.find({
    collection: 'complaints',
    where: { company: { equals: company.id }, status: { equals: 'published' } },
    sort: '-createdAt',
    limit: 100,
    locale,
  })

  return (
    <CompanyComplaintsText
      slug={slug}
      companyName={company.name}
      complaints={complaints.docs.map((complaint) => ({
        id: String(complaint.id),
        authorName: complaint.authorName,
        title: complaint.title,
        body: complaint.body,
        workflowStatus: complaint.workflowStatus || (complaint.resolved ? 'resolved' : 'submitted'),
        createdAt: complaint.createdAt,
        response: complaint.companyResponse?.body
          ? {
              authorName: complaint.companyResponse.authorName || company.name,
              body: complaint.companyResponse.body,
              respondedAt: complaint.companyResponse.respondedAt || undefined,
            }
          : undefined,
      }))}
    />
  )
}
