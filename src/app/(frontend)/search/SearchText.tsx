'use client'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { CompanyCard } from '@/components/CompanyCard'
import { SearchBox } from '@/components/SearchBox'
import { useLanguage } from '@/i18n/LanguageContext'
import { insuranceTypeLabel } from '@/lib/insuranceTypeLabel'

type Company = {
  id: string
  slug: string
  name: string
  logoUrl?: string
  rating: number
  reviewCount: number
  verified?: boolean
  country?: string
  insuranceTypes?: { slug: string; title: string }[]
}

export function SearchText({ query, companies }: { query: string; companies: Company[] }) {
  const { t } = useLanguage()

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: t.common.home, href: '/' }, { label: t.search.pageTitle }]} />
      <h1 className="text-2xl font-bold mb-6">{t.search.pageTitle}</h1>
      <SearchBox initialQuery={query} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-8">
        {companies.map((company) => (
          <CompanyCard
            key={company.id}
            slug={company.slug}
            name={company.name}
            logoUrl={company.logoUrl}
            rating={company.rating}
            reviewCount={company.reviewCount}
            verified={company.verified}
            country={company.country}
            insuranceTypeLabels={(company.insuranceTypes || []).map((it) => insuranceTypeLabel(t, it))}
          />
        ))}
        {query && companies.length === 0 && (
          <p className="text-gray-500">
            {t.search.noResults} «{query}»
          </p>
        )}
      </div>
    </div>
  )
}
