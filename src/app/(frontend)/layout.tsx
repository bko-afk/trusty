import type { Metadata } from 'next'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { LanguageProvider } from '@/i18n/LanguageContext'
import { getPayloadClient } from '@/lib/getPayloadClient'
import { companyLogoUrl } from '@/lib/companyLogo'
import { getSiteSettings } from '@/lib/getSiteSettings'
import { absoluteUrl, mediaUrl, siteUrl } from '@/lib/seo'
import { JsonLd } from '@/components/JsonLd'
import './globals.css'

export const revalidate = 60

const fallbackTitle = 'Trusty — отзывы и рейтинги туристических страховых компаний'
const fallbackDescription =
  'Каталог туристических страховых компаний, рейтинги, реальные отзывы клиентов и статьи о страховании путешественников.'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const seo = settings.seo
  const siteName = seo?.siteName || 'Trusty'
  const title = seo?.defaultTitle || fallbackTitle
  const description = seo?.defaultDescription || fallbackDescription
  const socialImage = mediaUrl(seo?.socialImage)

  return {
    metadataBase: siteUrl(),
    applicationName: siteName,
    title: { default: title, template: `%s | ${siteName}` },
    description,
    keywords: [
      'страховые компании',
      'туристическая страховка',
      'медицинская страховка',
      'отзывы о страховках',
      'рейтинг страховых компаний',
    ],
    alternates: { canonical: '/' },
    openGraph: {
      type: 'website',
      locale: 'ru_RU',
      url: '/',
      siteName,
      title,
      description,
      images: socialImage ? [{ url: socialImage, alt: siteName }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: socialImage ? [socialImage] : undefined,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
    },
    verification: {
      google: seo?.googleVerification || undefined,
      yandex: seo?.yandexVerification || undefined,
    },
    category: 'insurance',
  }
}

// Список "популярных" компаний нужен в поисковой строке в хедере на
// каждой странице — подгружаем его один раз в layout (лёгкий запрос,
// limit 3) и прокидываем вниз, а не дёргаем с клиента отдельным fetch.
async function getPopularCompanies() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'companies',
    where: { and: [{ status: { equals: 'published' } }, { popular: { equals: true } }] },
    sort: '-updatedAt',
    limit: 3,
    depth: 1,
  })
  return result.docs.map((c: any) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    logoUrl: companyLogoUrl(c.logo, c.logoFile),
  }))
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [popularCompanies, settings] = await Promise.all([getPopularCompanies(), getSiteSettings()])
  const siteName = settings.seo?.siteName || 'Trusty'
  const rootUrl = absoluteUrl('/')

  return (
    <html lang="ru">
      <body className="min-h-screen flex flex-col">
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'Organization',
                '@id': `${rootUrl}#organization`,
                name: siteName,
                url: rootUrl,
                logo: absoluteUrl('/apple-icon.png'),
              },
              {
                '@type': 'WebSite',
                '@id': `${rootUrl}#website`,
                name: siteName,
                url: rootUrl,
                publisher: { '@id': `${rootUrl}#organization` },
                potentialAction: {
                  '@type': 'SearchAction',
                  target: `${absoluteUrl('/search')}?q={search_term_string}`,
                  'query-input': 'required name=search_term_string',
                },
              },
            ],
          }}
        />
        <LanguageProvider>
          <Header popularCompanies={popularCompanies} />
          <main className="flex-1">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  )
}
