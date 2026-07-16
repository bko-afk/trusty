'use client'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { CompanyCard } from '@/components/CompanyCard'
import { useLanguage } from '@/i18n/LanguageContext'

type Company = {
  id: string
  slug: string
  name: string
  logoUrl?: string
  rating: number
  reviewCount: number
  verified?: boolean
  country?: string
  insuranceTypeLabels?: string[]
}

export function RatingsText({ companies }: { companies: Company[] }) {
  const { t } = useLanguage()

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: t.common.home, href: '/' }, { label: t.nav.ratings }]} />
      <h1 className="text-2xl font-bold mb-2">{t.ratingsPage.title}</h1>
      <p className="text-gray-500 mb-6">{t.ratingsPage.subtitle}</p>

      <div className="card divide-y divide-gray-100">
        {companies.map((company, index) => (
          <div key={company.id} className="flex items-center gap-4 p-4">
            <div className="w-8 text-center font-bold text-gray-400">{index + 1}</div>
            <div className="flex-1">
              <CompanyCard
                slug={company.slug}
                name={company.name}
                logoUrl={company.logoUrl}
                rating={company.rating}
                reviewCount={company.reviewCount}
                verified={company.verified}
                country={company.country}
                insuranceTypeLabels={company.insuranceTypeLabels}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
