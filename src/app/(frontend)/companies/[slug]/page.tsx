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
      limit: 100,
      locale,
    }),
    payload.find({
      collection: 'reviews',
      where: {
        and: [
          { company: { equals: company.id } },
          { status: { equals: 'published' } },
          { includeInRating: { equals: true } },
        ],
      },
      depth: 0,
      limit: 1000,
    }),
    payload.find({
      collection: 'complaints',
      where: { company: { equals: company.id }, status: { equals: 'published' } },
      depth: 0,
      limit: 1000,
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

  const positiveReviewCount = reviewsResult.docs.filter((review: any) => review.rating >= 4).length
  const negativeReviewCount = reviewsResult.docs.filter((review: any) => review.rating <= 2).length
  const resolvedComplaintCount = complaintsResult.docs.filter(
    (complaint: any) => complaint.workflowStatus === 'resolved' || complaint.resolved,
  ).length
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
      company.reviewCount > 0
        ? {
            '@type': 'AggregateRating',
            ratingValue: company.overallRating || 0,
            bestRating: 5,
            worstRating: 1,
            ratingCount: company.reviewCount,
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
      overallRating={company.overallRating || 0}
      reviewCount={company.reviewCount || 0}
      verified={company.verified}
      verification={company.verification}
      dataUpdatedAt={company.dataUpdatedAt || company.updatedAt}
      uniqueFeature={company.uniqueFeature}
      insuranceProfile={company.insuranceProfile}
      positiveReviewCount={positiveReviewCount}
      negativeReviewCount={negativeReviewCount}
      complaintCount={complaintsResult.totalDocs}
      resolvedComplaintCount={resolvedComplaintCount}
      website={company.website}
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
      />
    </>
  )
}
