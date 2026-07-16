import Link from 'next/link'
import { getPayloadClient } from '@/lib/getPayloadClient'
import { Breadcrumbs } from '@/components/Breadcrumbs'

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
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: 'Главная', href: '/' }, { label: 'Статьи и обзоры' }]} />
      <h1 className="text-2xl font-bold mb-6">Статьи и обзоры о страховании</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {articles.docs.map((article: any) => (
          <Link key={article.id} href={`/articles/${article.slug}`} className="card p-4">
            <div className="font-semibold mb-1">{article.title}</div>
            <p className="text-sm text-gray-500 line-clamp-3">{article.excerpt}</p>
          </Link>
        ))}
        {articles.docs.length === 0 && <p className="text-gray-500">Статей пока нет.</p>}
      </div>
    </div>
  )
}
