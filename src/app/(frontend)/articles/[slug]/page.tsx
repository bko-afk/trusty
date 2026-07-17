import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/getPayloadClient'
import { ArticleText } from './ArticleText'

export const revalidate = 300

function extractText(node: any): string {
  if (!node) return ''
  if (typeof node === 'string') return node
  if (node.root) return extractText(node.root)
  if (Array.isArray(node.children)) {
    return node.children.map(extractText).join(node.type === 'paragraph' ? '\n\n' : '')
  }
  if (typeof node.text === 'string') return node.text
  return ''
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'articles',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    limit: 1,
  })
  const article: any = result.docs[0]
  if (!article) notFound()

  return (
    <ArticleText
      title={article.title}
      excerpt={article.excerpt}
      body={article.body ? extractText(article.body) : ''}
    />
  )
}
