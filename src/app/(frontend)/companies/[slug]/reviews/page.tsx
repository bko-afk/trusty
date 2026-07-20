import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/getPayloadClient'
import { CompanyReviewsText } from './CompanyReviewsText'
import { getPublishedCompany } from '@/lib/getPublishedContent'
import { getRequestLocale, localizedAlternates, localizedOpenGraph } from '@/i18n/seo'
import { localizePath } from '@/i18n/routing'

export const revalidate = 60

const CRITERIA_KEYS = ['coverage', 'price', 'claimsService', 'support'] as const

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const locale = await getRequestLocale()
  const company = await getPublishedCompany(slug, locale)
  if (!company) return { title: 'Company not found', robots: { index: false, follow: false } }

  const title = locale === 'ru' ? `Отзывы о ${company.name}` : locale === 'es' ? `Reseñas de ${company.name}` : `${company.name} Reviews`
  const description = locale === 'ru'
    ? `Отзывы клиентов о ${company.name}: качество полиса, урегулирование случаев, выплаты и работа поддержки.`
    : locale === 'es'
      ? `Reseñas de clientes de ${company.name}: pólizas, gestión de siniestros, pagos y atención.`
      : `Customer reviews of ${company.name}, including policy quality, claims handling, payouts, and support ratings.`
  const canonical = `/companies/${slug}/reviews`
  return {
    title,
    description,
    alternates: localizedAlternates(canonical, locale),
    openGraph: { ...localizedOpenGraph(locale), url: localizePath(canonical, locale), title, description },
  }
}

export default async function CompanyReviewsPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { slug } = await params
  const requestedPage = Number((await searchParams).page)
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1
  const locale = await getRequestLocale()
  const payload = await getPayloadClient()
  const company: any = await getPublishedCompany(slug, locale)
  if (!company) notFound()

  const reviewsResult = await payload.find({
    collection: 'reviews',
    where: { company: { equals: company.id }, status: { equals: 'published' } },
    sort: '-createdAt',
    limit: 20,
    page,
    depth: 1,
    locale,
  })

  const repliesResult = reviewsResult.docs.length
    ? await payload.find({
        collection: 'review-replies',
        where: {
          review: { in: reviewsResult.docs.map((review) => review.id) },
          status: { equals: 'published' },
        },
        pagination: false,
      })
    : { docs: [] }

  const repliesByReview = new Map<string, any[]>()
  for (const reply of repliesResult.docs as any[]) {
    const reviewId = typeof reply.review === 'object' ? reply.review.id : reply.review
    if (!repliesByReview.has(reviewId)) repliesByReview.set(reviewId, [])
    repliesByReview.get(reviewId)!.push(reply)
  }

  const criteriaAverages = Object.fromEntries(
    CRITERIA_KEYS.map((key) => [key, Number(company.criteriaAverages?.[key] || 0)]),
  )

  return (
    <CompanyReviewsText
      slug={slug}
      companyName={company.name}
      overallRating={Number(company.overallRating || 0)}
      reviewCount={Number(company.reviewCount || reviewsResult.totalDocs)}
      criteriaAverages={criteriaAverages}
      pagination={{ page: reviewsResult.page || page, totalPages: reviewsResult.totalPages }}
      reviews={reviewsResult.docs.map((review: any) => ({
        id: String(review.id),
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
        criteria: review.criteria || undefined,
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
