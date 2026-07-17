import type { Company, InsuranceType } from '@/payload-types'
import { companyLogoUrl } from '@/lib/companyLogo'

export type CatalogInsuranceType = {
  id: number
  slug: string
  title: string
}

export type CatalogCompany = {
  id: number
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

export function toCatalogCompany(company: Company): CatalogCompany {
  return {
    id: company.id,
    slug: company.slug,
    name: company.name,
    logoUrl: companyLogoUrl(company.logo, company.logoFile),
    rating: company.overallRating || 0,
    reviewCount: company.reviewCount || 0,
    verified: Boolean(company.verified),
    popular: Boolean(company.popular),
    country: company.country || undefined,
    foundedYear: company.foundedYear || undefined,
    insuranceTypes: (company.insuranceTypes || [])
      .filter((type): type is InsuranceType => typeof type === 'object')
      .map((type) => ({ slug: type.slug, title: type.title })),
  }
}
