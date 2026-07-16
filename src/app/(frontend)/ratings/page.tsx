import { getPayloadClient } from '@/lib/getPayloadClient'
import { companyLogoUrl } from '@/lib/companyLogo'
import { RatingsText } from './RatingsText'

export const dynamic = 'force-dynamic'

export default async function RatingsPage() {
  const payload = await getPayloadClient()

  const companies = await payload.find({
    collection: 'companies',
    where: { status: { equals: 'published' } },
    sort: '-overallRating',
    limit: 50,
    depth: 1,
  })

  return (
    <RatingsText
      companies={companies.docs.map((c: any) => ({
        id: c.id,
        slug: c.slug,
        name: c.name,
        logoUrl: companyLogoUrl(c.logoFile),
        rating: c.overallRating || 0,
        reviewCount: c.reviewCount || 0,
        verified: c.verified,
        country: c.country,
        insuranceTypes: (c.insuranceTypes || []).map((it: any) => ({ slug: it.slug, title: it.title })),
      }))}
    />
  )
}
