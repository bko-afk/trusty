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

const comparisonCopy = {
  ru: { add: 'Сравнить', added: 'В сравнении', title: 'Сравнение компаний', clear: 'Очистить', max: 'Можно выбрать до 4 компаний', rating: 'Рейтинг', reviews: 'Отзывы', complaints: 'Жалобы', coverage: 'Покрытие', deductible: 'Франшиза', support: 'Поддержка 24/7', direct: 'Оплата клинике', online: 'Покупка онлайн', features: 'Доп. покрытие', yes: 'Да', no: 'Нет', open: 'Открыть профиль' },
  en: { add: 'Compare', added: 'Comparing', title: 'Company comparison', clear: 'Clear', max: 'Select up to 4 companies', rating: 'Rating', reviews: 'Reviews', complaints: 'Complaints', coverage: 'Coverage', deductible: 'Deductible', support: '24/7 support', direct: 'Clinic billing', online: 'Buy online', features: 'Extra coverage', yes: 'Yes', no: 'No', open: 'Open profile' },
  es: { add: 'Comparar', added: 'Comparando', title: 'Comparación de empresas', clear: 'Limpiar', max: 'Selecciona hasta 4 empresas', rating: 'Valoración', reviews: 'Reseñas', complaints: 'Quejas', coverage: 'Cobertura', deductible: 'Franquicia', support: 'Atención 24/7', direct: 'Pago a la clínica', online: 'Compra en línea', features: 'Cobertura extra', yes: 'Sí', no: 'No', open: 'Abrir perfil' },
} as const

