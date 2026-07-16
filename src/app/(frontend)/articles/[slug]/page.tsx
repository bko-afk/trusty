import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/getPayloadClient'
import { Breadcrumbs } from '@/components/Breadcrumbs'

export const dynamic = 'force-dynamic'

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
    <div className="container-page py-8 max-w-3xl">
      <Breadcrumbs
        items={[
          { label: 'Главная', href: '/' },
          { label: 'Статьи и обзоры', href: '/articles' },
          { label: article.title },
        ]}
      />
      <h1 className="text-2xl font-bold mb-4">{article.title}</h1>
      <p className="text-gray-500 mb-6">{article.excerpt}</p>
      <div className="prose max-w-none text-gray-700">
        <RichText content={article.body} />
      </div>
    </div>
  )
}

function RichText({ content }: { content: any }) {
  const text = extractText(content)
  return <p className="whitespace-pre-line">{text}</p>
}

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
