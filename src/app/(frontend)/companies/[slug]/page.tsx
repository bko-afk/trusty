import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/getPayloadClient'
import { companyLogoUrl } from '@/lib/companyLogo'
import { CompanyDetailText } from './CompanyDetailText'
import { categoryEditorialPosition, sortCompaniesByRanking } from '@/lib/companyRanking'
import { getPublishedCompany } from '@/lib/getPublishedContent'
import { absoluteUrl, mediaUrl, plainDescription } from '@/lib/seo'
import { richTextToPlainText } from '@/lib/richText'
import { JsonLd } from '@/components/JsonLd'
import { getRequestLocale, localizedAlternates, localizedOpenGraph } from '@/i18n/seo'
import { localizePath } from '@/i18n/routing'
import { safeHttpUrl } from '@/lib/safeUrl'

export const revalidate = 60

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const locale = await getRequestLocale()
  const company: any = await getPublishedCompany(slug, locale)
  if (!company) return { title: 'Company not found', robots: { index: false, follow: false } }

  const description = plainDescription(
    company.seo?.description || company.shortDescription,
    locale === 'ru'
      ? `Отзывы клиентов, рейтинг, страховые продукты и информация о компании ${company.name}.`
      : locale === 'es'
        ? `Reseñas, calificación, productos de seguros e información sobre ${company.name}.`
        : `Customer reviews, ratings, insurance products, and company information for ${company.name}.`,
  )
  const image = mediaUrl(company.seo?.ogImage) || companyLogoUrl(company.logo, company.logoFile)
  const canonical = `/companies/${slug}`
  const generatedTitle = locale === 'ru'
    ? `${company.name}: отзывы и рейтинг`
    : locale === 'es'
      ? `${company.name}: reseñas y calificación`
      : `${company.name}: Reviews and Rating`

  return {
    title: company.seo?.title || generatedTitle,
    description,
    alternates: localizedAlternates(canonical, locale),
    openGraph: {
      ...localizedOpenGraph(locale),
      type: 'website',
      url: localizePath(canonical, locale),
      title: company.seo?.title || generatedTitle,
      description,
      images: image ? [{ url: image, alt: company.name }] : undefined,
    },
    twitter: { card: 'summary_large_image', description, images: image ? [image] : undefined },
  }
}

