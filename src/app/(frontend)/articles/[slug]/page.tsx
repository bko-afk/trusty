import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArticleText } from './ArticleText'
import { getPublishedArticle } from '@/lib/getPublishedContent'
import { absoluteUrl, mediaUrl, plainDescription } from '@/lib/seo'
import { richTextToPlainText } from '@/lib/richText'
import { JsonLd } from '@/components/JsonLd'
import { articleCoverUrl } from '@/lib/articleCover'
import { getRequestLocale, localizedAlternates, localizedOpenGraph } from '@/i18n/seo'
import { localizePath } from '@/i18n/routing'

export const revalidate = 300

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const locale = await getRequestLocale()
  const article: any = await getPublishedArticle(slug, locale)
  if (!article) return { title: 'Article not found', robots: { index: false, follow: false } }

  const title = article.seo?.title || article.title
  const description = plainDescription(
    article.seo?.description || article.excerpt,
    locale === 'ru'
      ? `Практический материал Trusty о страховании: ${article.title}.`
      : locale === 'es'
        ? `Guía práctica de Trusty sobre seguros: ${article.title}.`
        : `A practical Trusty guide to travel insurance: ${article.title}.`,
  )
  const image = mediaUrl(article.cover) || articleCoverUrl(slug)
  const canonical = `/articles/${slug}`

  return {
    title,
    description,
    alternates: localizedAlternates(canonical, locale),
    openGraph: {
      ...localizedOpenGraph(locale),
      type: 'article',
      url: localizePath(canonical, locale),
      title,
      description,
      publishedTime: article.publishedAt || undefined,
      modifiedTime: article.updatedAt || undefined,
      images: image ? [{ url: image, alt: article.title }] : undefined,
    },
    twitter: { card: 'summary_large_image', description, images: image ? [image] : undefined },
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const locale = await getRequestLocale()
  const article: any = await getPublishedArticle(slug, locale)
  if (!article) notFound()

  const body = article.body ? richTextToPlainText(article.body) : ''
  const image = mediaUrl(article.cover) || articleCoverUrl(slug)

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: article.title,
          description: plainDescription(article.excerpt, `Trusty insurance guide: ${article.title}.`),
          url: absoluteUrl(localizePath(`/articles/${slug}`, locale)),
          image: image ? absoluteUrl(image) : undefined,
          datePublished: article.publishedAt || undefined,
          dateModified: article.updatedAt || undefined,
          publisher: { '@type': 'Organization', name: 'Trusty', url: absoluteUrl('/') },
        }}
      />
      <ArticleText
        title={article.title}
        excerpt={article.excerpt}
        body={body}
        coverUrl={image}
        publishedAt={article.publishedAt || article.createdAt}
      />
    </>
  )
}
