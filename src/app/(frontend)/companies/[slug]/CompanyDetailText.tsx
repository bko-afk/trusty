'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { RatingStars } from '@/components/RatingStars'
import { useLanguage } from '@/i18n/LanguageContext'
import { countryFlag, countryName } from '@/lib/countries'
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
    [t.companyDetail.officialSite, website || '—'],
    [t.companyDetail.foundedYear, foundedYear ? String(foundedYear) : '—'],
    [t.companyDetail.country, country ? `${countryFlag(country)} ${countryName(country, locale)}` : '—'],
    [t.companyDetail.city, city || '—'],
    [t.companyDetail.phone, phone || '—'],
    [t.companyDetail.email, email || '—'],
    [t.companyDetail.address, address || '—'],
    [
      t.companyDetail.insuranceTypesLabel,
      insuranceTypes.map((it) => insuranceTypeLabel(t, it)).join(', ') || '—',
    ],
  ]

  return (
    <div className="container-page py-8">
      <Breadcrumbs
        items={[
          { label: t.common.home, href: '/' },
          { label: t.catalog.title, href: '/companies' },
          { label: name },
        ]}
      />

      <div className="card p-6 flex flex-col md:flex-row gap-6 mb-8">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
          <Image
            src={logoUrl || '/placeholders/logo-placeholder.svg'}
            alt={name}
            fill
            className="object-contain p-2"
          />
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold">{name}</h1>
            {verified && (
              <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-medium text-brand-dark">
                {t.company.verified}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-2">
            <RatingStars value={overallRating} size="lg" />
            <Link href={`/companies/${slug}/reviews`} className="text-brand hover:underline text-sm">
              {reviewCount} {t.companyDetail.reviewsSuffix}
            </Link>
          </div>
          <p className="text-gray-600 mt-3">{shortDescription}</p>
          <div className="flex flex-wrap gap-3 mt-4">
            {website && (
              <a href={website} target="_blank" rel="noopener noreferrer nofollow" className="btn-primary">
                {t.company.visitSite}
              </a>
            )}
            <Link href={`/companies/${slug}/reviews`} className="btn-secondary">
              {t.company.readReviews}
            </Link>
            <Link href={`/add-review?company=${slug}`} className="btn-secondary">
              {t.company.leaveReview}
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <section className="card p-6">
            <h2 className="text-lg font-semibold mb-4">{t.companyDetail.aboutTitle}</h2>
            <div className="prose prose-sm max-w-none text-gray-700">
              {description ? (
                <p className="whitespace-pre-line">{description}</p>
              ) : (
                <p>{t.companyDetail.noDescription}</p>
              )}
            </div>
          </section>

          {(pros.length > 0 || cons.length > 0) && (
            <section className="card p-6 grid gap-6 sm:grid-cols-2">
              {pros.length > 0 && (
                <div>
                  <h3 className="font-semibold text-emerald-700 mb-2">{t.companyDetail.advantages}</h3>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {pros.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}
              {cons.length > 0 && (
                <div>
                  <h3 className="font-semibold text-rose-700 mb-2">{t.companyDetail.disadvantages}</h3>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {cons.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}
        </div>

        <aside className="card p-6 h-fit">
          <h2 className="text-lg font-semibold mb-4">{t.companyDetail.specTitle}</h2>
          <dl className="text-sm divide-y divide-gray-100">
            {spec.map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4 py-2">
                <dt className="text-gray-500">{label}</dt>
                <dd className="text-right font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </div>
  )
}
