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
  verified: boolean
  popular: boolean
  country?: string
  foundedYear?: number
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

  return {
    id: value.id,
    slug: requiredString(value.slug, 'slug'),
    name: requiredString(value.name, 'name'),
    logoUrl: companyLogoUrl(value.logo, value.logoFile),
    rating: typeof value.overallRating === 'number' ? value.overallRating : 0,
    reviewCount: typeof value.reviewCount === 'number' ? value.reviewCount : 0,
    verified: value.verified === true,
    popular: value.popular === true,
    country: typeof value.country === 'string' ? value.country : undefined,
    foundedYear: typeof value.foundedYear === 'number' ? value.foundedYear : undefined,
    insuranceTypes,
  }
}
