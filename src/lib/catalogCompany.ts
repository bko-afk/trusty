import { companyLogoUrl } from '@/lib/companyLogo'

type CatalogCompanySource = {
  id: string | number
  slug: string
  name: string
  logo?: Parameters<typeof companyLogoUrl>[0]
  logoFile?: string | null
  overallRating?: number | null
  reviewCount?: number | null
  verified?: boolean | null
  popular?: boolean | null
  country?: string | null
  foundedYear?: number | null
  insuranceTypes?: Array<string | number | CatalogInsuranceTypeSource> | null
}

type CatalogInsuranceTypeSource = {
  slug: string
  title: string
}

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

export function toCatalogCompany(company: CatalogCompanySource): CatalogCompany {
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
      .filter((type): type is CatalogInsuranceTypeSource => typeof type === 'object')
      .map((type) => ({ slug: type.slug, title: type.title })),
  }
}
