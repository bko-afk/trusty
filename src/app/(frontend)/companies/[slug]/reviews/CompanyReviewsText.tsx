'use client'

import Link from '@/components/LocalizedLink'
import { useState } from 'react'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { RatingStars } from '@/components/RatingStars'
import { ReviewCard } from '@/components/ReviewCard'
import { useLanguage } from '@/i18n/LanguageContext'

type Reply = { id: string; authorName: string; authorType: 'admin' | 'company' | 'customer'; body: string; createdAt: string }
export type CompanyReviewItem = {
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
  criteria?: Partial<Record<'coverage' | 'price' | 'claimsService' | 'support', number>>
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
  ru: { all: 'Все отзывы', positive: 'Положительные', negative: 'Отрицательные', claims: 'Со страховым случаем', verified: 'Подтвержденные', ratingBasis: (published: number) => `Рейтинг рассчитан по всем опубликованным отзывам: ${published}.` },
  en: { all: 'All reviews', positive: 'Positive', negative: 'Negative', claims: 'Claim experience', verified: 'Verified', ratingBasis: (published: number) => `The rating is based on all published reviews: ${published}.` },
  es: { all: 'Todas', positive: 'Positivas', negative: 'Negativas', claims: 'Con siniestro', verified: 'Verificadas', ratingBasis: (published: number) => `El ranking se basa en todas las reseñas publicadas: ${published}.` },
} as const

const paginationCopy = {
  ru: { previous: 'Предыдущая', next: 'Следующая', page: 'Страница', all: 'Посмотреть все отзывы' },
  en: { previous: 'Previous', next: 'Next', page: 'Page', all: 'View all reviews' },
  es: { previous: 'Anterior', next: 'Siguiente', page: 'Página', all: 'Ver todas las reseñas' },
} as const

type ReviewsPanelProps = {
  slug: string
  companyName: string
  overallRating: number
  reviewCount: number
  criteriaAverages: Record<string, number>
  reviews: CompanyReviewItem[]
  compactHeading?: boolean
  pagination?: { page: number; totalPages: number }
}

export function CompanyReviewsPanel({
  slug,
  companyName,
  overallRating,
  reviewCount,
  criteriaAverages,
  reviews,
  compactHeading = false,
  pagination,
}: ReviewsPanelProps) {
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
    <section aria-labelledby="company-reviews-heading">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 id="company-reviews-heading" className={compactHeading ? 'text-2xl font-extrabold' : 'text-3xl font-extrabold'}>
            {t.companyReviewsPage.titlePrefix} «{companyName}»
          </h2>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <RatingStars value={overallRating} />
            <strong>{overallRating.toFixed(1)}</strong>
            <span className="text-sm text-gray-500">{reviewCount} {t.companyDetail.reviewsSuffix}</span>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-500">{filterText.ratingBasis(reviewCount)}</p>
        </div>
        <Link href={`/add-review?company=${slug}`} className="btn-primary">{t.companyReviewsPage.addReview}</Link>
      </div>

      <div className="mb-8 grid gap-4 border border-gray-200 bg-white p-5 sm:grid-cols-2 lg:grid-cols-4">
        {CRITERIA_KEYS.map((key) => (
          <div key={key}>
            <div className="mb-1 flex items-center justify-between gap-2 text-xs text-gray-500"><span>{t.companyReviewsPage.criteria[key]}</span><strong>{criteriaAverages[key]?.toFixed(1) || '0.0'}</strong></div>
            <div className="h-2 rounded-full bg-gray-100"><div className="h-2 rounded-full bg-brand" style={{ width: `${((criteriaAverages[key] || 0) / 5) * 100}%` }} /></div>
          </div>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap gap-2">{(['all', 'positive', 'negative', 'claims', 'verified'] as const).map((value) => <button key={value} type="button" onClick={() => setFilter(value)} className={`border px-4 py-2 text-sm font-bold ${filter === value ? 'border-brand bg-brand text-white' : 'border-gray-200 bg-white text-brand-dark'}`}>{filterText[value]}</button>)}</div>

      <div className="space-y-5">
        {visibleReviews.map((review) => <ReviewCard key={review.id} reviewId={review.id} authorName={review.authorName} title={review.title} body={review.body} rating={review.rating} experienceType={review.experienceType} policyType={review.policyType} tripCountry={review.tripCountry} claimOutcome={review.claimOutcome} claimAmount={review.claimAmount} responseTime={review.responseTime} verifiedExperience={review.verifiedExperience} criteria={review.criteria} pros={review.pros} cons={review.cons} recommend={review.recommend} createdAt={review.createdAt} helpfulUp={review.helpfulUp} helpfulDown={review.helpfulDown} replies={review.replies} />)}
        {visibleReviews.length === 0 && <div className="border border-gray-200 bg-white p-8 text-center text-gray-500">{t.companyReviewsPage.noReviews}</div>}
      </div>
      {!pagination && reviewCount > reviews.length && (
        <div className="mt-8 text-center">
          <Link href={`/companies/${slug}/reviews`} className="btn-secondary">
            {paginationCopy[locale].all} ({reviewCount})
          </Link>
        </div>
      )}
      {pagination && pagination.totalPages > 1 && (
        <nav className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 pt-5" aria-label={paginationCopy[locale].page}>
          {pagination.page > 1 ? <Link href={`/companies/${slug}/reviews?page=${pagination.page - 1}`} className="btn-secondary">{paginationCopy[locale].previous}</Link> : <span />}
          <span className="text-sm font-semibold text-gray-500">{paginationCopy[locale].page} {pagination.page} / {pagination.totalPages}</span>
          {pagination.page < pagination.totalPages ? <Link href={`/companies/${slug}/reviews?page=${pagination.page + 1}`} className="btn-secondary">{paginationCopy[locale].next}</Link> : <span />}
        </nav>
      )}
    </section>
  )
}

export function CompanyReviewsText(props: ReviewsPanelProps) {
  const { t } = useLanguage()
  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: t.common.home, href: '/' }, { label: t.nav.catalog, href: '/companies' }, { label: props.companyName, href: `/companies/${props.slug}` }, { label: t.portal.detail.reviews }]} />
      <CompanyReviewsPanel {...props} />
    </div>
  )
}
