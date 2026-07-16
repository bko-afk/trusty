import { getPayloadClient } from '@/lib/getPayloadClient'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { CompanyCard } from '@/components/CompanyCard'
import { SearchBox } from '@/components/SearchBox'

export const dynamic = 'force-dynamic'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q = '' } = await searchParams
  const payload = await getPayloadClient()

  const companies = q
    ? await payload.find({
        collection: 'companies',
        where: {
          and: [{ status: { equals: 'published' } }, { name: { like: q } }],
        },
        depth: 1,
        limit: 30,
      })
    : { docs: [] as any[] }

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: 'Главная', href: '/' }, { label: 'Поиск' }]} />
      <h1 className="text-2xl font-bold mb-6">Поиск страховых компаний</h1>
      <SearchBox initialQuery={q} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-8">
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
        {q && companies.docs.length === 0 && (
          <p className="text-gray-500">Ничего не найдено по запросу «{q}».</p>
        )}
      </div>
    </div>
  )
}
