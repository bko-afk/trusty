import type { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/getPayloadClient'
import { absoluteUrl } from '@/lib/seo'

export const revalidate = 3600

function sitemapDate(value: unknown): string | Date | undefined {
  if (value instanceof Date) return value
  if (typeof value === 'string' && !Number.isNaN(Date.parse(value))) return value
  return undefined
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
    { url: absoluteUrl('/'), changeFrequency: 'daily', priority: 1 },
    { url: absoluteUrl('/companies'), changeFrequency: 'daily', priority: 0.9 },
    { url: absoluteUrl('/articles'), changeFrequency: 'weekly', priority: 0.7 },
  ]

  const companyPages: MetadataRoute.Sitemap = companies.docs.flatMap((company) => {
    const lastModified = sitemapDate(company.updatedAt)
    const base = `/companies/${company.slug}`
    return [
      { url: absoluteUrl(base), lastModified, changeFrequency: 'weekly', priority: 0.8 },
      { url: absoluteUrl(`${base}/reviews`), lastModified, changeFrequency: 'weekly', priority: 0.65 },
      { url: absoluteUrl(`${base}/complaints`), lastModified, changeFrequency: 'weekly', priority: 0.55 },
    ]
  })

  const articlePages: MetadataRoute.Sitemap = articles.docs.map((article) => ({
    url: absoluteUrl(`/articles/${article.slug}`),
    lastModified: sitemapDate(article.updatedAt) || sitemapDate(article.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.65,
  }))

  return [...staticPages, ...companyPages, ...articlePages]
}
