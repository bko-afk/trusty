import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/getPayloadClient'
import { CompanyComplaintsText } from './CompanyComplaintsText'

export const revalidate = 60

export default async function CompanyComplaintsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayloadClient()
  const companyResult = await payload.find({
    collection: 'companies',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    limit: 1,
  })
  const company = companyResult.docs[0]
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
