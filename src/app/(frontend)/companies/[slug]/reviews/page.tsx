import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/getPayloadClient'
import { CompanyReviewsText } from './CompanyReviewsText'

export const dynamic = 'force-dynamic'

const CRITERIA_KEYS = ['coverage', 'price', 'claimsService', 'support'] as const

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
  for (const key of CRITERIA_KEYS) {
    const values = reviewsResult.docs
      .map((r: any) => r.criteria?.[key])
      .filter((v: any) => typeof v === 'number')
    criteriaAverages[key] = values.length
      ? values.reduce((a: number, b: number) => a + b, 0) / values.length
      : 0
  }

  return (
    <CompanyReviewsText
      slug={slug}
      companyName={company.name}
      overallRating={company.overallRating || 0}
      reviewCount={company.reviewCount || 0}
      criteriaAverages={criteriaAverages}
      reviews={reviewsResult.docs.map((review: any) => ({
        id: review.id,
        authorName: review.authorName,
        title: review.title,
        body: review.body,
        rating: review.rating,
        pros: (review.pros || []).map((p: any) => p.text),
        cons: (review.cons || []).map((c: any) => c.text),
        recommend: review.recommend,
        createdAt: review.createdAt,
        helpfulUp: review.helpfulUp,
        helpfulDown: review.helpfulDown,
        replies: (repliesByReview.get(review.id) || []).map((r: any) => ({
          id: r.id,
          authorName: r.authorName,
          authorType: r.authorType,
          body: r.body,
          createdAt: r.createdAt,
        })),
      }))}
    />
  )
}
