'use client'

import Image from 'next/image'
import Link from 'next/link'
import { startTransition, useEffect, useRef, useState } from 'react'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { RatingStars } from '@/components/RatingStars'
import { useLanguage } from '@/i18n/LanguageContext'
import { countries, countryName } from '@/lib/countries'
import { insuranceTypeLabel } from '@/lib/insuranceTypeLabel'
import type { CatalogCompany, CatalogInsuranceType } from '@/lib/catalogCompany'

type Filters = {
  query: string
  verified: boolean
  popular: boolean
  countries: string[]
  insuranceTypeIds: number[]
  minimumRating: number
  foundedFrom: string
  foundedTo: string
  reviewsFrom: string
  reviewsTo: string
}

const emptyFilters: Filters = {
  query: '',
  verified: false,
  popular: false,
  countries: [],
  insuranceTypeIds: [],
  minimumRating: 0,
  foundedFrom: '',
  foundedTo: '',
  reviewsFrom: '',
  reviewsTo: '',
}

const checkboxClass = 'h-5 w-5 shrink-0 cursor-pointer rounded-none border-gray-400 accent-brand'
const numberInputClass = 'h-11 min-w-0 w-full border border-gray-300 bg-white px-3 text-sm focus:border-brand focus:outline-none'

export function CompaniesCatalogText({
  insuranceTypes,
  companies,
  availableCountries,
}: {
  insuranceTypes: CatalogInsuranceType[]
  companies: CatalogCompany[]
  availableCountries: string[]
}) {
  const { t, locale } = useLanguage()
  const [results, setResults] = useState(companies)
  const [filters, setFilters] = useState<Filters>(emptyFilters)
  const [filterOpen, setFilterOpen] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const abortRef = useRef<AbortController | null>(null)
  const countryList = countries.filter((country) => availableCountries.includes(country.code))
  const countLabel = locale === 'ru'
    ? results.length % 10 === 1 && results.length % 100 !== 11
      ? t.portal.ranking.companyInRating
      : [2, 3, 4].includes(results.length % 10) && ![12, 13, 14].includes(results.length % 100)
        ? t.portal.ranking.companiesInRatingFew
        : t.portal.ranking.companiesInRating
    : results.length === 1
      ? t.portal.ranking.companyInRating
      : t.portal.ranking.companiesInRating

  useEffect(() => () => abortRef.current?.abort(), [])

  const requestCompanies = async (nextFilters: Filters) => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/company-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nextFilters),
        signal: controller.signal,
      })

      if (!response.ok) throw new Error('Filter request failed')
      const data = (await response.json()) as { companies: CatalogCompany[] }
      startTransition(() => setResults(data.companies))
    } catch (requestError) {
      if (requestError instanceof DOMException && requestError.name === 'AbortError') return
      setError(t.portal.ranking.filterError)
    } finally {
      if (abortRef.current === controller) setIsLoading(false)
    }
  }

  const updateFilter = <Key extends keyof Filters>(key: Key, value: Filters[Key]) => {
    setFilters((current) => ({ ...current, [key]: value }))
  }

  const toggleArrayValue = (key: 'countries' | 'insuranceTypeIds', value: string | number) => {
    setFilters((current) => {
      const selected = current[key] as (string | number)[]
      const next = selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value]
      return { ...current, [key]: next }
    })
  }

  const selectQuickType = (typeId?: number) => {
    const next = { ...filters, insuranceTypeIds: typeId ? [typeId] : [] }
    setFilters(next)
    void requestCompanies(next)
  }

  const resetFilters = () => {
    const next = { ...emptyFilters, countries: [], insuranceTypeIds: [] }
    setFilters(next)
    void requestCompanies(next)
  }

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
                <button type="button" onClick={() => selectQuickType()} className={`border-b border-dotted ${filters.insuranceTypeIds.length === 0 ? 'border-brand font-bold text-brand' : 'border-current text-brand-dark'}`}>{t.catalog.allTypes}</button>
                {insuranceTypes.map((type) => (
                  <button type="button" key={type.id} onClick={() => selectQuickType(type.id)} className={`border-b border-dotted ${filters.insuranceTypeIds.length === 1 && filters.insuranceTypeIds[0] === type.id ? 'border-brand font-bold text-brand' : 'border-current text-brand-dark'}`}>{insuranceTypeLabel(t, type)}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#eef3f5] py-8 md:py-10">
        <div className="container-page">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div><span className="font-extrabold">{results.length}</span> {countLabel}</div>
            <button type="button" onClick={() => setFilterOpen((open) => !open)} className="flex items-center gap-2 text-sm font-bold text-brand-dark">
              {filterOpen ? t.portal.ranking.hideFilter : t.portal.ranking.showFilter}
              <span className={`transition-transform ${filterOpen ? 'rotate-180' : ''}`} aria-hidden="true">⌄</span>
            </button>
          </div>

          {filterOpen && (
            <form
              id="company-filter-panel"
              onSubmit={(event) => {
                event.preventDefault()
                void requestCompanies(filters)
              }}
              className="border border-[#dfe6e9] bg-white p-5 shadow-[0_16px_45px_rgba(7,27,69,0.04)] md:p-8"
            >
              <div className="grid gap-8 lg:grid-cols-3 lg:gap-10">
                <fieldset>
                  <legend className="mb-4 text-lg font-extrabold">{t.portal.ranking.company}</legend>
                  <label htmlFor="company-filter" className="sr-only">{t.portal.ranking.companyName}</label>
                  <input id="company-filter" value={filters.query} onChange={(event) => updateFilter('query', event.target.value)} placeholder={t.portal.ranking.companyNamePlaceholder} maxLength={120} autoComplete="off" className="h-14 w-full border border-gray-300 bg-white px-4 text-base focus:border-brand focus:outline-none" />

                  <div className="mt-5 space-y-3">
                    <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={filters.verified} onChange={(event) => updateFilter('verified', event.target.checked)} className={checkboxClass} />{t.portal.ranking.verifiedOnly}</label>
                    <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={filters.popular} onChange={(event) => updateFilter('popular', event.target.checked)} className={checkboxClass} />{t.portal.ranking.popularOnly}</label>
                  </div>

                  <div className="mt-8">
                    <div className="flex items-center justify-between gap-4"><label htmlFor="minimum-rating" className="font-bold">{t.portal.ranking.minimumRating}</label><strong className="text-brand">{filters.minimumRating.toFixed(1)}</strong></div>
                    <input id="minimum-rating" type="range" min="0" max="5" step="0.5" value={filters.minimumRating} onChange={(event) => updateFilter('minimumRating', Number(event.target.value))} className="mt-3 w-full accent-brand" />
                    <div className="flex justify-between text-xs text-gray-400"><span>0.0</span><span>5.0</span></div>
                  </div>
                </fieldset>

                <fieldset>
                  <legend className="mb-4 text-lg font-extrabold">{t.portal.ranking.countriesLabel}</legend>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    {countryList.map((country) => (
                      <label key={country.code} className="flex cursor-pointer items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={filters.countries.includes(country.code)} onChange={() => toggleArrayValue('countries', country.code)} className={checkboxClass} />{countryName(country.code, locale)}</label>
                    ))}
                  </div>
                </fieldset>

                <div className="space-y-8">
                  <fieldset>
                    <legend className="mb-4 text-lg font-extrabold">{t.portal.ranking.insuranceTypesLabel}</legend>
                    <div className="space-y-3">
                      {insuranceTypes.map((type) => (
                        <label key={type.id} className="flex cursor-pointer items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={filters.insuranceTypeIds.includes(type.id)} onChange={() => toggleArrayValue('insuranceTypeIds', type.id)} className={checkboxClass} />{insuranceTypeLabel(t, type)}</label>
                      ))}
                    </div>
                  </fieldset>

                  <RangeInputs label={t.portal.ranking.foundedRange} fromLabel={t.portal.ranking.from} toLabel={t.portal.ranking.to} from={filters.foundedFrom} to={filters.foundedTo} min={1800} max={2100} onFromChange={(value) => updateFilter('foundedFrom', value)} onToChange={(value) => updateFilter('foundedTo', value)} />
                  <RangeInputs label={t.portal.ranking.reviewsRange} fromLabel={t.portal.ranking.from} toLabel={t.portal.ranking.to} from={filters.reviewsFrom} to={filters.reviewsTo} min={0} max={100000} onFromChange={(value) => updateFilter('reviewsFrom', value)} onToChange={(value) => updateFilter('reviewsTo', value)} />
                </div>
              </div>

              <div className="mt-9 flex flex-col-reverse items-stretch justify-end gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:items-center">
                <button type="button" onClick={resetFilters} disabled={isLoading} className="px-5 py-3 font-semibold text-brand-dark hover:text-brand disabled:opacity-50">{t.portal.ranking.resetFilter}</button>
                <button type="submit" disabled={isLoading} className="btn-primary min-w-40 disabled:cursor-wait disabled:opacity-60">{isLoading ? t.portal.ranking.filtering : t.portal.ranking.applyFilter}</button>
              </div>
              {error && <p role="alert" className="mt-4 text-right text-sm font-semibold text-red-600">{error}</p>}
            </form>
          )}
        </div>
      </section>

      <section className="container-page py-8 md:py-12">
        <div className="border-y border-gray-200" aria-busy={isLoading} aria-live="polite">
          <div className="hidden grid-cols-[80px_1.55fr_0.7fr_0.7fr_1fr] gap-5 border-b border-gray-200 bg-[#fafafa] px-5 py-4 text-xs font-extrabold uppercase tracking-wider text-gray-500 lg:grid">
            <span>{t.portal.ranking.place}</span><span>{t.portal.ranking.company}</span><span>{t.portal.ranking.reviews}</span><span>{t.portal.ranking.rating}</span><span>{t.portal.ranking.programs}</span>
          </div>
          <div className={`transition-opacity ${isLoading ? 'opacity-40' : 'opacity-100'}`}>
            {results.map((company, index) => (
              <Link key={company.id} href={`/companies/${company.slug}`} className="content-auto grid gap-4 border-b border-gray-100 px-4 py-5 transition-colors last:border-0 hover:bg-gray-50 lg:grid-cols-[80px_1.55fr_0.7fr_0.7fr_1fr] lg:items-center lg:gap-5 lg:px-5">
                <div className="text-sm font-extrabold text-brand lg:text-base"><span className="lg:hidden">{t.portal.ranking.mobilePlace} </span>№ {index + 1}</div>
                <div className="flex min-w-0 items-center gap-4">
                  <div className="relative h-14 w-28 shrink-0 overflow-hidden border border-gray-100 bg-white"><Image src={company.logoUrl || '/placeholders/logo-placeholder.svg'} alt={company.name} fill sizes="112px" className="object-contain p-2" /></div>
                  <div className="min-w-0"><h2 className="truncate text-lg font-extrabold">{company.name}</h2>{company.verified && <span className="mt-1 inline-block bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-700">{t.portal.ranking.verifiedProfile}</span>}<span className="dotted-link mt-2 block w-fit text-xs">{t.portal.ranking.details}</span></div>
                </div>
                <div className="flex items-baseline gap-2 text-sm"><span className="text-gray-400 lg:hidden">{t.portal.ranking.reviews}</span><strong className="text-lg">{company.reviewCount}</strong></div>
                <div className="flex items-center gap-3"><strong className="text-2xl">{company.rating.toFixed(1)}</strong><RatingStars value={company.rating} size="sm" /></div>
                <div className="flex flex-wrap gap-2 text-xs text-[#579c9e]">{company.insuranceTypes.map((type) => <span key={type.slug} className="border-b border-dotted border-current">{insuranceTypeLabel(t, type)}</span>)}</div>
              </Link>
            ))}
            {results.length === 0 && <div className="p-10 text-center text-gray-500">{t.portal.ranking.noResults}</div>}
          </div>
        </div>
      </section>

      <section className="surface-section py-14">
        <div className="container-page max-w-4xl">
          <p className="section-kicker">{t.portal.ranking.aboutRating}</p>
          <h2 className="section-title mt-2">{t.portal.ranking.chooseCompany}</h2>
          <div className="mt-6 space-y-4 leading-7 text-gray-600"><p>{t.portal.ranking.chooseCompanyText1}</p><p>{t.portal.ranking.chooseCompanyText2}</p></div>
        </div>
      </section>
    </div>
  )
}

function RangeInputs({
  label,
  fromLabel,
  toLabel,
  from,
  to,
  min,
  max,
  onFromChange,
  onToChange,
}: {
  label: string
  fromLabel: string
  toLabel: string
  from: string
  to: string
  min: number
  max: number
  onFromChange: (value: string) => void
  onToChange: (value: string) => void
}) {
  return (
    <fieldset>
      <legend className="mb-3 font-bold">{label}</legend>
      <div className="grid grid-cols-2 gap-3">
        <label className="text-xs font-semibold text-gray-500">{fromLabel}<input type="number" value={from} onChange={(event) => onFromChange(event.target.value)} min={min} max={max} placeholder={String(min)} className={`mt-1 ${numberInputClass}`} /></label>
        <label className="text-xs font-semibold text-gray-500">{toLabel}<input type="number" value={to} onChange={(event) => onToChange(event.target.value)} min={min} max={max} placeholder={String(max)} className={`mt-1 ${numberInputClass}`} /></label>
      </div>
    </fieldset>
  )
}
