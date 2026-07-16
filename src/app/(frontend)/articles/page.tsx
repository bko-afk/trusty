import { getPayloadClient } from '@/lib/getPayloadClient'
import { ArticlesText } from './ArticlesText'

export const dynamic = 'force-dynamic'

export default async function ArticlesPage() {
  const payload = await getPayloadClient()
  const articles = await payload.find({
    collection: 'articles',
    where: { status: { equals: 'published' } },
    sort: '-publishedAt',
    limit: 50,
  })

  return (
    <ArticlesText
      articles={articles.docs.map((a: any) => ({
        id: a.id,
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt,
      }))}
    />
  )
}
