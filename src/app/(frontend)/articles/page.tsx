import { getPayloadClient } from '@/lib/getPayloadClient'
import { ArticlesText } from './ArticlesText'
import { mediaUrl } from '@/lib/seo'
import { articleCoverUrl } from '@/lib/articleCover'
import { unstable_cache } from 'next/cache'
import { getRequestLocale, localizedPageMetadata } from '@/i18n/seo'
import type { Locale } from '@/i18n/dictionary'

export const revalidate = 300

const getArticles = unstable_cache(async (locale: Locale) => {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'articles',
    where: { status: { equals: 'published' } },
    sort: '-publishedAt',
    limit: 50,
    depth: 1,
    locale,
  })
}, ['articles-list'], { revalidate: 300 })

export const generateMetadata = () => localizedPageMetadata('articles', '/articles')

export default async function ArticlesPage() {
  const locale = await getRequestLocale()
  const articles = await getArticles(locale)

  return (
    <ArticlesText
      articles={articles.docs.map((a: any) => ({
        id: a.id,
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt,
        coverUrl: mediaUrl(a.cover) || articleCoverUrl(a.slug),
        publishedAt: a.publishedAt || a.createdAt,
      }))}
    />
  )
}
