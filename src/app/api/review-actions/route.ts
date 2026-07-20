import { createHmac } from 'node:crypto'
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

type Vote = 'up' | 'down'

function positiveId(value: unknown) {
  const id = Number(value)
  return Number.isInteger(id) && id > 0 ? id : undefined
}

function text(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

function anonymousVoterKey(request: NextRequest, reviewId: number) {
  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  const address = forwardedFor || request.headers.get('x-real-ip') || 'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'
  return createHmac('sha256', payloadSecret())
    .update(`${address}|${userAgent}|${reviewId}`)
    .digest('hex')
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

  const { user } = await source.payload.auth({ headers: request.headers })
  const identity = user?.collection === 'customers'
    ? `customer:${user.id}:${reviewId}`
    : `anonymous:${anonymousVoterKey(request, reviewId)}`
  const voterKey = createHmac('sha256', payloadSecret()).update(identity).digest('hex')
  const existing = await source.payload.find({
    collection: 'review-votes',
    where: { voterKey: { equals: voterKey } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const previousVote = existing.docs[0]?.direction as Vote | undefined
  let selectedVote: Vote | null = direction

  if (existing.docs[0] && previousVote === direction) {
    await source.payload.delete({
      collection: 'review-votes',
      id: existing.docs[0].id,
      overrideAccess: true,
    })
    selectedVote = null
  } else if (existing.docs[0]) {
    await source.payload.update({
      collection: 'review-votes',
      id: existing.docs[0].id,
      overrideAccess: true,
      data: { direction },
    })
  } else {
    await source.payload.create({
      collection: 'review-votes',
      overrideAccess: true,
      data: { review: reviewId, voterKey, direction },
    })
  }

  const [upVotes, downVotes] = await Promise.all([
    source.payload.count({
      collection: 'review-votes',
      where: { and: [{ review: { equals: reviewId } }, { direction: { equals: 'up' } }] },
      overrideAccess: true,
    }),
    source.payload.count({
      collection: 'review-votes',
      where: { and: [{ review: { equals: reviewId } }, { direction: { equals: 'down' } }] },
      overrideAccess: true,
    }),
  ])
  await source.payload.update({
    collection: 'reviews',
    id: reviewId,
    overrideAccess: true,
    data: { helpfulUp: upVotes.totalDocs, helpfulDown: downVotes.totalDocs },
  })

  return NextResponse.json(
    { success: true, helpfulUp: upVotes.totalDocs, helpfulDown: downVotes.totalDocs, vote: selectedVote },
    { headers: privateNoStoreHeaders },
  )
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

    const limited = await rateLimit(request, `review:${action}`, action === 'vote' ? 30 : 5, 15 * 60 * 1000)
    if (limited) return limited
    return await (action === 'vote' ? vote(request, body) : reply(request, body))
  } catch (error) {
    console.error('Review action failed', error)
    return NextResponse.json({ error: 'Unable to complete action' }, { status: 400, headers: publicNoStoreHeaders })
  }
}
