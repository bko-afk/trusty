'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useDeferredValue, useState } from 'react'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { RatingStars } from '@/components/RatingStars'
import { useLanguage } from '@/i18n/LanguageContext'
import { countries, countryName } from '@/lib/countries'
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
  const [query, setQuery] = useState('')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const deferredQuery = useDeferredValue(query.trim().toLocaleLowerCase(locale))

  function buildHref(next: { type?: string; country?: string }) {
    const params = new URLSearchParams()
    const nextType = next.type !== undefined ? next.type : activeTypeSlug
    const nextCountry = next.country !== undefined ? next.country : activeCountry
    if (nextType) params.set('type', nextType)
    if (nextCountry) params.set('country', nextCountry)
    const qs = params.toString()
    return qs ? `/companies?${qs}` : '/companies'
  }

  const visibleCompanies = companies.filter((company) => {
    if (verifiedOnly && !company.verified) return false
    return !deferredQuery || company.name.toLocaleLowerCase(locale).includes(deferredQuery)
  })
  const countryList = countries.filter((country) => availableCountries.includes(country.code))

  return (
    <div>
      <section className="border-b border-gray-200 bg-white py-8 md:py-14">
        <div className="container-page">
          <Breadcrumbs items={[{ label: t.common.home, href: '/' }, { label: t.portal.ranking.ratingsBreadcrumb, href: '/companies' }, { label: t.portal.ranking.onlineInsuranceBreadcrumb }]} />
          <div className="mt-8 grid gap-6 md:grid-cols-[96px_1fr] md:items-start">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand text-2xl font-bold text-white md:h-24 md:w-24">{t.portal.ranking.marker}</div>
            <div>
              <h1 className="max-w-4xl text-4xl font-extrabold leading-[1.05] tracking-[-0.045em] md:text-6xl">{t.portal.ranking.title}</h1>
              <p className="mt-7 max-w-4xl text-lg leading-8 text-gray-600">{t.portal.ranking.intro}</p>
              <div className="mt-7 flex flex-wrap gap-x-7 gap-y-3 text-base md:text-lg">
                <Link href={buildHref({ type: undefined })} className={`border-b border-dotted ${!activeTypeSlug ? 'border-brand font-bold text-brand' : 'border-current text-brand-dark'}`}>{t.catalog.allTypes}</Link>
                {insuranceTypes.map((type) => (
                  <Link key={type.id} href={buildHref({ type: type.slug })} className={`border-b border-dotted ${activeTypeSlug === type.slug ? 'border-brand font-bold text-brand' : 'border-current text-brand-dark'}`}>{insuranceTypeLabel(t, type)}</Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-8 md:py-12">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div><span className="font-extrabold">{visibleCompanies.length}</span> {t.portal.ranking.companiesInRating}</div>
          <button type="button" onClick={() => setFilterOpen((open) => !open)} className="btn-secondary px-4 py-2 text-sm">{filterOpen ? t.portal.ranking.hideFilter : t.portal.ranking.showFilter}</button>
        </div>

        {filterOpen && (
          <div className="mb-7 grid gap-5 border border-gray-200 bg-[#f7f8fa] p-5 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <label htmlFor="company-filter" className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">{t.portal.ranking.companyName}</label>
              <input id="company-filter" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.portal.ranking.companyNamePlaceholder} className="h-12 w-full border border-gray-300 bg-white px-4 focus:border-brand focus:outline-none" />
            </div>
            <label className="flex h-12 cursor-pointer items-center gap-3 border border-gray-300 bg-white px-4 text-sm font-semibold">
              <input type="checkbox" checked={verifiedOnly} onChange={(event) => setVerifiedOnly(event.target.checked)} className="h-4 w-4 accent-brand" />
              {t.portal.ranking.verifiedOnly}
            </label>
          </div>
        )}

        {countryList.length > 0 && (
          <div className="mb-7 flex flex-wrap gap-2">
            <Link href={buildHref({ country: undefined })} className={`border px-3 py-2 text-xs font-bold ${!activeCountry ? 'border-brand bg-brand text-white' : 'border-gray-200 hover:border-brand'}`}>{t.catalog.allCountries}</Link>
            {countryList.map((country) => (
              <Link key={country.code} href={buildHref({ country: country.code })} className={`border px-3 py-2 text-xs font-bold ${activeCountry === country.code ? 'border-brand bg-brand text-white' : 'border-gray-200 hover:border-brand'}`}>{countryName(country.code, locale)}</Link>
            ))}
          </div>
        )}

        <div className="border-y border-gray-200">
          <div className="hidden grid-cols-[80px_1.55fr_0.7fr_0.7fr_1fr] gap-5 border-b border-gray-200 bg-[#fafafa] px-5 py-4 text-xs font-extrabold uppercase tracking-wider text-gray-500 lg:grid">
            <span>{t.portal.ranking.place}</span><span>{t.portal.ranking.company}</span><span>{t.portal.ranking.reviews}</span><span>{t.portal.ranking.rating}</span><span>{t.portal.ranking.programs}</span>
          </div>
          {visibleCompanies.map((company, index) => (
            <Link key={company.id} href={`/companies/${company.slug}`} className="content-auto grid gap-4 border-b border-gray-100 px-4 py-5 transition-colors last:border-0 hover:bg-gray-50 lg:grid-cols-[80px_1.55fr_0.7fr_0.7fr_1fr] lg:items-center lg:gap-5 lg:px-5">
              <div className="text-sm font-extrabold text-brand lg:text-base"><span className="lg:hidden">{t.portal.ranking.mobilePlace} </span>№ {index + 1}</div>
              <div className="flex min-w-0 items-center gap-4">
                <div className="relative h-14 w-28 shrink-0 overflow-hidden border border-gray-100 bg-white"><Image src={company.logoUrl || '/placeholders/logo-placeholder.svg'} alt={company.name} fill className="object-contain p-2" /></div>
                <div className="min-w-0"><h2 className="truncate text-lg font-extrabold">{company.name}</h2>{company.verified && <span className="mt-1 inline-block bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-700">{t.portal.ranking.verifiedProfile}</span>}<span className="dotted-link mt-2 block w-fit text-xs">{t.portal.ranking.details}</span></div>
              </div>
              <div className="flex items-baseline gap-2 text-sm"><span className="text-gray-400 lg:hidden">{t.portal.ranking.reviews}</span><strong className="text-lg">{company.reviewCount}</strong></div>
              <div className="flex items-center gap-3"><strong className="text-2xl">{company.rating.toFixed(1)}</strong><RatingStars value={company.rating} size="sm" /></div>
              <div className="flex flex-wrap gap-2 text-xs text-[#579c9e]">{(company.insuranceTypes || []).map((type) => <span key={type.slug} className="border-b border-dotted border-current">{insuranceTypeLabel(t, type)}</span>)}</div>
            </Link>
          ))}
          {visibleCompanies.length === 0 && <div className="p-10 text-center text-gray-500">{t.portal.ranking.noResults}</div>}
        </div>
      </section>

      <section className="surface-section py-14">
        <div className="container-page max-w-4xl">
          <p className="section-kicker">{t.portal.ranking.aboutRating}</p>
          <h2 className="section-title mt-2">{t.portal.ranking.chooseCompany}</h2>
          <div className="mt-6 space-y-4 leading-7 text-gray-600">
            <p>{t.portal.ranking.chooseCompanyText1}</p>
            <p>{t.portal.ranking.chooseCompanyText2}</p>
          </div>
        </div>
      </section>
    </div>
  )
}
