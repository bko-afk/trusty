import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/getPayloadClient'
import { toCatalogCompany } from '@/lib/catalogCompany'
import { sortCompaniesByRanking } from '@/lib/companyRanking'
import { publicNoStoreHeaders, rateLimit, rejectLargeRequest } from '@/lib/apiSecurity'
import { boundedPage } from '@/lib/pagination'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type FilterBody = {
  locale?: unknown
  page?: unknown
  query?: unknown
  verified?: unknown
  popular?: unknown
  countries?: unknown
  insuranceTypeIds?: unknown
  minimumRating?: unknown
  foundedFrom?: unknown
  foundedTo?: unknown
  reviewsFrom?: unknown
  reviewsTo?: unknown
}

function optionalNumber(value: unknown, min: number, max: number) {
  if (value === '' || value === undefined || value === null) return undefined
  const number = Number(value)
  return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : undefined
}

function stringArray(value: unknown, maxItems: number) {
  if (!Array.isArray(value)) return []
  return value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, maxItems)
}

function numberArray(value: unknown, maxItems: number) {
  if (!Array.isArray(value)) return []
  return value
    .map(Number)
    .filter((item) => Number.isInteger(item) && item > 0)
    .slice(0, maxItems)
}

export async function POST(request: Request) {
  const oversized = rejectLargeRequest(request, 16_000)
  if (oversized) return oversized
  const limited = await rateLimit(request, 'company-search', 120, 60 * 1000)
  if (limited) return limited

  try {
    const body = (await request.json()) as FilterBody
    const locale = body.locale === 'ru' || body.locale === 'es' ? body.locale : 'en'
    const page = boundedPage(body.page)
    const query = typeof body.query === 'string' ? body.query.trim().slice(0, 120) : ''
    const selectedCountries = stringArray(body.countries, 20)
    const insuranceTypeIds = numberArray(body.insuranceTypeIds, 20)
    const minimumRating = optionalNumber(body.minimumRating, 0, 5)
    const foundedFrom = optionalNumber(body.foundedFrom, 1800, 2100)
    const foundedTo = optionalNumber(body.foundedTo, 1800, 2100)
    const reviewsFrom = optionalNumber(body.reviewsFrom, 0, 100000)
    const reviewsTo = optionalNumber(body.reviewsTo, 0, 100000)

    const and: any[] = [{ status: { equals: 'published' } }]

    if (query) and.push({ name: { like: query } })
    if (body.verified === true) and.push({ verified: { equals: true } })
    if (body.popular === true) and.push({ popular: { equals: true } })
    if (selectedCountries.length > 0) and.push({ country: { in: selectedCountries } })
    if (insuranceTypeIds.length > 0) {
      and.push({
        or: insuranceTypeIds.map((id) => ({ insuranceTypes: { contains: id } })),
      })
    }
    if (minimumRating && minimumRating > 0) {
      and.push({ overallRating: { greater_than_equal: minimumRating } })
    }
    if (foundedFrom !== undefined) and.push({ foundedYear: { greater_than_equal: foundedFrom } })
    if (foundedTo !== undefined) and.push({ foundedYear: { less_than_equal: foundedTo } })
    if (reviewsFrom !== undefined) and.push({ reviewCount: { greater_than_equal: reviewsFrom } })
    if (reviewsTo !== undefined) and.push({ reviewCount: { less_than_equal: reviewsTo } })

    const payload = await getPayloadClient()
    const pageSize = 25
    const needsCategoryRanking = insuranceTypeIds.length > 0
    const result = await payload.find({
      collection: 'companies',
      where: { and },
      sort: needsCategoryRanking ? undefined : ['ranking.globalPosition', '-overallRating', 'name'],
      pagination: !needsCategoryRanking,
      limit: needsCategoryRanking ? undefined : pageSize,
      page: needsCategoryRanking ? undefined : page,
      depth: 1,
      locale,
    })
    const rankedCompanies = needsCategoryRanking
      ? sortCompaniesByRanking(result.docs, insuranceTypeIds)
      : result.docs
    const offset = needsCategoryRanking ? (page - 1) * pageSize : 0
    const total = needsCategoryRanking ? rankedCompanies.length : result.totalDocs

    return NextResponse.json(
      {
        companies: rankedCompanies.slice(offset, offset + pageSize).map(toCatalogCompany),
        total,
        page,
        totalPages: needsCategoryRanking
          ? Math.max(1, Math.ceil(total / pageSize))
          : result.totalPages,
      },
      { headers: publicNoStoreHeaders },
    )
  } catch (error) {
    console.error('Company filter request failed', error)
    return NextResponse.json(
      { error: 'Unable to filter companies' },
      { status: 500, headers: publicNoStoreHeaders },
    )
  }
}
