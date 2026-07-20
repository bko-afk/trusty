import { NextResponse } from 'next/server'
import type { BasePayload, JsonObject } from 'payload'
import type { Review } from '@/payload-types'
import { getPayloadClient } from '@/lib/getPayloadClient'
import {
  isSameOriginRequest,
  publicNoStoreHeaders,
  rateLimit,
  rejectLargeRequest,
} from '@/lib/apiSecurity'
import { countries } from '@/lib/countries'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type SubmissionType = 'review' | 'complaint' | 'company'

const submissionTypes = new Set<SubmissionType>(['review', 'complaint', 'company'])
const claimOutcomes = new Set(['not_applicable', 'paid', 'partially_paid', 'denied', 'pending'])
const responseTimes = new Set(['same_day', '1_3_days', '4_7_days', '8_30_days', 'more_30_days', 'no_response'])
const countryCodes = new Set(countries.map((country) => country.code))

type CountryCode = NonNullable<Review['tripCountry']>
type ClaimOutcome = NonNullable<Review['claimOutcome']>
type ResponseTime = NonNullable<Review['responseTime']>

function text(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

function optionalText(value: unknown, maxLength: number) {
  const normalized = text(value, maxLength)
  return normalized || undefined
}

function positiveId(value: unknown) {
  const id = Number(value)
  return Number.isInteger(id) && id > 0 ? id : undefined
}

function rating(value: unknown) {
  const number = Number(value)
  return Number.isInteger(number) && number >= 1 && number <= 5 ? number : undefined
}

function countryCode(value: unknown): CountryCode | undefined {
  const code = text(value, 2).toUpperCase()
  return countryCodes.has(code) ? code as CountryCode : undefined
}

function textRows(value: unknown) {
  if (!Array.isArray(value)) return []
  return value
    .slice(0, 10)
    .map((row) => ({ text: text((row as { text?: unknown })?.text, 240) }))
    .filter((row) => row.text.length > 0)
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

async function publishedCompany(payload: BasePayload, companyId: number) {
  const company = await payload.findByID({
    collection: 'companies',
    id: companyId,
    depth: 0,
    overrideAccess: true,
  })
  return company?.status === 'published' ? company : null
}

async function createReview(payload: BasePayload, body: JsonObject, request: Request) {
  const companyId = positiveId(body.company)
  const overallRating = rating(body.rating)
  if (!companyId || !overallRating || !(await publishedCompany(payload, companyId))) {
    return NextResponse.json({ error: 'Invalid company or rating' }, { status: 400, headers: publicNoStoreHeaders })
  }

  const { user } = await payload.auth({ headers: request.headers })
  const customer = user?.collection === 'customers' ? user : null
  const authorName = customer?.name || customer?.email || text(body.authorName, 80)
  if (authorName.length < 2) {
    return NextResponse.json({ error: 'Author name is required' }, { status: 400, headers: publicNoStoreHeaders })
  }

  const criteria = body.criteria && typeof body.criteria === 'object' && !Array.isArray(body.criteria)
    ? body.criteria as JsonObject
    : {}
  const experienceType = body.experienceType === 'claim' ? 'claim' : 'purchase'
  const claimOutcome = text(body.claimOutcome, 30)
  const responseTime = text(body.responseTime, 30)

  await payload.create({
    collection: 'reviews',
    overrideAccess: true,
    user: customer || undefined,
    data: {
      company: companyId,
      authorName,
      authorEmail: customer?.email || optionalText(body.authorEmail, 254),
      title: text(body.title, 160),
      body: text(body.body, 5000),
      rating: overallRating,
      experienceType,
      policyType: positiveId(body.policyType),
      tripCountry: countryCode(body.tripCountry),
      claimOutcome: claimOutcomes.has(claimOutcome) ? claimOutcome as ClaimOutcome : 'not_applicable',
      claimAmount: experienceType === 'claim' ? optionalText(body.claimAmount, 120) : undefined,
      responseTime: responseTimes.has(responseTime) ? responseTime as ResponseTime : undefined,
      criteria: {
        coverage: rating(criteria.coverage),
        price: rating(criteria.price),
        claimsService: rating(criteria.claimsService),
        support: rating(criteria.support),
      },
      recommend: body.recommend === true,
      pros: textRows(body.pros),
      cons: textRows(body.cons),
      status: 'pending',
      includeInRating: false,
    },
  })

  return NextResponse.json({ success: true }, { status: 201, headers: publicNoStoreHeaders })
}

async function createComplaint(payload: BasePayload, body: JsonObject, request: Request) {
  const companyId = positiveId(body.company)
  if (!companyId || !(await publishedCompany(payload, companyId))) {
    return NextResponse.json({ error: 'Invalid company' }, { status: 400, headers: publicNoStoreHeaders })
  }

  const { user } = await payload.auth({ headers: request.headers })
  const customer = user?.collection === 'customers' ? user : null
  const authorName = customer?.name || customer?.email || text(body.authorName, 80)
  if (authorName.length < 2) {
    return NextResponse.json({ error: 'Author name is required' }, { status: 400, headers: publicNoStoreHeaders })
  }

  await payload.create({
    collection: 'complaints',
    overrideAccess: true,
    user: customer || undefined,
    data: {
      company: companyId,
      authorName,
      authorEmail: customer?.email || optionalText(body.authorEmail, 254),
      title: text(body.title, 160),
      body: text(body.body, 5000),
      status: 'pending',
      resolved: false,
      workflowStatus: 'submitted',
    },
  })

  return NextResponse.json({ success: true }, { status: 201, headers: publicNoStoreHeaders })
}

async function createCompany(payload: BasePayload, body: JsonObject) {
  const name = text(body.name, 120)
  if (name.length < 2) {
    return NextResponse.json({ error: 'Company name is required' }, { status: 400, headers: publicNoStoreHeaders })
  }

  const insuranceTypes = Array.isArray(body.insuranceTypes)
    ? body.insuranceTypes.map(positiveId).filter((id): id is number => id !== undefined).slice(0, 20)
    : []

  await payload.create({
    collection: 'companies',
    overrideAccess: true,
    data: {
      name,
      slug: slugify(name) || `company-${Date.now().toString(36)}`,
      status: 'draft',
      website: optionalText(body.website, 300),
      city: optionalText(body.city, 120),
      country: countryCode(body.country),
      shortDescription: optionalText(body.shortDescription, 800),
      insuranceTypes,
    },
  })

  return NextResponse.json({ success: true }, { status: 201, headers: publicNoStoreHeaders })
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ type: string }> },
) {
  const { type: rawType } = await params
  if (!submissionTypes.has(rawType as SubmissionType)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404, headers: publicNoStoreHeaders })
  }
  const type = rawType as SubmissionType

  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'Invalid request origin' }, { status: 403, headers: publicNoStoreHeaders })
  }

  const oversized = rejectLargeRequest(request, type === 'review' ? 32_000 : 12_000)
  if (oversized) return oversized

  const limited = rateLimit(request, `submission:${type}`, 5, 15 * 60 * 1000)
  if (limited) return limited

  try {
    const body = await request.json() as JsonObject
    if (text(body.contactWebsite, 200)) {
      return NextResponse.json({ success: true }, { status: 202, headers: publicNoStoreHeaders })
    }

    const payload = await getPayloadClient()
    if (type === 'review') return await createReview(payload, body, request)
    if (type === 'complaint') return await createComplaint(payload, body, request)
    return await createCompany(payload, body)
  } catch (error) {
    console.error(`Public ${type} submission failed`, error)
    return NextResponse.json(
      { error: 'Unable to submit the form' },
      { status: 400, headers: publicNoStoreHeaders },
    )
  }
}
