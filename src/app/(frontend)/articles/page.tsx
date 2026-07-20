import { getPayloadClient } from '@/lib/getPayloadClient'
import { ArticlesText } from './ArticlesText'
import { mediaUrl } from '@/lib/seo'
import { articleCoverUrl } from '@/lib/articleCover'
import { unstable_cache } from 'next/cache'
import { getRequestLocale, localizedPageMetadata } from '@/i18n/seo'
import type { Locale } from '@/i18n/dictionary'
import { boundedPage } from '@/lib/pagination'

export const revalidate = 300

const getArticles = unstable_cache(async (locale: Locale, page: number) => {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'articles',
    where: { status: { equals: 'published' } },
    sort: '-publishedAt',
    limit: 12,
    page,
    depth: 1,
    locale,
    fallbackLocale: false,
  })
}, ['articles-list'], { revalidate: 300 })

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const page = boundedPage((await searchParams).page)
  return localizedPageMetadata('articles', page > 1 ? `/articles?page=${page}` : '/articles')
}

export default async function ArticlesPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const locale = await getRequestLocale()
  const page = boundedPage((await searchParams).page)
  const articles = await getArticles(locale, page)

  return (
    <ArticlesText
      articles={articles.docs.filter((a: any) => typeof a.title === 'string').map((a: any) => ({
        id: a.id,
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt,
        coverUrl: mediaUrl(a.cover) || articleCoverUrl(a.slug),
        publishedAt: a.publishedAt || a.createdAt,
      }))}
      pagination={{ page: articles.page || page, totalPages: articles.totalPages }}
    />
  )
}
