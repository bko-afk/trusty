import { getPayloadClient } from '@/lib/getPayloadClient'
import { AddReviewForm } from './AddReviewForm'
import { getRequestLocale, localizedPageMetadata } from '@/i18n/seo'

export const revalidate = 120

export const generateMetadata = () => localizedPageMetadata('addReview', '/add-review', { noIndex: true })

export default async function AddReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ company?: string }>
}) {
  const { company } = await searchParams
  const locale = await getRequestLocale()
  const payload = await getPayloadClient()

  const [companies, insuranceTypes] = await Promise.all([
    payload.find({
      collection: 'companies',
      where: { status: { equals: 'published' } },
      sort: 'name',
      limit: 100,
      locale,
    }),
    payload.find({ collection: 'insurance-types', sort: 'order', limit: 50, locale }),
  ])

  return (
    <AddReviewForm
      companies={companies.docs.map((c: any) => ({ id: c.id, name: c.name, slug: c.slug }))}
      insuranceTypes={insuranceTypes.docs.map((type: any) => ({
        id: String(type.id),
        slug: type.slug,
        title: type.title,
      }))}
      preselectedSlug={company}
    />
  )
}
