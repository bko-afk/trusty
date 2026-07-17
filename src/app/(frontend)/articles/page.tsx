import type { Metadata } from 'next'
import { getPayloadClient } from '@/lib/getPayloadClient'
import { ArticlesText } from './ArticlesText'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Статьи о страховании',
  description:
    'Практические материалы о туристическом и медицинском страховании, выборе полиса и действиях при страховом случае.',
  alternates: { canonical: '/articles' },
  openGraph: {
    url: '/articles',
    title: 'Статьи о страховании',
    description: 'Гайды и разборы Trusty о страховании путешественников.',
  },
}

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
