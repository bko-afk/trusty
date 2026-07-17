'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { RatingStars } from '@/components/RatingStars'
import { useLanguage } from '@/i18n/LanguageContext'
import { countryName } from '@/lib/countries'
import { insuranceTypeLabel } from '@/lib/insuranceTypeLabel'

export function CompanyDetailText({
  slug,
  name,
  logoUrl,
  overallRating,
  reviewCount,
  verified,
  website,
  foundedYear,
  city,
  country,
  phone,
  email,
  address,
  insuranceTypes,
  shortDescription,
  description,
  pros,
  cons,
}: {
  slug: string
  name: string
  logoUrl?: string
  overallRating: number
  reviewCount: number
  verified?: boolean
  website?: string
  foundedYear?: number
  city?: string
  country?: string
  phone?: string
  email?: string
  address?: string
  insuranceTypes: { slug: string; title: string }[]
  shortDescription?: string
  description?: string
  pros: string[]
  cons: string[]
}) {
  const { t, locale } = useLanguage()
  const spec: Array<[string, string]> = [
    [t.companyDetail.foundedYear, foundedYear ? String(foundedYear) : t.portal.detail.notSpecified],
    [t.companyDetail.country, country ? countryName(country, locale) : t.portal.detail.notSpecified],
    [t.companyDetail.city, city || t.portal.detail.notSpecified],
    [t.companyDetail.phone, phone || t.portal.detail.notSpecified],
    [t.companyDetail.email, email || t.portal.detail.notSpecified],
    [t.companyDetail.address, address || t.portal.detail.notSpecified],
  ]

  return (
    <div>
      <section className="border-b border-gray-200 bg-white py-8 md:py-12">
        <div className="container-page">
          <Breadcrumbs items={[{ label: t.common.home, href: '/' }, { label: t.portal.detail.ratingsBreadcrumb, href: '/companies' }, { label: name }]} />
          <div className="mt-8 grid gap-7 lg:grid-cols-[1fr_280px] lg:items-start">
            <div className="flex flex-col gap-6 sm:flex-row">
              <div className="relative h-24 w-40 shrink-0 overflow-hidden border border-gray-200 bg-white"><Image src={logoUrl || '/placeholders/logo-placeholder.svg'} alt={name} fill className="object-contain p-3" /></div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3"><h1 className="text-4xl font-extrabold tracking-[-0.04em] md:text-5xl">{name}</h1>{verified && <span className="bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">{t.portal.detail.verifiedProfile}</span>}</div>
                <p className="mt-4 max-w-2xl text-lg leading-7 text-gray-600">{shortDescription || t.companyDetail.noDescription}</p>
                <div className="mt-5 flex flex-wrap gap-2">{insuranceTypes.map((type) => <Link key={type.slug} href={`/companies?type=${type.slug}`} className="border-b border-dotted border-[#579c9e] text-sm text-[#579c9e]">{insuranceTypeLabel(t, type)}</Link>)}</div>
              </div>
            </div>
            <div className="border border-gray-200 p-5">
              <div className="flex items-end justify-between"><span className="text-sm text-gray-500">{t.portal.detail.companyRating}</span><strong className="text-4xl">{overallRating.toFixed(1)}</strong></div>
              <div className="mt-3"><RatingStars value={overallRating} size="md" /></div>
              <Link href={`/companies/${slug}/reviews`} className="dotted-link mt-4 inline-block text-sm font-semibold">{reviewCount} {t.portal.detail.customerReviews}</Link>
            </div>
          </div>

          <div className="mt-9 flex flex-wrap gap-px bg-gray-200">
            <a href="#overview" className="bg-brand px-5 py-3 text-sm font-bold text-white">{t.portal.detail.overview}</a>
            <Link href={`/companies/${slug}/reviews`} className="bg-[#f6f7f9] px-5 py-3 text-sm font-bold hover:bg-white">{t.portal.detail.reviews}</Link>
            <a href="#details" className="bg-[#f6f7f9] px-5 py-3 text-sm font-bold hover:bg-white">{t.portal.detail.specifications}</a>
          </div>
        </div>
      </section>

      <section className="container-page py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="space-y-8">
            <section id="overview" className="border border-gray-200 p-6 md:p-8">
              <p className="section-kicker">{t.portal.detail.independentReview}</p>
              <h2 className="mt-2 text-3xl font-extrabold">{t.portal.detail.aboutCompanyPrefix} {name}</h2>
              <div className="mt-6 space-y-4 leading-7 text-gray-600">{description ? <p className="whitespace-pre-line">{description}</p> : <p>{shortDescription || t.companyDetail.noDescription}</p>}</div>
            </section>

            {(pros.length > 0 || cons.length > 0) && (
              <section className="grid gap-px overflow-hidden border border-gray-200 bg-gray-200 sm:grid-cols-2">
                <div className="bg-white p-6"><h3 className="text-lg font-extrabold text-emerald-700">{t.portal.detail.advantages}</h3>{pros.length > 0 ? <ul className="mt-4 space-y-3 text-sm leading-6 text-gray-600">{pros.map((item) => <li key={item} className="border-l-2 border-emerald-400 pl-3">{item}</li>)}</ul> : <p className="mt-4 text-sm text-gray-400">{t.portal.detail.emptyList}</p>}</div>
                <div className="bg-white p-6"><h3 className="text-lg font-extrabold text-rose-700">{t.portal.detail.disadvantages}</h3>{cons.length > 0 ? <ul className="mt-4 space-y-3 text-sm leading-6 text-gray-600">{cons.map((item) => <li key={item} className="border-l-2 border-rose-400 pl-3">{item}</li>)}</ul> : <p className="mt-4 text-sm text-gray-400">{t.portal.detail.emptyList}</p>}</div>
              </section>
            )}

            <section className="surface-section border border-gray-200 p-6 md:p-8">
              <h2 className="text-2xl font-extrabold">{t.portal.detail.experiencePrefix} {name}?</h2>
              <p className="mt-3 max-w-2xl leading-7 text-gray-600">{t.portal.detail.experienceText}</p>
              <Link href={`/add-review?company=${slug}`} className="btn-primary mt-6">{t.company.leaveReview}</Link>
            </section>
          </div>

          <aside id="details" className="h-fit border border-gray-200 lg:sticky lg:top-5">
            <div className="bg-brand p-5 text-white"><div className="text-xs font-bold uppercase tracking-wider text-white/60">{t.portal.detail.companyCard}</div><h2 className="mt-2 text-xl font-extrabold">{t.portal.detail.keyDetails}</h2></div>
            <dl className="divide-y divide-gray-100 px-5 text-sm">{spec.map(([label, value]) => <div key={label} className="py-4"><dt className="text-xs font-bold uppercase tracking-wider text-gray-400">{label}</dt><dd className="mt-1 break-words font-semibold">{value}</dd></div>)}</dl>
            <div className="space-y-3 border-t border-gray-200 p-5">{website && <a href={website} target="_blank" rel="noopener noreferrer nofollow" className="btn-primary w-full">{t.company.visitSite}</a>}<Link href={`/companies/${slug}/reviews`} className="btn-secondary w-full">{t.company.readReviews}</Link></div>
          </aside>
        </div>
      </section>
    </div>
  )
}
