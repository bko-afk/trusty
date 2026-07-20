'use client'

import Link from '@/components/LocalizedLink'
import { useState } from 'react'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { RatingStars } from '@/components/RatingStars'
import { ReviewCard } from '@/components/ReviewCard'
import { useLanguage } from '@/i18n/LanguageContext'

type Reply = { id: string; authorName: string; authorType: 'admin' | 'company'; body: string; createdAt: string }
type Review = {
  id: string
  authorName: string
  title: string
  body: string
  rating: number
  experienceType: 'purchase' | 'claim'
  policyType?: { slug: string; title: string }
  tripCountry?: string
  claimOutcome?: string
  claimAmount?: string
  responseTime?: string
  verifiedExperience?: boolean
  pros: string[]
  cons: string[]
  recommend?: boolean
  createdAt: string
  helpfulUp?: number
  helpfulDown?: number
  replies: Reply[]
}

const CRITERIA_KEYS = ['coverage', 'price', 'claimsService', 'support'] as const

const reviewFilterCopy = {
  ru: { all: 'Все отзывы', positive: 'Положительные', negative: 'Отрицательные', claims: 'Со страховым случаем', verified: 'Подтвержденные' },
  en: { all: 'All reviews', positive: 'Positive', negative: 'Negative', claims: 'Claim experience', verified: 'Verified' },
  es: { all: 'Todas', positive: 'Positivas', negative: 'Negativas', claims: 'Con siniestro', verified: 'Verificadas' },
} as const

export function CompanyReviewsText({
  slug,
  companyName,
  overallRating,
  reviewCount,
  criteriaAverages,
  reviews,
}: {
  slug: string
  companyName: string
  overallRating: number
  reviewCount: number
  criteriaAverages: Record<string, number>
  reviews: Review[]
}) {
  const { t, locale } = useLanguage()
  const [filter, setFilter] = useState<'all' | 'positive' | 'negative' | 'claims' | 'verified'>('all')
  const filterText = reviewFilterCopy[locale]
  const visibleReviews = reviews.filter((review) => {
    if (filter === 'positive') return review.rating >= 4
    if (filter === 'negative') return review.rating <= 2
    if (filter === 'claims') return review.experienceType === 'claim'
    if (filter === 'verified') return review.verifiedExperience === true
    return true
  })

  return (
    <div className="container-page py-8">
      <Breadcrumbs
        items={[
          { label: t.common.home, href: '/' },
          { label: t.nav.catalog, href: '/companies' },
          { label: companyName, href: `/companies/${slug}` },
          { label: t.portal.detail.reviews },
        ]}
      />

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            {t.companyReviewsPage.titlePrefix} «{companyName}»
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <RatingStars value={overallRating} />
            <span className="text-gray-500 text-sm">
              {reviewCount} {t.companyDetail.reviewsSuffix}
            </span>
          </div>
        </div>
        <Link href={`/add-review?company=${slug}`} className="btn-primary">
          {t.companyReviewsPage.addReview}
        </Link>
      </div>

      <div className="card p-5 mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CRITERIA_KEYS.map((key) => (
          <div key={key}>
            <div className="text-xs text-gray-500 mb-1">{t.companyReviewsPage.criteria[key]}</div>
            <div className="h-2 rounded-full bg-gray-100">
              <div
                className="h-2 rounded-full bg-brand"
                style={{ width: `${(criteriaAverages[key] / 5) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap gap-2">{(['all', 'positive', 'negative', 'claims', 'verified'] as const).map((value) => <button key={value} type="button" onClick={() => setFilter(value)} className={`border px-4 py-2 text-sm font-bold ${filter === value ? 'border-brand bg-brand text-white' : 'border-gray-200 bg-white text-brand-dark'}`}>{filterText[value]}</button>)}</div>

      <div className="space-y-5">
        {visibleReviews.map((review) => (
          <ReviewCard
            key={review.id}
            authorName={review.authorName}
            title={review.title}
            body={review.body}
            rating={review.rating}
            experienceType={review.experienceType}
            policyType={review.policyType}
            tripCountry={review.tripCountry}
            claimOutcome={review.claimOutcome}
            claimAmount={review.claimAmount}
            responseTime={review.responseTime}
            verifiedExperience={review.verifiedExperience}
            pros={review.pros}
            cons={review.cons}
            recommend={review.recommend}
            createdAt={review.createdAt}
            helpfulUp={review.helpfulUp}
            helpfulDown={review.helpfulDown}
            replies={review.replies}
          />
        ))}
        {visibleReviews.length === 0 && <p className="text-gray-500">{t.companyReviewsPage.noReviews}</p>}
      </div>
    </div>
  )
}
