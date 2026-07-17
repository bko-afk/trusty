import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/getPayloadClient'
import { CompanyComplaintsText } from './CompanyComplaintsText'
import { getPublishedCompany } from '@/lib/getPublishedContent'

export const revalidate = 60

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const company = await getPublishedCompany(slug)
  if (!company) return { title: 'Компания не найдена', robots: { index: false, follow: false } }

  const title = `Жалобы на ${company.name}`
  const description = `Опубликованные жалобы клиентов на страховую компанию ${company.name}, ответы компании и статусы решения проблем.`
  const canonical = `/companies/${slug}/complaints`
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { url: canonical, title, description },
  }
}

export default async function CompanyComplaintsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayloadClient()
  const company = await getPublishedCompany(slug)
  if (!company) notFound()

  const complaints = await payload.find({
    collection: 'complaints',
    where: { company: { equals: company.id }, status: { equals: 'published' } },
    sort: '-createdAt',
    limit: 100,
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
