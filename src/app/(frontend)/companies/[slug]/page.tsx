import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/getPayloadClient'
import { companyLogoUrl } from '@/lib/companyLogo'
import { CompanyDetailText } from './CompanyDetailText'

export const revalidate = 60

async function getCompany(slug: string) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'companies',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    depth: 2,
    limit: 1,
  })
  return result.docs[0]
}

function extractText(node: any): string {
  if (!node) return ''
  if (typeof node === 'string') return node
  if (node.root) return extractText(node.root)
  if (Array.isArray(node.children)) {
    return node.children.map(extractText).join(node.type === 'paragraph' ? '\n\n' : '')
  }
  if (typeof node.text === 'string') return node.text
  return ''
}

export default async function CompanyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const company: any = await getCompany(slug)
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
    }),
    payload.find({
      collection: 'reviews',
      where: { company: { equals: company.id }, status: { equals: 'published' } },
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
  const relatedCompanies = allCompaniesResult.docs
    .filter((candidate: any) => candidate.id !== company.id && sharesInsuranceType(candidate))
    .slice(0, 3)
  const categoryPositions = (company.insuranceTypes || []).map((type: any) => {
    const typeId = typeof type === 'object' ? type.id : type
    const ranked = allCompaniesResult.docs.filter((candidate: any) =>
      (candidate.insuranceTypes || []).some((candidateType: any) =>
        (typeof candidateType === 'object' ? candidateType.id : candidateType) === typeId,
      ),
    )
    return {
      slug: typeof type === 'object' ? type.slug : String(typeId),
      title: typeof type === 'object' ? type.title : String(typeId),
      position: ranked.findIndex((candidate: any) => candidate.id === company.id) + 1,
      total: ranked.length,
    }
  })

  return (
    <CompanyDetailText
      companyId={String(company.id)}
      slug={slug}
      name={company.name}
      logoUrl={companyLogoUrl(company.logo, company.logoFile)}
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
      description={company.description ? extractText(company.description) : ''}
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
  )
}
