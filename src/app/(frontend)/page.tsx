import { getPayloadClient } from '@/lib/getPayloadClient'
import { HomeText } from './HomeText'
import { sortCompaniesByRanking } from '@/lib/companyRanking'
import { getSiteSettings } from '@/lib/getSiteSettings'
import { mediaUrl } from '@/lib/seo'
import { articleCoverUrl } from '@/lib/articleCover'
import { unstable_cache } from 'next/cache'
import { getRequestLocale } from '@/i18n/seo'
import type { Locale } from '@/i18n/dictionary'

// Главную не обязательно перегенерировать на каждый запрос — модерация
// отзывов/компаний не мгновенная, поэтому кэшируем страницу на 60 секунд
// (ISR) вместо полного отключения кэша. Это заметно ускоряет отдачу
// страницы для большинства посетителей.
export const revalidate = 60

const getHomePageData = unstable_cache(async (locale: Locale) => {
  const payload = await getPayloadClient()
  return Promise.all([
    getSiteSettings(locale),
    payload.find({
      collection: 'companies',
      where: { status: { equals: 'published' } },
      sort: '-overallRating',
      limit: 100,
      depth: 1,
      locale,
    }),
    payload.find({
      collection: 'companies',
      where: { and: [{ status: { equals: 'published' } }, { popular: { equals: true } }] },
      sort: '-updatedAt',
      limit: 3,
      depth: 1,
      locale,
    }),
    payload.find({
      collection: 'companies',
      where: { status: { equals: 'published' } },
      sort: '-createdAt',
      limit: 12,
      depth: 1,
      locale,
    }),
    payload.find({
      collection: 'reviews',
      where: { status: { equals: 'published' } },
      sort: '-createdAt',
      limit: 12,
      depth: 1,
      locale,
    }),
    payload.find({
      collection: 'articles',
      where: { status: { equals: 'published' } },
      sort: '-publishedAt',
      limit: 4,
      depth: 1,
      locale,
      fallbackLocale: false,
    }),
  ])
}, ['home-page-data'], { revalidate: 60 })

function publishedRelations(value: unknown) {
  return (Array.isArray(value) ? value : []).filter(
    (company: any) => company && typeof company === 'object' && company.status === 'published',
  )
}

export default async function HomePage() {
  const locale = await getRequestLocale()
  const [siteSettings, companies, popularCompanies, newestCompanies, latestReviews, latestArticles] = await getHomePageData(locale)

  const homepage = siteSettings.homepage || {}
  const rankingLimit = Math.min(12, Math.max(3, Number(homepage.rankingLimit || 12)))
  const latestReviewsLimit = Math.min(12, Math.max(3, Number(homepage.latestReviewsLimit || 6)))
  const newCompaniesLimit = Math.min(12, Math.max(3, Number(homepage.newCompaniesLimit || 9)))
  const configuredRanking = publishedRelations(homepage.rankingCompanies)
  const configuredPopular = publishedRelations(homepage.popularCompanies)
  const configuredNewest = publishedRelations(homepage.newCompanies)
  const rankedCompanies = configuredRanking.length > 0 ? configuredRanking : companies.docs
  const highlightedCompanies = configuredPopular.length > 0 ? configuredPopular : popularCompanies.docs
  const freshCompanies = configuredNewest.length > 0 ? configuredNewest : newestCompanies.docs

  return (
    <HomeText
      companies={sortCompaniesByRanking(rankedCompanies).slice(0, rankingLimit)}
      popularCompanies={highlightedCompanies.slice(0, 3)}
      newestCompanies={freshCompanies.slice(0, newCompaniesLimit)}
      latestReviews={latestReviews.docs.slice(0, latestReviewsLimit)}
      latestArticles={latestArticles.docs.filter((article) => typeof article.title === 'string').map((article) => ({
        id: String(article.id),
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt || undefined,
        coverUrl: mediaUrl(article.cover) || articleCoverUrl(article.slug),
        publishedAt: article.publishedAt || article.createdAt,
      }))}
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
