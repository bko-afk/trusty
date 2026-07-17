'use client'

import Link from 'next/link'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { CompanyCard } from '@/components/CompanyCard'
import { useLanguage } from '@/i18n/LanguageContext'
import { countries, countryFlag, countryName } from '@/lib/countries'
import { insuranceTypeLabel } from '@/lib/insuranceTypeLabel'

type InsuranceType = { id: string; slug: string; title: string }
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

export function CompaniesCatalogText({
  insuranceTypes,
  companies,
  availableCountries,
  activeTypeSlug,
  activeCountry,
}: {
  insuranceTypes: InsuranceType[]
  companies: Company[]
  availableCountries: string[]
  activeTypeSlug?: string
  activeCountry?: string
}) {
  const { t, locale } = useLanguage()

  function buildHref(next: { type?: string; country?: string }) {
    const params = new URLSearchParams()
    const nextType = next.type !== undefined ? next.type : activeTypeSlug
    const nextCountry = next.country !== undefined ? next.country : activeCountry
    if (nextType) params.set('type', nextType)
    if (nextCountry) params.set('country', nextCountry)
    const qs = params.toString()
    return qs ? `/companies?${qs}` : '/companies'
  }

  const countryList = countries.filter((c) => availableCountries.includes(c.code))

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: t.common.home, href: '/' }, { label: t.catalog.title }]} />
      <h1 className="text-2xl font-bold mb-2">{t.catalog.title}</h1>
      <p className="text-gray-500 mb-6">{t.catalog.subtitle}</p>

      <div className="flex flex-wrap gap-2 mb-3">
        <Link
          href={buildHref({ type: undefined })}
          className={`rounded-full border px-4 py-1.5 text-sm ${
            !activeTypeSlug ? 'bg-brand text-white border-brand' : 'border-gray-200 hover:border-brand'
          }`}
        >
          {t.catalog.allTypes}
        </Link>
        {insuranceTypes.map((type) => (
          <Link
            key={type.id}
            href={buildHref({ type: type.slug })}
            className={`rounded-full border px-4 py-1.5 text-sm ${
              activeTypeSlug === type.slug
                ? 'bg-brand text-white border-brand'
                : 'border-gray-200 hover:border-brand'
            }`}
          >
            {insuranceTypeLabel(t, type)}
          </Link>
        ))}
      </div>

      {countryList.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <Link
            href={buildHref({ country: undefined })}
            className={`rounded-full border px-3 py-1 text-xs ${
              !activeCountry ? 'bg-gray-800 text-white border-gray-800' : 'border-gray-200 hover:border-gray-400'
            }`}
          >
            {t.catalog.allCountries}
          </Link>
          {countryList.map((c) => (
            <Link
              key={c.code}
              href={buildHref({ country: c.code })}
              className={`flex items-center gap-1 rounded-full border px-3 py-1 text-xs ${
                activeCountry === c.code
                  ? 'bg-gray-800 text-white border-gray-800'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <span>{countryFlag(c.code)}</span>
              <span>{countryName(c.code, locale)}</span>
            </Link>
          ))}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {companies.map((company, index) => (
          <CompanyCard
            key={company.id}
            rank={index + 1}
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
        {companies.length === 0 && <p className="text-gray-500">{t.catalog.noResultsForType}</p>}
      </div>
    </div>
  )
}
