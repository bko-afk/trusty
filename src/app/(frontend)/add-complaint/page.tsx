import { getPayloadClient } from '@/lib/getPayloadClient'
import { AddComplaintForm } from './AddComplaintForm'
import { getRequestLocale, localizedPageMetadata } from '@/i18n/seo'

export const revalidate = 120

export const generateMetadata = () => localizedPageMetadata('addComplaint', '/add-complaint', { noIndex: true })

export default async function AddComplaintPage({
  searchParams,
}: {
  searchParams: Promise<{ company?: string }>
}) {
  const { company } = await searchParams
  const locale = await getRequestLocale()
  const payload = await getPayloadClient()

  const companies = await payload.find({
    collection: 'companies',
    where: { status: { equals: 'published' } },
    sort: 'name',
    limit: 100,
    locale,
  })

  return (
    <AddComplaintForm
      companies={companies.docs.map((c: any) => ({ id: c.id, name: c.name, slug: c.slug }))}
      preselectedSlug={company}
    />
  )
}
