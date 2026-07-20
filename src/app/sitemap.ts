import type { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/getPayloadClient'
import { absoluteUrl } from '@/lib/seo'
import { DEFAULT_LOCALE, locales } from '@/i18n/dictionary'
import { localizePath } from '@/i18n/routing'

export const revalidate = 3600
export const dynamic = 'force-dynamic'

function sitemapDate(value: unknown): string | Date | undefined {
  if (value instanceof Date) return value
  if (typeof value === 'string' && !Number.isNaN(Date.parse(value))) return value
  return undefined
}

function localizedEntries(
  pathname: string,
  data: Omit<MetadataRoute.Sitemap[number], 'url' | 'alternates'>,
): MetadataRoute.Sitemap {
  const languages = {
    ...Object.fromEntries(
      locales.map((locale) => [locale, absoluteUrl(localizePath(pathname, locale))]),
    ),
    'x-default': absoluteUrl(localizePath(pathname, DEFAULT_LOCALE)),
  }

  return locales.map((locale) => ({
    ...data,
    url: absoluteUrl(localizePath(pathname, locale)),
    alternates: { languages },
  }))
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient()
  const [companies, articles] = await Promise.all([
    payload.find({
      collection: 'companies',
      where: { status: { equals: 'published' } },
      limit: 10000,
      depth: 0,
      select: { slug: true, updatedAt: true },
    }),
    payload.find({
      collection: 'articles',
      where: { status: { equals: 'published' } },
      limit: 10000,
      depth: 0,
      select: { slug: true, updatedAt: true, publishedAt: true },
    }),
  ])

  const staticPages: MetadataRoute.Sitemap = [
    ...localizedEntries('/', { changeFrequency: 'daily', priority: 1 }),
    ...localizedEntries('/companies', { changeFrequency: 'daily', priority: 0.9 }),
    ...localizedEntries('/articles', { changeFrequency: 'weekly', priority: 0.7 }),
  ]

  const companyPages: MetadataRoute.Sitemap = companies.docs.flatMap((company) => {
    const lastModified = sitemapDate(company.updatedAt)
    const base = `/companies/${company.slug}`
    return [
      ...localizedEntries(base, { lastModified, changeFrequency: 'weekly', priority: 0.8 }),
      ...localizedEntries(`${base}/reviews`, { lastModified, changeFrequency: 'weekly', priority: 0.65 }),
      ...localizedEntries(`${base}/complaints`, { lastModified, changeFrequency: 'weekly', priority: 0.55 }),
    ]
  })

  const articlePages: MetadataRoute.Sitemap = articles.docs.flatMap((article) =>
    localizedEntries(`/articles/${article.slug}`, {
      lastModified: sitemapDate(article.updatedAt) || sitemapDate(article.publishedAt),
      changeFrequency: 'monthly',
      priority: 0.65,
    }),
  )

  return [...staticPages, ...companyPages, ...articlePages]
}
