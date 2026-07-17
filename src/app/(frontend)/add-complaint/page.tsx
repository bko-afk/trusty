import { getPayloadClient } from '@/lib/getPayloadClient'
import { AddComplaintForm } from './AddComplaintForm'

export const revalidate = 120

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
