import { getPayloadClient } from '@/lib/getPayloadClient'
import { companyLogoUrl } from '@/lib/companyLogo'
import { SearchText } from './SearchText'
import { getRequestLocale, localizedPageMetadata } from '@/i18n/seo'

export const revalidate = 30

export const generateMetadata = () => localizedPageMetadata('search', '/search', { noIndex: true })

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q = '' } = await searchParams
  const locale = await getRequestLocale()
  const query = q.trim().slice(0, 120)
  const payload = await getPayloadClient()

  const companies = query
    ? await payload.find({
        collection: 'companies',
        where: {
          and: [{ status: { equals: 'published' } }, { name: { like: query } }],
        },
        depth: 1,
        limit: 30,
        locale,
      })
    : { docs: [] as any[] }

  return (
    <SearchText
      query={query}
      companies={companies.docs.map((c: any) => ({
        id: c.id,
        slug: c.slug,
        name: c.name,
        logoUrl: companyLogoUrl(c.logo, c.logoFile),
        rating: c.overallRating || 0,
        reviewCount: c.reviewCount || 0,
        verified: c.verified,
        country: c.country,
        insuranceTypes: (c.insuranceTypes || []).map((it: any) => ({ slug: it.slug, title: it.title })),
      }))}
    />
  )
}
