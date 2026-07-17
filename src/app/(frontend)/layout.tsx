import type { Metadata } from 'next'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { LanguageProvider } from '@/i18n/LanguageContext'
import { getPayloadClient } from '@/lib/getPayloadClient'
import { companyLogoUrl } from '@/lib/companyLogo'
import './globals.css'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Trusty — отзывы и рейтинги туристических страховых компаний',
  description:
    'Каталог туристических страховых компаний, рейтинги, реальные отзывы клиентов и статьи о страховании путешественников.',
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
    depth: 0,
  })
  return result.docs.map((c: any) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    logoUrl: companyLogoUrl(c.logoFile),
  }))
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const popularCompanies = await getPopularCompanies()

  return (
    <html lang="ru">
      <body className="min-h-screen flex flex-col">
        <LanguageProvider>
          <Header popularCompanies={popularCompanies} />
          <main className="flex-1">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  )
}
