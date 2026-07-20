import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { getPayloadClient } from './getPayloadClient'
import { DEFAULT_LOCALE, type Locale } from '@/i18n/dictionary'

const getCachedPublishedCompany = unstable_cache(async (slug: string, locale: Locale) => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'companies',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    depth: 2,
    limit: 1,
    locale,
    fallbackLocale: false,
  })
  return result.docs[0]
}, ['published-company'], { revalidate: 60 })

const getCachedPublishedArticle = unstable_cache(async (slug: string, locale: Locale) => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'articles',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    depth: 1,
    limit: 1,
    locale,
    fallbackLocale: false,
  })
  return result.docs[0]
}, ['published-article'], { revalidate: 300 })

export const getPublishedCompany = cache((slug: string, locale: Locale = DEFAULT_LOCALE) =>
  getCachedPublishedCompany(slug, locale),
)
export const getPublishedArticle = cache((slug: string, locale: Locale = DEFAULT_LOCALE) =>
  getCachedPublishedArticle(slug, locale),
)

const getCachedArticleLocales = unstable_cache(async (slug: string) => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'articles',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    limit: 1,
    depth: 0,
    locale: 'all',
    fallbackLocale: false,
    select: { title: true },
  })
  const title = result.docs[0]?.title as unknown
  if (!title || typeof title !== 'object') return [] as Locale[]
  return (Object.keys(title) as Locale[]).filter(
    (locale) => typeof (title as Record<string, unknown>)[locale] === 'string',
  )
}, ['published-article-locales'], { revalidate: 300 })

export const getPublishedArticleLocales = cache((slug: string) => getCachedArticleLocales(slug))
