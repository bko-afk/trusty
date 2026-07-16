import { getPayloadClient } from '@/lib/getPayloadClient'
import { companyLogoUrl } from '@/lib/companyLogo'
import { SearchText } from './SearchText'

export const dynamic = 'force-dynamic'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q = '' } = await searchParams
  const payload = await getPayloadClient()

  const companies = q
    ? await payload.find({
        collection: 'companies',
        where: {
          and: [{ status: { equals: 'published' } }, { name: { like: q } }],
        },
        depth: 1,
        limit: 30,
      })
    : { docs: [] as any[] }

  return (
    <SearchText
      query={q}
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
