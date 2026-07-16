'use client'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { useLanguage } from '@/i18n/LanguageContext'

export function ArticleText({
  title,
  excerpt,
  body,
}: {
  title: string
  excerpt?: string
  body: string
}) {
  const { t } = useLanguage()

  return (
    <div className="container-page py-8 max-w-3xl">
      <Breadcrumbs
        items={[
          { label: t.common.home, href: '/' },
          { label: t.nav.articles, href: '/articles' },
          { label: title },
        ]}
      />
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      {excerpt && <p className="text-gray-500 mb-6">{excerpt}</p>}
      <div className="prose max-w-none text-gray-700">
        <p className="whitespace-pre-line">{body}</p>
      </div>
    </div>
  )
}
