import { getPayloadClient } from '@/lib/getPayloadClient'
import { toCatalogCompany } from '@/lib/catalogCompany'
import { CompaniesCatalogText } from './CompaniesCatalogText'
import { sortCompaniesByRanking } from '@/lib/companyRanking'
import { unstable_cache } from 'next/cache'
import { getRequestLocale, localizedPageMetadata } from '@/i18n/seo'
import type { Locale } from '@/i18n/dictionary'
import { applyCompanyReviewStats, reviewStatsByCompany } from '@/lib/companyReviewStats'

export const revalidate = 60

const getCatalogData = unstable_cache(async (locale: Locale) => {
  const payload = await getPayloadClient()
  return Promise.all([
    payload.find({ collection: 'insurance-types', sort: 'order', limit: 50, locale }),
    payload.find({
      collection: 'companies',
      where: { status: { equals: 'published' } },
      sort: '-overallRating',
      limit: 100,
      depth: 1,
      locale,
    }),
    payload.find({
      collection: 'reviews',
      where: { status: { equals: 'published' } },
      limit: 10000,
      depth: 0,
    }),
  ])
}, ['companies-catalog'], { revalidate: 60 })

export const generateMetadata = () => localizedPageMetadata('companies', '/companies')

export default async function CompaniesCatalogPage() {
  const locale = await getRequestLocale()
  const [insuranceTypes, companies, reviews] = await getCatalogData(locale)

  const rankedCompanies = sortCompaniesByRanking(
    applyCompanyReviewStats(companies.docs, reviewStatsByCompany(reviews.docs)),
  )
  const availableCountries = Array.from(
    new Set(rankedCompanies.map((company) => company.country).filter(Boolean)),
  ) as string[]

  return (
    <CompaniesCatalogText
      insuranceTypes={insuranceTypes.docs.map((type) => ({
        id: Number(type.id),
        slug: type.slug,
        title: type.title,
      }))}
      companies={rankedCompanies.map(toCatalogCompany)}
      availableCountries={availableCountries}
      updatedAt={new Date().toISOString()}
    />
  )
}
