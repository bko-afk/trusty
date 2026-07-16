'use client'

import Link from 'next/link'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { useLanguage } from '@/i18n/LanguageContext'

type Article = { id: string; slug: string; title: string; excerpt?: string }

export function ArticlesText({ articles }: { articles: Article[] }) {
  const { t } = useLanguage()

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: t.common.home, href: '/' }, { label: t.nav.articles }]} />
      <h1 className="text-2xl font-bold mb-6">{t.articlesPage.title}</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <Link key={article.id} href={`/articles/${article.slug}`} className="card p-4">
            <div className="font-semibold mb-1">{article.title}</div>
            <p className="text-sm text-gray-500 line-clamp-3">{article.excerpt}</p>
          </Link>
        ))}
        {articles.length === 0 && <p className="text-gray-500">{t.articlesPage.noArticles}</p>}
      </div>
    </div>
  )
}
