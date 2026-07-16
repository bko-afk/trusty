import { getPayloadClient } from '@/lib/getPayloadClient'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { CompanyCard } from '@/components/CompanyCard'

export const dynamic = 'force-dynamic'

export default async function RatingsPage() {
  const payload = await getPayloadClient()

  const companies = await payload.find({
    collection: 'companies',
    where: { status: { equals: 'published' } },
    sort: '-overallRating',
    limit: 50,
    depth: 1,
  })

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: 'Главная', href: '/' }, { label: 'Рейтинги' }]} />
      <h1 className="text-2xl font-bold mb-2">Рейтинг страховых компаний</h1>
      <p className="text-gray-500 mb-6">
        Рейтинг основан на среднем балле опубликованных отзывов клиентов.
      </p>

      <div className="card divide-y divide-gray-100">
        {companies.docs.map((company: any, index: number) => (
          <div key={company.id} className="flex items-center gap-4 p-4">
            <div className="w-8 text-center font-bold text-gray-400">{index + 1}</div>
            <div className="flex-1">
              <CompanyCard
                slug={company.slug}
                name={company.name}
                logoUrl={company.logo?.url}
                rating={company.overallRating || 0}
                reviewCount={company.reviewCount || 0}
                verified={company.verified}
                insuranceTypeLabel={company.insuranceTypes?.[0]?.title}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
