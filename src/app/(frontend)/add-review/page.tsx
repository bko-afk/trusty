import { getPayloadClient } from '@/lib/getPayloadClient'
import { Breadcrumbs } from '@/components/Breadcrumbs'
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
    <div className="container-page py-8 max-w-2xl">
      <Breadcrumbs items={[{ label: 'Главная', href: '/' }, { label: 'Добавить отзыв' }]} />
      <h1 className="text-2xl font-bold mb-2">Оставить отзыв</h1>
      <p className="text-gray-500 mb-6">
        Отзыв появится на сайте после проверки модератором.
      </p>
      <AddReviewForm
        companies={companies.docs.map((c: any) => ({ id: c.id, name: c.name, slug: c.slug }))}
        preselectedSlug={company}
      />
    </div>
  )
}
