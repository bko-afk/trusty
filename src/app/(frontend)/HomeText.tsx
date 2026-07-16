'use client'

import Image from 'next/image'
import Link from 'next/link'
import { CompanyCard } from '@/components/CompanyCard'
import { SearchBox } from '@/components/SearchBox'
import { RatingStars } from '@/components/RatingStars'
import { useLanguage } from '@/i18n/LanguageContext'
import { insuranceTypeLabel } from '@/lib/insuranceTypeLabel'
import { companyLogoUrl } from '@/lib/companyLogo'

type Props = {
  companies: any[]
  insuranceTypes: any[]
  articles: any[]
  latestReviews: any[]
}

export function HomeText({ companies, insuranceTypes, articles, latestReviews }: Props) {
  const { t } = useLanguage()

  function typeLabel(type: any): string {
    return insuranceTypeLabel(t, type)
  }

  return (
    <div>
      <section className="bg-brand-light/60 py-14">
        <div className="container-page flex flex-col items-center gap-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold max-w-2xl">{t.hero.title}</h1>
          <p className="text-gray-600 max-w-xl">{t.hero.subtitle}</p>
          <SearchBox />
          {insuranceTypes.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {insuranceTypes.map((type: any) => (
                <Link
                  key={type.id}
                  href={`/companies?type=${type.slug}`}
                  className="rounded-full bg-white border border-gray-200 px-4 py-1.5 text-sm hover:border-brand hover:text-brand"
                >
                  {typeLabel(type)}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="container-page py-12">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold">{t.home.bestCompanies}</h2>
          <Link href="/companies" className="text-sm text-brand hover:underline">
            {t.home.allCompanies}
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {companies.map((company: any) => (
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
      </section>

      <section className="container-page pb-12">
        <div className="card flex flex-col sm:flex-row items-center justify-between gap-4 p-6">
          <div>
            <h3 className="font-semibold text-lg">{t.home.claimCtaTitle}</h3>
            <p className="text-gray-500 text-sm mt-1">{t.home.claimCtaText}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 shrink-0">
            <Link href="/add-company" className="btn-primary whitespace-nowrap">
              {t.home.addCompanyBtn}
            </Link>
            <Link href="/add-review" className="btn-secondary whitespace-nowrap">
              {t.home.writeReviewBtn}
            </Link>
          </div>
        </div>
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
