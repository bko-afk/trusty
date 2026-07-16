import Link from 'next/link'
import { getPayloadClient } from '@/lib/getPayloadClient'
import { CompanyCard } from '@/components/CompanyCard'
import { Breadcrumbs } from '@/components/Breadcrumbs'

export const dynamic = 'force-dynamic'

type SearchParams = { type?: string }

export default async function CompaniesCatalogPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const { type } = await searchParams
  const payload = await getPayloadClient()

  const insuranceTypes = await payload.find({ collection: 'insurance-types', sort: 'order' })

  const activeType = type
    ? insuranceTypes.docs.find((t: any) => t.slug === type)
    : undefined

  const where: any = { status: { equals: 'published' } }
  if (activeType) {
    where.insuranceTypes = { contains: activeType.id }
  }

  const companies = await payload.find({
    collection: 'companies',
    where,
    sort: '-overallRating',
    limit: 50,
    depth: 1,
  })

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: 'Главная', href: '/' }, { label: 'Каталог компаний' }]} />
      <h1 className="text-2xl font-bold mb-6">Каталог страховых компаний</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          href="/companies"
          className={`rounded-full border px-4 py-1.5 text-sm ${
            !activeType ? 'bg-brand text-white border-brand' : 'border-gray-200 hover:border-brand'
          }`}
        >
          Все виды
        </Link>
        {insuranceTypes.docs.map((t: any) => (
          <Link
            key={t.id}
            href={`/companies?type=${t.slug}`}
            className={`rounded-full border px-4 py-1.5 text-sm ${
              activeType?.id === t.id
                ? 'bg-brand text-white border-brand'
                : 'border-gray-200 hover:border-brand'
            }`}
          >
            {t.title}
          </Link>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {companies.docs.map((company: any) => (
          <CompanyCard
            key={company.id}
            slug={company.slug}
            name={company.name}
            logoUrl={company.logo?.url}
            rating={company.overallRating || 0}
            reviewCount={company.reviewCount || 0}
            verified={company.verified}
            insuranceTypeLabel={company.insuranceTypes?.[0]?.title}
          />
        ))}
        {companies.docs.length === 0 && (
          <p className="text-gray-500">По этому виду страхования пока нет компаний.</p>
        )}
      </div>
    </div>
  )
}
