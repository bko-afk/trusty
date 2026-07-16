import { getPayloadClient } from '@/lib/getPayloadClient'
import { HomeText } from './HomeText'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const payload = await getPayloadClient()

  const [companies, insuranceTypes, articles, latestReviews] = await Promise.all([
    payload.find({
      collection: 'companies',
      where: { status: { equals: 'published' } },
      sort: '-overallRating',
      limit: 8,
      depth: 1,
    }),
    payload.find({ collection: 'insurance-types', sort: 'order', limit: 20 }),
    payload.find({
      collection: 'articles',
      where: { status: { equals: 'published' } },
      sort: '-publishedAt',
      limit: 3,
    }),
    payload.find({
      collection: 'reviews',
      where: { status: { equals: 'published' } },
      sort: '-createdAt',
      limit: 6,
      depth: 1,
    }),
  ])

  return (
    <HomeText
      companies={companies.docs}
      insuranceTypes={insuranceTypes.docs}
      articles={articles.docs}
      latestReviews={latestReviews.docs}
    />
  )
}
