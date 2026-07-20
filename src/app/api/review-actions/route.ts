import { createHmac, timingSafeEqual } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/getPayloadClient'
import {
  isSameOriginRequest,
  privateNoStoreHeaders,
  publicNoStoreHeaders,
  rateLimit,
  rejectLargeRequest,
} from '@/lib/apiSecurity'
import { payloadSecret } from '@/lib/runtimeConfig'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const COOKIE_NAME = 'trusty_review_votes'
type Vote = 'up' | 'down'
type VoteMap = Record<string, Vote>

function positiveId(value: unknown) {
  const id = Number(value)
  return Number.isInteger(id) && id > 0 ? id : undefined
}

function text(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

function sign(value: string) {
  return createHmac('sha256', payloadSecret()).update(value).digest('base64url')
}

function readVotes(cookieValue?: string): VoteMap {
  if (!cookieValue) return {}
  const separator = cookieValue.lastIndexOf('.')
  if (separator < 1) return {}
  const encoded = cookieValue.slice(0, separator)
  const suppliedSignature = cookieValue.slice(separator + 1)
  const expectedSignature = sign(encoded)
  const supplied = Buffer.from(suppliedSignature)
  const expected = Buffer.from(expectedSignature)
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return {}

  try {
    const parsed = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as VoteMap
    return Object.fromEntries(
      Object.entries(parsed).filter(([, vote]) => vote === 'up' || vote === 'down').slice(-100),
    )
  } catch {
    return {}
  }
}

function writeVotes(response: NextResponse, votes: VoteMap) {
  const encoded = Buffer.from(JSON.stringify(votes)).toString('base64url')
  response.cookies.set(COOKIE_NAME, `${encoded}.${sign(encoded)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  })
}

async function publishedReview(reviewId: number) {
  const payload = await getPayloadClient()
  try {
    const review = await payload.findByID({
      collection: 'reviews',
      id: reviewId,
      depth: 0,
      overrideAccess: true,
    })
    return review.status === 'published' ? { payload, review } : null
  } catch {
    return null
  }
}

async function vote(request: NextRequest, body: Record<string, unknown>) {
  const reviewId = positiveId(body.reviewId)
  const direction = body.direction === 'up' || body.direction === 'down' ? body.direction : null
  if (!reviewId || !direction) {
    return NextResponse.json({ error: 'Invalid vote' }, { status: 400, headers: publicNoStoreHeaders })
  }

  const source = await publishedReview(reviewId)
  if (!source) return NextResponse.json({ error: 'Review not found' }, { status: 404, headers: publicNoStoreHeaders })

  const votes = readVotes(request.cookies.get(COOKIE_NAME)?.value)
  const previousVote = votes[String(reviewId)]
  let helpfulUp = Number(source.review.helpfulUp || 0)
  let helpfulDown = Number(source.review.helpfulDown || 0)

  if (previousVote === direction) {
    if (direction === 'up') helpfulUp = Math.max(0, helpfulUp - 1)
    if (direction === 'down') helpfulDown = Math.max(0, helpfulDown - 1)
    delete votes[String(reviewId)]
    await source.payload.update({
      collection: 'reviews',
      id: reviewId,
      overrideAccess: true,
      data: { helpfulUp, helpfulDown },
    })
  } else {
    if (previousVote === 'up') helpfulUp = Math.max(0, helpfulUp - 1)
    if (previousVote === 'down') helpfulDown = Math.max(0, helpfulDown - 1)
    if (direction === 'up') helpfulUp += 1
    if (direction === 'down') helpfulDown += 1
    votes[String(reviewId)] = direction
    await source.payload.update({
      collection: 'reviews',
      id: reviewId,
      overrideAccess: true,
      data: { helpfulUp, helpfulDown },
    })
  }

  const response = NextResponse.json(
    { success: true, helpfulUp, helpfulDown, vote: votes[String(reviewId)] || null },
    { headers: privateNoStoreHeaders },
  )
  writeVotes(response, votes)
  return response
}

async function reply(request: NextRequest, body: Record<string, unknown>) {
  const reviewId = positiveId(body.reviewId)
  const replyBody = text(body.body, 2000)
  if (!reviewId || replyBody.length < 5) {
    return NextResponse.json({ error: 'Reply is too short' }, { status: 400, headers: privateNoStoreHeaders })
  }

  const source = await publishedReview(reviewId)
  if (!source) return NextResponse.json({ error: 'Review not found' }, { status: 404, headers: privateNoStoreHeaders })

  const { user } = await source.payload.auth({ headers: request.headers })
  if (!user || user.collection !== 'customers') {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401, headers: privateNoStoreHeaders })
  }

  await source.payload.create({
    collection: 'review-replies',
    overrideAccess: true,
    user,
    data: {
      review: reviewId,
      authorType: 'customer',
      authorName: user.name || user.email,
      body: replyBody,
      status: 'pending',
    },
  })

  return NextResponse.json({ success: true }, { status: 201, headers: privateNoStoreHeaders })
}

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'Invalid request origin' }, { status: 403, headers: publicNoStoreHeaders })
  }
  const oversized = rejectLargeRequest(request, 5000)
  if (oversized) return oversized

  try {
    const body = await request.json() as Record<string, unknown>
    const action = body.action === 'reply' ? 'reply' : body.action === 'vote' ? 'vote' : null
    if (!action) return NextResponse.json({ error: 'Invalid action' }, { status: 400, headers: publicNoStoreHeaders })

    const limited = rateLimit(request, `review:${action}`, action === 'vote' ? 30 : 5, 15 * 60 * 1000)
    if (limited) return limited
    return await (action === 'vote' ? vote(request, body) : reply(request, body))
  } catch (error) {
    console.error('Review action failed', error)
    return NextResponse.json({ error: 'Unable to complete action' }, { status: 400, headers: publicNoStoreHeaders })
  }
}
