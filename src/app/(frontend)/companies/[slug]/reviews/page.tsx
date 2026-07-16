import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/getPayloadClient'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { RatingStars } from '@/components/RatingStars'
import { ReviewCard } from '@/components/ReviewCard'

export const dynamic = 'force-dynamic'

const CRITERIA_LABELS: Record<string, string> = {
  coverage: 'Полнота покрытия',
  price: 'Цена полиса',
  claimsService: 'Выплаты по страховым случаям',
  support: 'Поддержка и сервис',
}

export default async function CompanyReviewsPage({
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
  const company: any = companyResult.docs[0]
  if (!company) notFound()

  const reviewsResult = await payload.find({
    collection: 'reviews',
    where: { company: { equals: company.id }, status: { equals: 'published' } },
    sort: '-createdAt',
    limit: 50,
  })

  const repliesResult = await payload.find({
    collection: 'review-replies',
    where: {
      review: { in: reviewsResult.docs.map((r: any) => r.id) },
      status: { equals: 'published' },
    },
    limit: 200,
  })

  const repliesByReview = new Map<string, any[]>()
  for (const reply of repliesResult.docs as any[]) {
    const reviewId = typeof reply.review === 'object' ? reply.review.id : reply.review
    if (!repliesByReview.has(reviewId)) repliesByReview.set(reviewId, [])
    repliesByReview.get(reviewId)!.push(reply)
  }

  const criteriaAverages: Record<string, number> = {}
  for (const key of Object.keys(CRITERIA_LABELS)) {
    const values = reviewsResult.docs
      .map((r: any) => r.criteria?.[key])
      .filter((v: any) => typeof v === 'number')
    criteriaAverages[key] = values.length
      ? values.reduce((a: number, b: number) => a + b, 0) / values.length
      : 0
  }

  return (
    <div className="container-page py-8">
      <Breadcrumbs
        items={[
          { label: 'Главная', href: '/' },
          { label: 'Каталог компаний', href: '/companies' },
          { label: company.name, href: `/companies/${slug}` },
          { label: 'Отзывы' },
        ]}
      />

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Отзывы о компании «{company.name}»</h1>
          <div className="flex items-center gap-3 mt-2">
            <RatingStars value={company.overallRating || 0} />
            <span className="text-gray-500 text-sm">{company.reviewCount || 0} отзывов</span>
          </div>
        </div>
        <Link href={`/add-review?company=${company.slug}`} className="btn-primary">
          Добавить отзыв
        </Link>
      </div>

      <div className="card p-5 mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(CRITERIA_LABELS).map(([key, label]) => (
          <div key={key}>
            <div className="text-xs text-gray-500 mb-1">{label}</div>
            <div className="h-2 rounded-full bg-gray-100">
              <div
                className="h-2 rounded-full bg-brand"
                style={{ width: `${(criteriaAverages[key] / 5) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-5">
        {reviewsResult.docs.map((review: any) => (
          <ReviewCard
            key={review.id}
            authorName={review.authorName}
            title={review.title}
            body={review.body}
            rating={review.rating}
            pros={(review.pros || []).map((p: any) => p.text)}
            cons={(review.cons || []).map((c: any) => c.text)}
            recommend={review.recommend}
            createdAt={review.createdAt}
            helpfulUp={review.helpfulUp}
            helpfulDown={review.helpfulDown}
            replies={(repliesByReview.get(review.id) || []).map((r: any) => ({
              id: r.id,
              authorName: r.authorName,
              authorType: r.authorType,
              body: r.body,
              createdAt: r.createdAt,
            }))}
          />
        ))}
        {reviewsResult.docs.length === 0 && (
          <p className="text-gray-500">Пока нет отзывов. Будьте первым!</p>
        )}
      </div>
    </div>
  )
}
