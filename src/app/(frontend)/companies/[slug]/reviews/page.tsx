import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/getPayloadClient'
import { CompanyReviewsText } from './CompanyReviewsText'
import { getPublishedCompany } from '@/lib/getPublishedContent'

export const revalidate = 60

const CRITERIA_KEYS = ['coverage', 'price', 'claimsService', 'support'] as const

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const company = await getPublishedCompany(slug)
  if (!company) return { title: 'Компания не найдена', robots: { index: false, follow: false } }

  const title = `Отзывы о ${company.name}`
  const description = `Отзывы клиентов о страховой компании ${company.name}, оценки качества полиса, выплат и поддержки.`
  const canonical = `/companies/${slug}/reviews`
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { url: canonical, title, description },
  }
}

export default async function CompanyReviewsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayloadClient()
  const company: any = await getPublishedCompany(slug)
  if (!company) notFound()

  const reviewsResult = await payload.find({
    collection: 'reviews',
    where: { company: { equals: company.id }, status: { equals: 'published' } },
    sort: '-createdAt',
    limit: 50,
    depth: 1,
  })

  const repliesResult = reviewsResult.docs.length
    ? await payload.find({
        collection: 'review-replies',
        where: {
          review: { in: reviewsResult.docs.map((review) => review.id) },
          status: { equals: 'published' },
        },
        limit: 200,
      })
    : { docs: [] }

  const repliesByReview = new Map<string, any[]>()
  for (const reply of repliesResult.docs as any[]) {
    const reviewId = typeof reply.review === 'object' ? reply.review.id : reply.review
    if (!repliesByReview.has(reviewId)) repliesByReview.set(reviewId, [])
    repliesByReview.get(reviewId)!.push(reply)
  }

  const criteriaAverages: Record<string, number> = {}
  const ratingReviews = reviewsResult.docs.filter((review: any) => review.includeInRating === true)
  for (const key of CRITERIA_KEYS) {
    const values = ratingReviews
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
        experienceType: review.experienceType || 'purchase',
        policyType: typeof review.policyType === 'object' ? { slug: review.policyType.slug, title: review.policyType.title } : undefined,
        tripCountry: review.tripCountry,
        claimOutcome: review.claimOutcome,
        claimAmount: review.claimAmount,
        responseTime: review.responseTime,
        verifiedExperience: review.verifiedExperience,
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
