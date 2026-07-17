import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArticleText } from './ArticleText'
import { getPublishedArticle } from '@/lib/getPublishedContent'
import { absoluteUrl, mediaUrl, plainDescription } from '@/lib/seo'
import { richTextToPlainText } from '@/lib/richText'
import { JsonLd } from '@/components/JsonLd'

export const revalidate = 300

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article: any = await getPublishedArticle(slug)
  if (!article) return { title: 'Статья не найдена', robots: { index: false, follow: false } }

  const title = article.seo?.title || article.title
  const description = plainDescription(
    article.seo?.description || article.excerpt,
    `Статья «${article.title}» о страховании путешественников.`,
  )
  const image = mediaUrl(article.cover)
  const canonical = `/articles/${slug}`

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      url: canonical,
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
  const article: any = await getPublishedArticle(slug)
  if (!article) notFound()

  const body = article.body ? richTextToPlainText(article.body) : ''
  const image = mediaUrl(article.cover)

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: article.title,
          description: plainDescription(article.excerpt, `Статья «${article.title}».`),
          url: absoluteUrl(`/articles/${slug}`),
          image: image ? absoluteUrl(image) : undefined,
          datePublished: article.publishedAt || undefined,
          dateModified: article.updatedAt || undefined,
          publisher: { '@type': 'Organization', name: 'Trusty', url: absoluteUrl('/') },
        }}
      />
      <ArticleText title={article.title} excerpt={article.excerpt} body={body} />
    </>
  )
}
