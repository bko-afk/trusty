import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { unstable_cache } from 'next/cache'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { LanguageProvider } from '@/i18n/LanguageContext'
import { getPayloadClient } from '@/lib/getPayloadClient'
import { companyLogoUrl } from '@/lib/companyLogo'
import { getSiteSettings } from '@/lib/getSiteSettings'
import { absoluteUrl, mediaUrl, siteUrl } from '@/lib/seo'
import { JsonLd } from '@/components/JsonLd'
import { CustomerProvider } from '@/lib/useCustomer'
import { hasPayloadAuthCookie, toCustomerSession } from '@/lib/customerSession'
import { DEFAULT_LOCALE, isLocale } from '@/i18n/dictionary'
import {
  DEFAULT_SITE_DESCRIPTION,
  DEFAULT_SITE_TITLE,
  LEGACY_SITE_DESCRIPTION,
  LEGACY_SITE_TITLE,
  primarySeoValue,
} from '@/lib/siteDefaults'
import {
  getRequestLocale,
  getRequestPathname,
  localizedAlternates,
  localizedOpenGraph,
  rootSeoCopy,
} from '@/i18n/seo'
import { localizePath } from '@/i18n/routing'
import './globals.css'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const [locale, pathname] = await Promise.all([getRequestLocale(), getRequestPathname()])
  const settings = await getSiteSettings(locale)
  const seo = settings.seo
  const siteName = seo?.siteName || 'Trusty'
  const copy = rootSeoCopy[locale]
  const title = locale === DEFAULT_LOCALE
    ? primarySeoValue(seo?.defaultTitle, LEGACY_SITE_TITLE, DEFAULT_SITE_TITLE)
    : copy.title
  const description = locale === DEFAULT_LOCALE
    ? primarySeoValue(seo?.defaultDescription, LEGACY_SITE_DESCRIPTION, DEFAULT_SITE_DESCRIPTION)
    : copy.description
  const socialImage = mediaUrl(seo?.socialImage)

  return {
    metadataBase: siteUrl(),
    applicationName: siteName,
    title: { default: title, template: `%s | ${siteName}` },
    description,
    keywords: [...copy.keywords],
    alternates: localizedAlternates(pathname, locale),
    openGraph: {
      ...localizedOpenGraph(locale),
      type: 'website',
      url: localizePath(pathname, locale),
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
const getPopularCompanies = unstable_cache(async () => {
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
}, ['layout-popular-companies'], { revalidate: 60 })

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headerStore = await headers()
  const requestHeaders = new Headers(headerStore)
  const requestedLocale = headerStore.get('x-trusty-locale')
  const initialLocale = isLocale(requestedLocale) ? requestedLocale : DEFAULT_LOCALE
  const customerPromise = hasPayloadAuthCookie(requestHeaders.get('cookie'))
    ? getPayloadClient()
        .then((payload) => payload.auth({ headers: requestHeaders }))
        .then(({ user }) => toCustomerSession(user))
        .catch(() => null)
    : Promise.resolve(null)
  const [popularCompanies, settings, currentCustomer] = await Promise.all([
    getPopularCompanies(),
    getSiteSettings(initialLocale),
    customerPromise,
  ])
  const siteName = settings.seo?.siteName || 'Trusty'
  const rootUrl = absoluteUrl(localizePath('/', initialLocale))

  return (
    <html lang={initialLocale}>
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
                  target: `${absoluteUrl(localizePath('/search', initialLocale))}?q={search_term_string}`,
                  'query-input': 'required name=search_term_string',
                },
              },
            ],
          }}
        />
        <LanguageProvider initialLocale={initialLocale}>
          <CustomerProvider initialCustomer={currentCustomer}>
            <Header popularCompanies={popularCompanies} />
            <main className="flex-1">{children}</main>
            <Footer />
          </CustomerProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
