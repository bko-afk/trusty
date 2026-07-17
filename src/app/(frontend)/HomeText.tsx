'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { CompanyCard } from '@/components/CompanyCard'
import { SearchBox } from '@/components/SearchBox'
import { RatingStars } from '@/components/RatingStars'
import { useLanguage } from '@/i18n/LanguageContext'
import { insuranceTypeLabel } from '@/lib/insuranceTypeLabel'
import { companyLogoUrl } from '@/lib/companyLogo'

type Props = {
  companies: any[]
  popularCompanies: any[]
  newestCompanies: any[]
  articles: any[]
  latestReviews: any[]
}

const INITIAL_VISIBLE = 9

export function HomeText({ companies, popularCompanies, newestCompanies, articles, latestReviews }: Props) {
  const { t } = useLanguage()
  const [showAll, setShowAll] = useState(false)

  function typeLabel(type: any): string {
    return insuranceTypeLabel(t, type)
  }

  const visibleCompanies = showAll ? companies : companies.slice(0, INITIAL_VISIBLE)
  const hasMore = companies.length > INITIAL_VISIBLE

  return (
    <div>
      <section className="bg-brand-light/60 py-14">
        <div className="container-page flex flex-col items-center gap-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold max-w-2xl">{t.hero.title}</h1>
          <SearchBox size="large" />

          {popularCompanies.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
              <span className="text-gray-500">{t.home.popularCompaniesLabel}:</span>
              {popularCompanies.map((company: any) => (
                <Link
                  key={company.id}
                  href={`/companies/${company.slug}`}
                  className="rounded-full bg-white border border-gray-200 px-4 py-1.5 hover:border-brand hover:text-brand"
                >
                  {company.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="container-page py-10">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="card p-5">
            <h3 className="font-semibold">{t.home.ctaReviewTitle}</h3>
            <Link
              href="/add-review"
              className="text-sm text-brand underline decoration-dotted underline-offset-4 hover:text-brand-dark mt-1 inline-block"
            >
              {t.home.ctaMoreLink}
            </Link>
          </div>
          <div className="card p-5">
            <h3 className="font-semibold">{t.home.ctaComplaintTitle}</h3>
            <Link
              href="/add-complaint"
              className="text-sm text-brand underline decoration-dotted underline-offset-4 hover:text-brand-dark mt-1 inline-block"
            >
              {t.home.ctaMoreLink}
            </Link>
          </div>
          <div className="card p-5">
            <h3 className="font-semibold">{t.home.ctaCompanyTitle}</h3>
            <Link
              href="/add-company"
              className="text-sm text-brand underline decoration-dotted underline-offset-4 hover:text-brand-dark mt-1 inline-block"
            >
              {t.home.ctaMoreLink}
            </Link>
          </div>
        </div>
      </section>

      <section className="container-page pb-12">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold">{t.home.bestCompanies}</h2>
          <Link href="/companies" className="text-sm text-brand hover:underline">
            {t.home.allCompanies}
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleCompanies.map((company: any) => (
            <CompanyCard
              key={company.id}
              slug={company.slug}
              name={company.name}
              logoUrl={companyLogoUrl(company.logoFile)}
              rating={company.overallRating || 0}
              reviewCount={company.reviewCount || 0}
              verified={company.verified}
              country={company.country}
              insuranceTypeLabels={(company.insuranceTypes || []).map((it: any) => typeLabel(it))}
            />
          ))}
        </div>
        {hasMore && !showAll && (
          <div className="flex justify-center mt-6">
            <button type="button" onClick={() => setShowAll(true)} className="btn-secondary">
              {t.home.showMoreBtn}
            </button>
          </div>
        )}
      </section>

      {latestReviews.length > 0 && (
        <section className="container-page pb-12">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-semibold">{t.home.latestReviews}</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {latestReviews.map((review: any) => {
              const company = review.company
              const companySlug = typeof company === 'object' ? company?.slug : null
              const companyName = typeof company === 'object' ? company?.name : ''
              return (
                <Link
                  key={review.id}
                  href={companySlug ? `/companies/${companySlug}/reviews` : '#'}
                  className="card p-4 flex flex-col gap-2 min-w-0"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-sm truncate">{review.authorName}</span>
                    <RatingStars value={review.rating} size="sm" />
                  </div>
                  <div className="text-xs text-brand truncate">{companyName}</div>
                  <div className="font-semibold text-sm">{review.title}</div>
                  <p className="text-sm text-gray-600 line-clamp-3">{review.body}</p>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {articles.length > 0 && (
        <section className="container-page pb-12">
          <h2 className="text-xl font-semibold mb-5">{t.home.articlesTitle}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article: any) => (
              <Link key={article.id} href={`/articles/${article.slug}`} className="card p-4 min-w-0">
                <div className="font-semibold mb-1">{article.title}</div>
                <p className="text-sm text-gray-500 line-clamp-3">{article.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {newestCompanies.length > 0 && (
        <section className="container-page pb-12">
          <h2 className="text-xl font-semibold mb-5">{t.home.newestCompaniesTitle}</h2>
          <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
            {newestCompanies.map((company: any) => (
              <Link
                key={company.id}
                href={`/companies/${company.slug}`}
                className="card p-4 flex items-center gap-3 min-w-[220px] max-w-[220px] shrink-0 snap-start hover:shadow-md transition-shadow"
              >
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                  <Image
                    src={companyLogoUrl(company.logoFile) || '/placeholders/logo-placeholder.svg'}
                    alt={company.name}
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-sm truncate">{company.name}</div>
                  <RatingStars value={company.overallRating || 0} size="sm" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="container-page pb-16">
        <div className="card p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8">
          <div className="relative h-40 w-40 sm:h-48 sm:w-48 shrink-0">
            <Image src="/images/about-trusty.svg" alt="" fill className="object-contain" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xl font-semibold mb-3">{t.home.aboutTitle}</h2>
            <p className="text-gray-600 leading-relaxed">{t.home.aboutText}</p>
            <p className="text-gray-600 leading-relaxed mt-3">{t.home.aboutTextExtra}</p>
          </div>
        </div>
      </section>
    </div>
  )
}
