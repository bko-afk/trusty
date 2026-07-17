import type { Metadata } from 'next'
import { getPayloadClient } from '@/lib/getPayloadClient'
import { AddReviewForm } from './AddReviewForm'
import { noIndexMetadata } from '@/lib/seo'

export const revalidate = 120

export const metadata: Metadata = {
  ...noIndexMetadata,
  title: 'Оставить отзыв о страховой компании',
  description: 'Поделитесь опытом покупки полиса, обращения в поддержку или получения страховой выплаты.',
  alternates: { canonical: '/add-review' },
}

export default async function AddReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ company?: string }>
}) {
  const { company } = await searchParams
  const payload = await getPayloadClient()

  const [companies, insuranceTypes] = await Promise.all([
    payload.find({
      collection: 'companies',
      where: { status: { equals: 'published' } },
      sort: 'name',
      limit: 100,
    }),
    payload.find({ collection: 'insurance-types', sort: 'order', limit: 50 }),
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
