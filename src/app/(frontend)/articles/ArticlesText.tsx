'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { useLanguage } from '@/i18n/LanguageContext'

type Article = { id: string; slug: string; title: string; excerpt?: string; coverUrl?: string; publishedAt?: string }

export function ArticlesText({ articles }: { articles: Article[] }) {
  const { t, locale } = useLanguage()
  const dateLocale = locale === 'ru' ? 'ru-RU' : locale === 'es' ? 'es-ES' : 'en-US'

  return (
    <div className="bg-[#f6f8fb] pb-16">
      <div className="container-page py-8 md:py-12">
        <Breadcrumbs items={[{ label: t.common.home, href: '/' }, { label: t.nav.articles }]} />
        <div className="mt-8 max-w-3xl">
          <p className="section-kicker">{t.home.articlesKicker}</p>
          <h1 className="section-title mt-2">{t.articlesPage.title}</h1>
          <p className="mt-4 text-lg leading-8 text-gray-500">{t.home.articlesDescription}</p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => {
            const date = article.publishedAt ? new Date(article.publishedAt) : null
            const dateLabel = date && !Number.isNaN(date.getTime())
              ? new Intl.DateTimeFormat(dateLocale, { dateStyle: 'medium' }).format(date)
              : ''
            return (
              <Link key={article.id} href={`/articles/${article.slug}`} className="group flex min-h-[390px] flex-col overflow-hidden border border-gray-200 bg-white transition-transform hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(7,27,69,0.08)]">
                <div className="relative aspect-[16/9] overflow-hidden bg-[#e9eef6]">
                  {article.coverUrl ? (
                    <Image src={article.coverUrl} alt={article.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(145deg,#f1ebff_0%,#e5f2f1_55%,#e7edf7_100%)] text-brand">
                      <svg viewBox="0 0 64 64" className="h-14 w-14" fill="none" aria-hidden="true">
                        <path d="M13 15.5h25a8 8 0 0 1 8 8V49H21a8 8 0 0 1-8-8V15.5Z" stroke="currentColor" strokeWidth="3"/>
                        <path d="M21 15.5V49M28 25h11M28 32h11M28 39h7" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                        <path d="M46 23.5h5v30H25a4 4 0 0 1-4-4V49" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  {dateLabel && <time className="text-xs font-bold uppercase tracking-[0.1em] text-[#579c9e]">{dateLabel}</time>}
                  <h2 className="mt-3 text-xl font-extrabold leading-snug transition-colors group-hover:text-brand">{article.title}</h2>
                  {article.excerpt && <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-500">{article.excerpt}</p>}
                  <span className="dotted-link mt-auto pt-5 text-sm font-semibold">{t.home.readArticle}</span>
                </div>
              </Link>
            )
          })}
          {articles.length === 0 && <p className="text-gray-500">{t.articlesPage.noArticles}</p>}
        </div>
      </div>
    </div>
  )
}
