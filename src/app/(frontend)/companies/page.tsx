import type { Metadata } from 'next'
import { getPayloadClient } from '@/lib/getPayloadClient'
import { toCatalogCompany } from '@/lib/catalogCompany'
import { CompaniesCatalogText } from './CompaniesCatalogText'
import { sortCompaniesByRanking } from '@/lib/companyRanking'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Рейтинг страховых компаний',
  description:
    'Сравните туристические и медицинские страховые компании по отзывам клиентов, оценкам, странам и видам страхования.',
  alternates: { canonical: '/companies' },
  openGraph: {
    url: '/companies',
    title: 'Рейтинг страховых компаний',
    description: 'Независимый каталог страховых компаний с отзывами и редакционными позициями.',
  },
}

export default async function CompaniesCatalogPage() {
  const payload = await getPayloadClient()

  const [insuranceTypes, companies] = await Promise.all([
    payload.find({ collection: 'insurance-types', sort: 'order', limit: 50 }),
    payload.find({
      collection: 'companies',
      where: { status: { equals: 'published' } },
      sort: '-overallRating',
      limit: 100,
      depth: 1,
    }),
  ])

  const rankedCompanies = sortCompaniesByRanking(companies.docs)
  const availableCountries = Array.from(
    new Set(rankedCompanies.map((company) => company.country).filter(Boolean)),
  ) as string[]

  return (
    <CompaniesCatalogText
      insuranceTypes={insuranceTypes.docs.map((type) => ({
        id: Number(type.id),
        slug: type.slug,
        title: type.title,
      }))}
      companies={rankedCompanies.map(toCatalogCompany)}
      availableCountries={availableCountries}
      updatedAt={new Date().toISOString()}
    />
  )
}
