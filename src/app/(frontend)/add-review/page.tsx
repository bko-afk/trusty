import { getPayloadClient } from '@/lib/getPayloadClient'
import { AddReviewForm } from './AddReviewForm'

export const dynamic = 'force-dynamic'

export default async function AddReviewPage({
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
    <AddReviewForm
      companies={companies.docs.map((c: any) => ({ id: c.id, name: c.name, slug: c.slug }))}
      preselectedSlug={company}
    />
  )
}
