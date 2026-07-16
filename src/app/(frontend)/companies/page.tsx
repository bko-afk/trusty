import { getPayloadClient } from '@/lib/getPayloadClient'
import { CompaniesCatalogText } from './CompaniesCatalogText'

export const dynamic = 'force-dynamic'

type SearchParams = { type?: string; country?: string }

export default async function CompaniesCatalogPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const { type, country } = await searchParams
  const payload = await getPayloadClient()

  const insuranceTypes = await payload.find({ collection: 'insurance-types', sort: 'order' })
  const activeType = type ? insuranceTypes.docs.find((t: any) => t.slug === type) : undefined

  const and: any[] = [{ status: { equals: 'published' } }]
  if (activeType) and.push({ insuranceTypes: { contains: activeType.id } })
  if (country) and.push({ country: { equals: country } })

  const [companies, allPublished] = await Promise.all([
    payload.find({
      collection: 'companies',
      where: and.length > 1 ? { and } : { status: { equals: 'published' } },
      sort: '-overallRating',
      limit: 50,
      depth: 1,
    }),
    payload.find({
      collection: 'companies',
      where: { status: { equals: 'published' } },
      limit: 200,
      depth: 0,
    }),
  ])

  const availableCountries = Array.from(
    new Set(allPublished.docs.map((c: any) => c.country).filter(Boolean)),
  ) as string[]

  return (
    <CompaniesCatalogText
      insuranceTypes={insuranceTypes.docs.map((t: any) => ({ id: t.id, slug: t.slug, title: t.title }))}
      companies={companies.docs.map((c: any) => ({
        id: c.id,
        slug: c.slug,
        name: c.name,
        logoUrl: c.logo?.url,
        rating: c.overallRating || 0,
        reviewCount: c.reviewCount || 0,
        verified: c.verified,
        country: c.country,
        insuranceTypeLabels: (c.insuranceTypes || []).map((it: any) => it.title),
      }))}
      availableCountries={availableCountries}
      activeTypeSlug={type}
      activeCountry={country}
    />
  )
}
