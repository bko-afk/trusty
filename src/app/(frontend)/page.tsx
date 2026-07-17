import { getPayloadClient } from '@/lib/getPayloadClient'
import { HomeText } from './HomeText'

// Главную не обязательно перегенерировать на каждый запрос — модерация
// отзывов/компаний не мгновенная, поэтому кэшируем страницу на 60 секунд
// (ISR) вместо полного отключения кэша. Это заметно ускоряет отдачу
// страницы для большинства посетителей.
export const revalidate = 60

export default async function HomePage() {
  const payload = await getPayloadClient()

  const [companies, popularCompanies, newestCompanies, latestReviews] = await Promise.all([
    payload.find({
      collection: 'companies',
      where: { status: { equals: 'published' } },
      sort: '-overallRating',
      limit: 12,
      depth: 1,
    }),
    payload.find({
      collection: 'companies',
      where: { and: [{ status: { equals: 'published' } }, { popular: { equals: true } }] },
      sort: '-updatedAt',
      limit: 3,
      depth: 0,
    }),
    payload.find({
      collection: 'companies',
      where: { status: { equals: 'published' } },
      sort: '-createdAt',
      limit: 9,
      depth: 0,
    }),
    payload.find({
      collection: 'reviews',
      where: { status: { equals: 'published' } },
      sort: '-createdAt',
      limit: 6,
      depth: 1,
    }),
  ])

  return (
    <HomeText
      companies={companies.docs}
      popularCompanies={popularCompanies.docs}
      newestCompanies={newestCompanies.docs}
      latestReviews={latestReviews.docs}
    />
  )
}
