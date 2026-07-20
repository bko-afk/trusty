import { getPayloadClient } from '@/lib/getPayloadClient'
import { toCatalogCompany } from '@/lib/catalogCompany'
import { CompaniesCatalogText } from './CompaniesCatalogText'
import { unstable_cache } from 'next/cache'
import { getRequestLocale, localizedPageMetadata } from '@/i18n/seo'
import type { Locale } from '@/i18n/dictionary'

export const revalidate = 60

const getCatalogData = unstable_cache(async (locale: Locale) => {
  const payload = await getPayloadClient()
  return Promise.all([
    payload.find({ collection: 'insurance-types', sort: 'order', limit: 50, locale }),
    payload.find({
      collection: 'companies',
      where: { status: { equals: 'published' } },
      sort: ['ranking.globalPosition', '-overallRating', 'name'],
      limit: 25,
      page: 1,
      depth: 1,
      locale,
    }),
  ])
}, ['companies-catalog'], { revalidate: 60 })

export const generateMetadata = () => localizedPageMetadata('companies', '/companies')

export default async function CompaniesCatalogPage() {
  const locale = await getRequestLocale()
  const [insuranceTypes, companies] = await getCatalogData(locale)

  return (
    <CompaniesCatalogText
      insuranceTypes={insuranceTypes.docs.map((type) => ({
        id: Number(type.id),
        slug: type.slug,
        title: type.title,
      }))}
      companies={companies.docs.map(toCatalogCompany)}
      total={companies.totalDocs}
      totalPages={companies.totalPages}
      updatedAt={new Date().toISOString()}
    />
  )
}
