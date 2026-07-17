import { companyLogoUrl } from '@/lib/companyLogo'

type UnknownRecord = Record<string, unknown>

export type CatalogInsuranceType = {
  id: number
  slug: string
  title: string
}

export type CatalogCompany = {
  id: string | number
  slug: string
  name: string
  logoUrl?: string
  rating: number
  reviewCount: number
  positiveReviewCount: number
  negativeReviewCount: number
  complaintCount: number
  resolvedComplaintCount: number
  verified: boolean
  popular: boolean
  country?: string
  foundedYear?: number
  uniqueFeature?: string
  insuranceProfile: {
    hasData: boolean
    coverageLimit?: string
    deductible?: string
    assistance24h: boolean
    directBilling: boolean
    onlinePurchase: boolean
    mobileApps?: string
    coverageFeatures: string[]
  }
  insuranceTypes: Pick<CatalogInsuranceType, 'slug' | 'title'>[]
}

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null
}

function requiredString(value: unknown, field: string): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`Company ${field} is missing`)
  }
  return value
}

export function toCatalogCompany(value: unknown): CatalogCompany {
  if (!isRecord(value) || (typeof value.id !== 'string' && typeof value.id !== 'number')) {
    throw new Error('Invalid company document')
  }

  const insuranceTypes = Array.isArray(value.insuranceTypes)
    ? value.insuranceTypes.flatMap((type) => {
        if (!isRecord(type) || typeof type.slug !== 'string' || typeof type.title !== 'string') return []
        return [{ slug: type.slug, title: type.title }]
      })
    : []
  const insuranceProfile = isRecord(value.insuranceProfile) ? value.insuranceProfile : {}
  const coverage = isRecord(insuranceProfile.coverageFeatures)
    ? insuranceProfile.coverageFeatures
    : {}
  const hasInsuranceProfileData =
    typeof insuranceProfile.coverageLimit === 'string' ||
    typeof insuranceProfile.deductible === 'string' ||
    insuranceProfile.assistance24h === true ||
    insuranceProfile.directBilling === true ||
    insuranceProfile.onlinePurchase === true ||
    (typeof insuranceProfile.mobileApps === 'string' && insuranceProfile.mobileApps !== 'none') ||
    typeof insuranceProfile.supportedLanguages === 'string' ||
    typeof insuranceProfile.claimChannels === 'string' ||
    Object.values(coverage).some((value) => value === true)

  return {
    id: value.id,
    slug: requiredString(value.slug, 'slug'),
    name: requiredString(value.name, 'name'),
    logoUrl: companyLogoUrl(value.logo, value.logoFile),
    rating: typeof value.overallRating === 'number' ? value.overallRating : 0,
    reviewCount: typeof value.reviewCount === 'number' ? value.reviewCount : 0,
    positiveReviewCount: typeof value.positiveReviewCount === 'number' ? value.positiveReviewCount : 0,
    negativeReviewCount: typeof value.negativeReviewCount === 'number' ? value.negativeReviewCount : 0,
    complaintCount: typeof value.complaintCount === 'number' ? value.complaintCount : 0,
    resolvedComplaintCount:
      typeof value.resolvedComplaintCount === 'number' ? value.resolvedComplaintCount : 0,
    verified: value.verified === true,
    popular: value.popular === true,
    country: typeof value.country === 'string' ? value.country : undefined,
    foundedYear: typeof value.foundedYear === 'number' ? value.foundedYear : undefined,
    uniqueFeature: typeof value.uniqueFeature === 'string' ? value.uniqueFeature : undefined,
    insuranceProfile: {
      hasData: hasInsuranceProfileData,
      coverageLimit:
        typeof insuranceProfile.coverageLimit === 'string' ? insuranceProfile.coverageLimit : undefined,
      deductible: typeof insuranceProfile.deductible === 'string' ? insuranceProfile.deductible : undefined,
      assistance24h: insuranceProfile.assistance24h === true,
      directBilling: insuranceProfile.directBilling === true,
      onlinePurchase: insuranceProfile.onlinePurchase === true,
      mobileApps: typeof insuranceProfile.mobileApps === 'string' ? insuranceProfile.mobileApps : undefined,
      coverageFeatures: ['covid', 'sports', 'baggage', 'tripCancellation'].filter(
        (feature) => coverage[feature] === true,
      ),
    },
    insuranceTypes,
  }
}
