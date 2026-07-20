type ReviewLike = {
  company?: string | number | { id?: string | number } | null
  rating?: number | null
  includeInRating?: boolean | null
  criteria?: Record<string, number | null | undefined> | null
}

export type CompanyReviewStats = {
  reviewCount: number
  ratingReviewCount: number
  overallRating: number
  positiveReviewCount: number
  negativeReviewCount: number
  criteriaAverages: Record<string, number>
}

const CRITERIA_KEYS = ['coverage', 'price', 'claimsService', 'support'] as const

function relationshipId(value: ReviewLike['company']) {
  if (value && typeof value === 'object') return value.id
  return value
}

export function calculateReviewStats(reviews: ReviewLike[]): CompanyReviewStats {
  const ratingReviews = reviews.filter(
    (review) => review.includeInRating === true && typeof review.rating === 'number',
  )
  const average = ratingReviews.length
    ? ratingReviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / ratingReviews.length
    : 0
  const criteriaAverages: Record<string, number> = {}

  for (const key of CRITERIA_KEYS) {
    const values = ratingReviews
      .map((review) => review.criteria?.[key])
      .filter((value): value is number => typeof value === 'number')
    criteriaAverages[key] = values.length
      ? Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10) / 10
      : 0
  }

  return {
    reviewCount: reviews.length,
    ratingReviewCount: ratingReviews.length,
    overallRating: Math.round(average * 10) / 10,
    positiveReviewCount: reviews.filter((review) => Number(review.rating || 0) >= 4).length,
    negativeReviewCount: reviews.filter((review) => Number(review.rating || 0) <= 2).length,
    criteriaAverages,
  }
}

export function reviewStatsByCompany(reviews: ReviewLike[]) {
  const grouped = new Map<string, ReviewLike[]>()
  for (const review of reviews) {
    const id = relationshipId(review.company)
    if (id === undefined || id === null) continue
    const key = String(id)
    const companyReviews = grouped.get(key) || []
    companyReviews.push(review)
    grouped.set(key, companyReviews)
  }

  const stats = new Map<string, CompanyReviewStats>()
  for (const [companyId, companyReviews] of grouped) {
    stats.set(companyId, calculateReviewStats(companyReviews))
  }
  return stats
}

export function applyCompanyReviewStats<T extends { id: string | number }>(
  companies: T[],
  stats: Map<string, CompanyReviewStats>,
) {
  return companies.map((company) => {
    const companyStats = stats.get(String(company.id)) || calculateReviewStats([])
    return {
      ...company,
      overallRating: companyStats.overallRating,
      reviewCount: companyStats.reviewCount,
      positiveReviewCount: companyStats.positiveReviewCount,
      negativeReviewCount: companyStats.negativeReviewCount,
    }
  })
}
