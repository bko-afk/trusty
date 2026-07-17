'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { SearchBox } from '@/components/SearchBox'
import { RatingStars } from '@/components/RatingStars'
import { useLanguage } from '@/i18n/LanguageContext'
import { insuranceTypeLabel } from '@/lib/insuranceTypeLabel'
import { companyLogoUrl } from '@/lib/companyLogo'
import { NewCompaniesCarousel } from '@/components/NewCompaniesCarousel'

type Props = {
  companies: any[]
  popularCompanies: any[]
  newestCompanies: any[]
  latestReviews: any[]
}

const INITIAL_VISIBLE = 6

export function HomeText({ companies, popularCompanies, newestCompanies, latestReviews }: Props) {
  const { t } = useLanguage()
  const [showAll, setShowAll] = useState(false)
  const visibleCompanies = showAll ? companies : companies.slice(0, INITIAL_VISIBLE)

  return (
    <div>
      <section className="overflow-hidden bg-brand pb-12 pt-10 text-white md:bg-white md:pb-20 md:pt-16 md:text-brand-dark">
        <div className="container-page">
          <div className="max-w-4xl">
            <h1 className="max-w-4xl text-4xl font-extrabold leading-[1.08] tracking-[-0.045em] sm:text-5xl md:text-[44px] md:text-[#071b45]">
              {t.portal.home.heroTitle}
            </h1>
          </div>

          <div className="mt-10 max-w-6xl">
            <SearchBox size="large" popularCompanies={popularCompanies} />
          </div>

          {popularCompanies.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm md:text-base">
              <span className="text-white/65 md:text-gray-400">{t.portal.home.popularLabel}</span>
              {popularCompanies.map((company: any) => (
                <Link
                  key={company.id}
                  href={`/companies/${company.slug}`}
                  className="border-b border-dotted border-current text-white/85 transition-colors hover:text-white md:text-[#579c9e] md:hover:text-brand"
                >
                  {company.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="surface-section py-12 md:py-16">
        <div className="container-page">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <p className="section-kicker">{t.portal.home.servicesKicker}</p>
              <h2 className="section-title mt-2">{t.portal.home.servicesTitle}</h2>
            </div>
            <Link href="/companies" className="dotted-link hidden text-sm font-semibold sm:inline">{t.portal.home.openRating}</Link>
          </div>

          <div className="grid gap-px overflow-hidden border border-gray-200 bg-gray-200 md:grid-cols-3">
            <Link href="/add-review" className="group min-h-48 bg-white p-7 transition-colors hover:bg-[#fbf9ff]">
              <span className="text-xs font-bold text-brand">01</span>
              <h3 className="mt-8 text-2xl font-bold">{t.home.ctaReviewTitle}</h3>
              <p className="mt-3 max-w-xs leading-6 text-gray-500">{t.portal.home.reviewDescription}</p>
              <span className="dotted-link mt-6 inline-block text-sm font-semibold">{t.home.ctaMoreLink}</span>
            </Link>
            <Link href="/companies" className="group min-h-48 bg-white p-7 transition-colors hover:bg-[#fbf9ff]">
              <span className="text-xs font-bold text-brand">02</span>
              <h3 className="mt-8 text-2xl font-bold">{t.portal.home.compareTitle}</h3>
              <p className="mt-3 max-w-xs leading-6 text-gray-500">{t.portal.home.compareDescription}</p>
              <span className="dotted-link mt-6 inline-block text-sm font-semibold">{t.portal.home.catalogLink}</span>
            </Link>
            <a href="#methodology" className="group min-h-48 bg-white p-7 transition-colors hover:bg-[#fbf9ff]">
              <span className="text-xs font-bold text-brand">03</span>
              <h3 className="mt-8 text-2xl font-bold">{t.portal.home.understandTitle}</h3>
              <p className="mt-3 max-w-xs leading-6 text-gray-500">{t.portal.home.understandDescription}</p>
              <span className="dotted-link mt-6 inline-block text-sm font-semibold">{t.portal.home.methodologyLink}</span>
            </a>
          </div>
        </div>
      </section>

      <section className="container-page py-14 md:py-20">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="section-kicker">{t.portal.home.popularCategories}</p>
            <h2 className="section-title mt-2">{t.portal.home.selectInsuranceType}</h2>
          </div>
          <div className="flex flex-wrap gap-x-7 gap-y-3 text-lg">
            <Link href="/companies#company-filter-panel" className="dotted-link">{t.insuranceTypeNames.travel}</Link>
            <Link href="/companies#company-filter-panel" className="dotted-link">{t.insuranceTypeNames.medical}</Link>
            <Link href="/companies" className="dotted-link">{t.portal.home.allCompanies}</Link>
          </div>
        </div>

        <div className="mt-10 border-y border-gray-200">
          <div className="hidden grid-cols-[70px_1.8fr_0.8fr_0.7fr] gap-5 border-b border-gray-200 px-5 py-4 text-xs font-extrabold uppercase tracking-wider text-gray-400 md:grid">
            <span>{t.portal.home.place}</span><span>{t.portal.home.company}</span><span>{t.portal.home.reviews}</span><span>{t.portal.home.rating}</span>
          </div>
          {visibleCompanies.map((company: any, index: number) => (
            <Link
              key={company.id}
              href={`/companies/${company.slug}`}
              className="grid gap-4 border-b border-gray-100 px-4 py-5 transition-colors last:border-0 hover:bg-gray-50 md:grid-cols-[70px_1.8fr_0.8fr_0.7fr] md:items-center md:gap-5 md:px-5"
            >
              <div className="text-sm font-bold text-brand md:text-lg">№ {index + 1}</div>
              <div className="flex min-w-0 items-center gap-4">
                <div className="relative h-14 w-24 shrink-0 overflow-hidden border border-gray-100 bg-white">
                  <Image src={companyLogoUrl(company.logo, company.logoFile) || '/placeholders/logo-placeholder.svg'} alt={company.name} fill className="object-contain p-2" />
                </div>
                <div className="min-w-0">
                  <div className="truncate text-lg font-bold">{company.name}</div>
                  <div className="mt-1 flex flex-wrap gap-2 text-xs text-[#579c9e]">
                    {(company.insuranceTypes || []).map((it: any) => <span key={it.id || it.slug}>{insuranceTypeLabel(t, it)}</span>)}
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-500"><strong className="text-brand-dark">{company.reviewCount || 0}</strong> {t.company.reviewsCount}</div>
              <div className="flex items-center gap-3"><span className="text-2xl font-extrabold">{Number(company.overallRating || 0).toFixed(1)}</span><RatingStars value={company.overallRating || 0} size="sm" /></div>
            </Link>
          ))}
        </div>
        {!showAll && companies.length > INITIAL_VISIBLE && (
          <div className="mt-8 text-center"><button type="button" onClick={() => setShowAll(true)} className="btn-secondary">{t.home.showMoreBtn}</button></div>
        )}
      </section>

      {latestReviews.length > 0 && (
        <section className="surface-section py-14 md:py-20">
          <div className="container-page">
            <p className="section-kicker">{t.portal.home.customerExperience}</p>
            <h2 className="section-title mt-2">{t.home.latestReviews}</h2>
            <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {latestReviews.map((review: any) => {
                const company = typeof review.company === 'object' ? review.company : null
                return (
                  <Link key={review.id} href={company?.slug ? `/companies/${company.slug}/reviews` : '/companies'} className="content-auto flex min-h-64 flex-col border border-gray-200 bg-white p-6 transition-transform hover:-translate-y-1">
                    <div className="flex items-center justify-between gap-3"><span className="font-bold">{review.authorName}</span><RatingStars value={review.rating} size="sm" /></div>
                    <div className="mt-3 text-xs font-bold uppercase tracking-wider text-[#579c9e]">{company?.name}</div>
                    <h3 className="mt-4 text-lg font-bold leading-snug">{review.title}</h3>
                    <p className="mt-3 line-clamp-4 text-sm leading-6 text-gray-500">{review.body}</p>
                    <span className="dotted-link mt-auto pt-5 text-sm font-semibold">{t.portal.home.readReview}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      <section id="methodology" className="container-page py-14 md:py-20">
        <div className="grid overflow-hidden border border-gray-200 lg:grid-cols-[1fr_1.05fr]">
          <div className="relative min-h-[340px] bg-[#faf7f2] lg:min-h-[520px]">
            <Image src="/images/trusty-insurance-rating.png" alt={t.portal.home.imageAlt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
          </div>
          <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
            <p className="section-kicker">{t.portal.home.methodologyKicker}</p>
            <h2 className="section-title mt-3">{t.portal.home.methodologyTitle}</h2>
            <p className="mt-6 leading-7 text-gray-600">{t.portal.home.methodologyDescription}</p>
            <div className="mt-8 grid grid-cols-2 gap-px bg-gray-200">
              <div className="bg-white p-4"><strong className="block text-2xl text-brand">4</strong><span className="text-sm text-gray-500">{t.portal.home.criteriaCount}</span></div>
              <div className="bg-white p-4"><strong className="block text-2xl text-brand">100%</strong><span className="text-sm text-gray-500">{t.portal.home.openMethod}</span></div>
            </div>
            <Link href="/companies" className="btn-primary mt-8 self-start">{t.portal.home.viewRating}</Link>
          </div>
        </div>
      </section>

      {newestCompanies.length > 0 && (
        <section className="container-page pb-10 md:pb-14">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="section-kicker">{t.portal.home.recentlyAdded}</p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.025em] md:text-3xl">{t.portal.home.newCompanies}</h2>
            </div>
            <Link href="/companies" className="dotted-link shrink-0 text-sm font-semibold">{t.portal.home.entireCatalog}</Link>
          </div>
          <NewCompaniesCarousel
            companies={newestCompanies}
            labels={{
              previous: t.portal.home.carouselPrevious,
              next: t.portal.home.carouselNext,
              position: t.portal.home.carouselPosition,
              rating: t.portal.home.ratingLabel,
              reviews: t.company.reviewsCount,
              openCompany: t.portal.home.openCompany,
            }}
          />
        </section>
      )}
    </div>
  )
}