export function CompaniesCatalogText({
  insuranceTypes,
  companies,
  availableCountries,
  updatedAt,
}: {
  insuranceTypes: CatalogInsuranceType[]
  companies: CatalogCompany[]
  availableCountries: string[]
  updatedAt: string
}) {
  const { t, locale } = useLanguage()
  const [results, setResults] = useState(companies)
  const [filters, setFilters] = useState<Filters>(emptyFilters)
  const [filterOpen, setFilterOpen] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [comparisonIds, setComparisonIds] = useState<string[]>([])
  const abortRef = useRef<AbortController | null>(null)
  const resultsRef = useRef<HTMLElement | null>(null)
  const countryList = countries.filter((country) => availableCountries.includes(country.code))
  const comparisonText = comparisonCopy[locale]
  const updatedText = locale === 'ru' ? 'Рейтинг актуален на' : locale === 'es' ? 'Ranking actualizado el' : 'Ranking updated on'
  const comparedCompanies = companies.filter((company) => comparisonIds.includes(String(company.id)))
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

      if (!response.ok) {
        setError(t.portal.ranking.filterError)
        return
      }
      const data = (await response.json()) as { companies: CatalogCompany[] }
      startTransition(() => setResults(data.companies))
      window.requestAnimationFrame(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
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

  const resetFilters = () => {
    const next = { ...emptyFilters, countries: [], insuranceTypeIds: [] }
    setFilters(next)
    void requestCompanies(next)
  }

  const toggleComparison = (companyId: string | number) => {
    const id = String(companyId)
    setComparisonIds((current) => {
      if (current.includes(id)) return current.filter((value) => value !== id)
      return current.length < 4 ? [...current, id] : current
    })
  }

  return (
    <div>
      <section className="border-b border-gray-200 bg-white py-8 md:py-14">
        <div className="container-page">
          <Breadcrumbs items={[{ label: t.common.home, href: '/' }, { label: t.nav.catalog }]} />
          <div className="mt-8 max-w-5xl">
            <h1 className="text-4xl font-extrabold leading-[1.05] tracking-[-0.045em] md:text-6xl">{t.portal.ranking.title}</h1>
            <p className="mt-7 max-w-4xl text-lg leading-8 text-gray-600">{t.portal.ranking.intro}</p>
          </div>
        </div>
      </section>

      <section className="bg-[#eef3f5] py-8 md:py-10">
        <div className="container-page">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div><div><span className="font-extrabold">{results.length}</span> {countLabel}</div><div className="mt-1 text-xs text-gray-500">{updatedText} {new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(updatedAt))}</div></div>
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

          <section id="comparison" className="mt-6 scroll-mt-5 border border-[#dfe6e9] bg-white p-5 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4"><div><p className="section-kicker">{comparisonText.max}</p><h2 className="mt-1 text-2xl font-extrabold">{comparisonText.title}</h2></div>{comparisonIds.length > 0 && <button type="button" onClick={() => setComparisonIds([])} className="dotted-link text-sm">{comparisonText.clear}</button>}</div>
            {comparedCompanies.length === 0 ? <p className="mt-5 text-sm text-gray-500">{comparisonText.max}</p> : <div className="mt-6 overflow-x-auto"><table className="min-w-[720px] w-full border-collapse text-sm"><thead><tr><th className="border border-gray-200 bg-gray-50 p-3 text-left">Trusty</th>{comparedCompanies.map((company) => <th key={company.id} className="border border-gray-200 p-3 text-left"><div className="font-extrabold">{company.name}</div><Link href={`/companies/${company.slug}`} className="dotted-link mt-2 inline-block text-xs">{comparisonText.open}</Link></th>)}</tr></thead><tbody>{[
              [comparisonText.rating, (company: CatalogCompany) => company.rating.toFixed(1)],
              [comparisonText.reviews, (company: CatalogCompany) => `${company.reviewCount} (+${company.positiveReviewCount} / -${company.negativeReviewCount})`],
              [comparisonText.complaints, (company: CatalogCompany) => `${company.complaintCount} / ${company.resolvedComplaintCount}`],
              [comparisonText.coverage, (company: CatalogCompany) => company.insuranceProfile.coverageLimit || '—'],
              [comparisonText.deductible, (company: CatalogCompany) => company.insuranceProfile.deductible || '—'],
              [comparisonText.support, (company: CatalogCompany) => !company.insuranceProfile.hasData ? '—' : company.insuranceProfile.assistance24h ? comparisonText.yes : comparisonText.no],
              [comparisonText.direct, (company: CatalogCompany) => !company.insuranceProfile.hasData ? '—' : company.insuranceProfile.directBilling ? comparisonText.yes : comparisonText.no],
              [comparisonText.online, (company: CatalogCompany) => !company.insuranceProfile.hasData ? '—' : company.insuranceProfile.onlinePurchase ? comparisonText.yes : comparisonText.no],
              [comparisonText.features, (company: CatalogCompany) => company.insuranceProfile.coverageFeatures.join(', ') || '—'],
            ].map(([label, getValue]) => <tr key={String(label)}><th className="border border-gray-200 bg-gray-50 p-3 text-left font-bold">{String(label)}</th>{comparedCompanies.map((company) => <td key={company.id} className="border border-gray-200 p-3">{(getValue as (company: CatalogCompany) => string)(company)}</td>)}</tr>)}</tbody></table></div>}
          </section>
        </div>
      </section>

      <section id="company-results" ref={resultsRef} className="container-page scroll-mt-6 py-8 md:py-12">
        <div className="border-y border-gray-200" aria-busy={isLoading} aria-live="polite">
          <div className="hidden grid-cols-[80px_1.55fr_0.7fr_0.7fr_1fr] gap-5 border-b border-gray-200 bg-[#fafafa] px-5 py-4 text-xs font-extrabold uppercase tracking-wider text-gray-500 lg:grid">
            <span>{t.portal.ranking.place}</span><span>{t.portal.ranking.company}</span><span>{t.portal.ranking.reviews}</span><span>{t.portal.ranking.rating}</span><span>{t.portal.ranking.programs}</span>
          </div>
          <div className={`transition-opacity ${isLoading ? 'opacity-40' : 'opacity-100'}`}>
            {results.map((company, index) => {
              const isCompared = comparisonIds.includes(String(company.id))
              return <div key={company.id} className="content-auto relative border-b border-gray-100 last:border-0 hover:bg-gray-50">
              <Link href={`/companies/${company.slug}`} className="grid gap-4 px-4 py-5 pr-28 lg:grid-cols-[80px_1.55fr_0.7fr_0.7fr_1fr] lg:items-center lg:gap-5 lg:px-5 lg:pr-32">
                <div className="text-sm font-extrabold text-brand lg:text-base"><span className="lg:hidden">{t.portal.ranking.mobilePlace} </span>№ {index + 1}</div>
                <div className="flex min-w-0 items-center gap-4">
                  <div className="relative h-14 w-28 shrink-0 overflow-hidden border border-gray-100 bg-white"><Image src={company.logoUrl || '/placeholders/logo-placeholder.svg'} alt={company.name} fill sizes="112px" className="object-contain p-2" /></div>
                  <div className="min-w-0"><h2 className="truncate text-lg font-extrabold">{company.name}</h2>{company.verified && <span className="mt-1 inline-block bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-700">{t.portal.ranking.verifiedProfile}</span>}<span className="dotted-link mt-2 block w-fit text-xs">{t.portal.ranking.details}</span></div>
                </div>
                <div className="text-sm"><div className="flex items-baseline gap-2"><span className="text-gray-400 lg:hidden">{t.portal.ranking.reviews}</span><strong className="text-lg">{company.reviewCount}</strong></div><div className="mt-1 text-xs"><span className="text-emerald-700">+{company.positiveReviewCount}</span> <span className="ml-2 text-rose-700">-{company.negativeReviewCount}</span></div></div>
                <div className="flex items-center gap-3"><strong className="text-2xl">{company.rating.toFixed(1)}</strong><RatingStars value={company.rating} size="sm" /></div>
                <div className="flex flex-wrap gap-2 text-xs text-[#579c9e]">{company.insuranceTypes.map((type) => <span key={type.slug} className="border-b border-dotted border-current">{insuranceTypeLabel(t, type)}</span>)}</div>
              </Link>
              <button type="button" onClick={() => toggleComparison(company.id)} disabled={!isCompared && comparisonIds.length >= 4} className={`absolute right-3 top-5 border px-3 py-2 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-40 ${isCompared ? 'border-brand bg-brand text-white' : 'border-gray-300 bg-white text-brand-dark'}`}>{isCompared ? comparisonText.added : comparisonText.add}</button>
              </div>
            })}
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
