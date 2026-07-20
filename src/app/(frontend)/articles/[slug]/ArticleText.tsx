'use client'

import Image from 'next/image'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { useLanguage } from '@/i18n/LanguageContext'

export function ArticleText({
  title,
  excerpt,
  body,
  coverUrl,
  publishedAt,
}: {
  title: string
  excerpt?: string
  body: string
  coverUrl?: string
  publishedAt?: string
}) {
  const { t, locale } = useLanguage()
  const date = publishedAt ? new Date(publishedAt) : null
  const dateLocale = locale === 'ru' ? 'ru-RU' : locale === 'es' ? 'es-ES' : 'en-US'
  const dateLabel = date && !Number.isNaN(date.getTime())
    ? new Intl.DateTimeFormat(dateLocale, { dateStyle: 'long' }).format(date)
    : ''

  return (
    <article className="container-page max-w-4xl py-8 md:py-12">
      <Breadcrumbs
        items={[
          { label: t.common.home, href: '/' },
          { label: t.nav.articles, href: '/articles' },
          { label: title },
        ]}
      />
      <header className="mt-8">
        {dateLabel && <time className="section-kicker">{dateLabel}</time>}
        <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-[-0.04em] md:text-5xl">{title}</h1>
        {excerpt && <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-500">{excerpt}</p>}
      </header>
      {coverUrl && (
        <div className="relative mt-9 aspect-[16/8] overflow-hidden bg-gray-100">
          <Image src={coverUrl} alt={title} fill priority sizes="(max-width: 1024px) 100vw, 896px" className="object-cover" />
        </div>
      )}
      <div className="prose mt-10 max-w-none text-gray-700">
        {body.split(/\n{2,}/).filter(Boolean).map((paragraph, index) => (
          <p key={`${index}-${paragraph.slice(0, 24)}`}>{linkify(paragraph)}</p>
        ))}
      </div>
    </article>
  )
}

function linkify(text: string) {
  return text.split(/(https?:\/\/[^\s]+)/g).map((part, index) =>
    part.startsWith('http://') || part.startsWith('https://') ? (
      <a key={`${index}-${part}`} href={part} target="_blank" rel="noopener noreferrer nofollow">
        {part}
      </a>
    ) : part,
  )
}
