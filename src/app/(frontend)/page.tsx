import { getPayloadClient } from '@/lib/getPayloadClient'
import { HomeText } from './HomeText'
import { sortCompaniesByRanking } from '@/lib/companyRanking'
import { getSiteSettings } from '@/lib/getSiteSettings'

// Главную не обязательно перегенерировать на каждый запрос — модерация
// отзывов/компаний не мгновенная, поэтому кэшируем страницу на 60 секунд
// (ISR) вместо полного отключения кэша. Это заметно ускоряет отдачу
// страницы для большинства посетителей.
export const revalidate = 60

function publishedRelations(value: unknown) {
  return (Array.isArray(value) ? value : []).filter(
    (company: any) => company && typeof company === 'object' && company.status === 'published',
  )
}

export default async function HomePage() {
  const payload = await getPayloadClient()
  const [siteSettings, companies, popularCompanies, newestCompanies, latestReviews] = await Promise.all([
    getSiteSettings(),
    payload.find({
      collection: 'companies',
      where: { status: { equals: 'published' } },
      sort: '-overallRating',
      limit: 100,
      depth: 1,
    }),
    payload.find({
      collection: 'companies',
      where: { and: [{ status: { equals: 'published' } }, { popular: { equals: true } }] },
      sort: '-updatedAt',
      limit: 3,
      depth: 1,
    }),
    payload.find({
      collection: 'companies',
      where: { status: { equals: 'published' } },
      sort: '-createdAt',
      limit: 12,
      depth: 1,
    }),
    payload.find({
      collection: 'reviews',
      where: { status: { equals: 'published' } },
      sort: '-createdAt',
      limit: 12,
      depth: 1,
    }),
  ])

  const homepage = siteSettings.homepage || {}
  const rankingLimit = Math.min(12, Math.max(3, Number(homepage.rankingLimit || 12)))
  const latestReviewsLimit = Math.min(12, Math.max(3, Number(homepage.latestReviewsLimit || 6)))
  const newCompaniesLimit = Math.min(12, Math.max(3, Number(homepage.newCompaniesLimit || 9)))
  const configuredRanking = publishedRelations(homepage.rankingCompanies)
  const configuredPopular = publishedRelations(homepage.popularCompanies)
  const configuredNewest = publishedRelations(homepage.newCompanies)

  return (
    <HomeText
      companies={(configuredRanking.length > 0 ? configuredRanking : sortCompaniesByRanking(companies.docs)).slice(0, rankingLimit)}
      popularCompanies={(configuredPopular.length > 0 ? configuredPopular : popularCompanies.docs).slice(0, 3)}
      newestCompanies={(configuredNewest.length > 0 ? configuredNewest : newestCompanies.docs).slice(0, newCompaniesLimit)}
      latestReviews={latestReviews.docs.slice(0, latestReviewsLimit)}
      visibility={{
        services: homepage.showServices !== false,
        complaintCTA: homepage.showComplaintCTA !== false,
        companyRanking: homepage.showCompanyRanking !== false,
        latestReviews: homepage.showLatestReviews !== false,
        methodology: homepage.showMethodology !== false,
        newCompanies: homepage.showNewCompanies !== false,
      }}
    />
  )
}
