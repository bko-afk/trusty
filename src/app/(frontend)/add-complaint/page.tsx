import type { Metadata } from 'next'
import { getPayloadClient } from '@/lib/getPayloadClient'
import { AddComplaintForm } from './AddComplaintForm'
import { noIndexMetadata } from '@/lib/seo'

export const revalidate = 120

export const metadata: Metadata = {
  ...noIndexMetadata,
  title: 'Оставить жалобу на страховую компанию',
  description: 'Опишите проблему со страховой компанией и отправьте жалобу на модерацию Trusty.',
  alternates: { canonical: '/add-complaint' },
}

export default async function AddComplaintPage({
  searchParams,
}: {
  searchParams: Promise<{ company?: string }>
}) {
  const { company } = await searchParams
  const payload = await getPayloadClient()

  const companies = await payload.find({
    collection: 'companies',
    where: { status: { equals: 'published' } },
    sort: 'name',
    limit: 100,
  })

  return (
    <AddComplaintForm
      companies={companies.docs.map((c: any) => ({ id: c.id, name: c.name, slug: c.slug }))}
      preselectedSlug={company}
    />
  )
}
