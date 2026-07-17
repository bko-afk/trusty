import { getPayloadClient } from '@/lib/getPayloadClient'
import { toCatalogCompany } from '@/lib/catalogCompany'
import { CompaniesCatalogText } from './CompaniesCatalogText'

export const revalidate = 60

export default async function CompaniesCatalogPage() {
  const payload = await getPayloadClient()

  const [insuranceTypes, companies] = await Promise.all([
    payload.find({ collection: 'insurance-types', sort: 'order', limit: 50 }),
    payload.find({
      collection: 'companies',
      where: { status: { equals: 'published' } },
      sort: '-overallRating',
      limit: 100,
      depth: 1,
    }),
  ])

  const availableCountries = Array.from(
    new Set(companies.docs.map((company) => company.country).filter(Boolean)),
  ) as string[]

  return (
    <CompaniesCatalogText
      insuranceTypes={insuranceTypes.docs.map((type) => ({ id: type.id, slug: type.slug, title: type.title }))}
      companies={companies.docs.map(toCatalogCompany)}
      availableCountries={availableCountries}
    />
  )
}