export default async function CompanyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const locale = await getRequestLocale()
  const company: any = await getPublishedCompany(slug, locale)
  if (!company) notFound()

  const payload = await getPayloadClient()
  const insuranceTypeIds = (company.insuranceTypes || []).map((type: any) =>
    typeof type === 'object' ? type.id : type,
  )
  const [allCompaniesResult, reviewsResult, complaintsResult, articlesResult] = await Promise.all([
    payload.find({
      collection: 'companies',
      where: { status: { equals: 'published' } },
      sort: '-overallRating',
      depth: 1,
      pagination: false,
      locale,
    }),
    payload.find({
      collection: 'reviews',
      where: {
        and: [
          { company: { equals: company.id } },
          { status: { equals: 'published' } },
        ],
      },
      depth: 0,
      limit: 20,
      sort: '-createdAt',
    }),
    payload.find({
      collection: 'complaints',
      where: { company: { equals: company.id }, status: { equals: 'published' } },
      depth: 0,
      limit: 20,
      sort: '-createdAt',
    }),
    payload.find({
      collection: 'articles',
      where: { status: { equals: 'published' } },
      sort: '-publishedAt',
      depth: 0,
      limit: 3,
      locale,
    }),
  ])

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
    const reviewId = String(typeof reply.review === 'object' ? reply.review.id : reply.review)
    const replies = repliesByReview.get(reviewId) || []
    replies.push(reply)
    repliesByReview.set(reviewId, replies)
  }

  const sharesInsuranceType = (candidate: any) => {
    const candidateTypeIds = (candidate.insuranceTypes || []).map((type: any) =>
      typeof type === 'object' ? type.id : type,
    )
    return candidateTypeIds.some((id: any) => insuranceTypeIds.includes(id))
  }
  const rankedCompanies = sortCompaniesByRanking(allCompaniesResult.docs)
  const relatedCompanies = rankedCompanies
    .filter((candidate: any) => candidate.id !== company.id && sharesInsuranceType(candidate))
    .slice(0, 3)
  const categoryPositions = (company.insuranceTypes || []).map((type: any) => {
    const typeId = typeof type === 'object' ? type.id : type
    const categoryCompanies = allCompaniesResult.docs.filter((candidate: any) =>
      (candidate.insuranceTypes || []).some((candidateType: any) =>
        (typeof candidateType === 'object' ? candidateType.id : candidateType) === typeId,
      ),
    )
    const ranked = sortCompaniesByRanking(categoryCompanies, [typeId])
    return {
      slug: typeof type === 'object' ? type.slug : String(typeId),
      title: typeof type === 'object' ? type.title : String(typeId),
      position:
        categoryEditorialPosition(company, typeId) ||
        ranked.findIndex((candidate: any) => candidate.id === company.id) + 1,
      total: ranked.length,
    }
  })

  const description = company.description ? richTextToPlainText(company.description) : ''
  const logoUrl = companyLogoUrl(company.logo, company.logoFile)
  const structuredData: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'InsuranceAgency',
    name: company.name,
    url: absoluteUrl(localizePath(`/companies/${slug}`, locale)),
    description: plainDescription(company.shortDescription || description, `Insurance company ${company.name}.`),
    image: logoUrl ? absoluteUrl(logoUrl) : undefined,
    telephone: company.contacts?.phone || undefined,
    email: company.contacts?.email || undefined,
    foundingDate: company.foundedYear ? String(company.foundedYear) : undefined,
    sameAs: company.website ? [company.website] : undefined,
    address: company.contacts?.address
      ? {
          '@type': 'PostalAddress',
          streetAddress: company.contacts.address,
          addressLocality: company.city || undefined,
          addressCountry: company.country || undefined,
        }
      : undefined,
    aggregateRating:
      Number(company.reviewCount || 0) > 0
        ? {
            '@type': 'AggregateRating',
            ratingValue: Number(company.overallRating || 0),
            bestRating: 5,
            worstRating: 1,
            ratingCount: Number(company.reviewCount || 0),
          }
        : undefined,
  }

  return (
    <>
      <JsonLd data={structuredData} />
      <CompanyDetailText
      companyId={String(company.id)}
      slug={slug}
      name={company.name}
      logoUrl={logoUrl}
      overallRating={Number(company.overallRating || 0)}
      reviewCount={Number(company.reviewCount || 0)}
      verified={company.verified}
      verification={company.verification ? {
        ...company.verification,
        licenseUrl: safeHttpUrl(company.verification.licenseUrl),
      } : undefined}
      dataUpdatedAt={company.dataUpdatedAt || company.updatedAt}
      uniqueFeature={company.uniqueFeature}
      insuranceProfile={company.insuranceProfile}
      positiveReviewCount={Number(company.positiveReviewCount || 0)}
      negativeReviewCount={Number(company.negativeReviewCount || 0)}
      complaintCount={Number(company.complaintCount || 0)}
      resolvedComplaintCount={Number(company.resolvedComplaintCount || 0)}
      website={safeHttpUrl(company.website, 300)}
      foundedYear={company.foundedYear}
      city={company.city}
      country={company.country}
      phone={company.contacts?.phone}
      email={company.contacts?.email}
      address={company.contacts?.address}
      insuranceTypes={(company.insuranceTypes || []).map((it: any) => ({ slug: it.slug, title: it.title }))}
      shortDescription={company.shortDescription}
      description={description}
      pros={(company.pros || []).map((p: any) => p.text)}
      cons={(company.cons || []).map((c: any) => c.text)}
      categoryPositions={categoryPositions}
      relatedCompanies={relatedCompanies.map((candidate: any) => ({
        slug: candidate.slug,
        name: candidate.name,
        logoUrl: companyLogoUrl(candidate.logo, candidate.logoFile),
        rating: candidate.overallRating || 0,
      }))}
      articles={articlesResult.docs.map((article: any) => ({
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
      }))}
      criteriaAverages={company.criteriaAverages || {}}
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
        pros: (review.pros || []).map((item: any) => item.text),
        cons: (review.cons || []).map((item: any) => item.text),
        recommend: review.recommend,
        createdAt: review.createdAt,
        helpfulUp: review.helpfulUp,
        helpfulDown: review.helpfulDown,
        replies: (repliesByReview.get(String(review.id)) || []).map((reply: any) => ({
          id: String(reply.id),
          authorName: reply.authorName,
          authorType: reply.authorType,
          body: reply.body,
          createdAt: reply.createdAt,
        })),
      }))}
      complaints={complaintsResult.docs.map((complaint: any) => ({
        id: String(complaint.id),
        authorName: complaint.authorName,
        title: complaint.title,
        body: complaint.body,
        workflowStatus: complaint.workflowStatus || (complaint.resolved ? 'resolved' : 'submitted'),
        createdAt: complaint.createdAt,
        response: complaint.companyResponse?.body ? {
          authorName: complaint.companyResponse.authorName || company.name,
          body: complaint.companyResponse.body,
          respondedAt: complaint.companyResponse.respondedAt || undefined,
        } : undefined,
      }))}
      />
    </>
  )
}
