import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/getPayloadClient'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function activityItem(document: any) {
  const company = document.company && typeof document.company === 'object'
    ? { name: document.company.name, slug: document.company.slug }
    : document.company

  return {
    id: String(document.id),
    title: document.title,
    status: document.status,
    createdAt: document.createdAt,
    company,
  }
}

export async function POST(request: Request) {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: request.headers })

  if (!user || user.collection !== 'customers') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401, headers: { 'Cache-Control': 'private, no-store', Vary: 'Cookie' } },
    )
  }

  const ownActivity = { customer: { equals: user.id } }
  const [reviews, complaints] = await Promise.all([
    payload.find({
      collection: 'reviews',
      where: ownActivity,
      sort: '-createdAt',
      limit: 20,
      depth: 1,
    }),
    payload.find({
      collection: 'complaints',
      where: ownActivity,
      sort: '-createdAt',
      limit: 20,
      depth: 1,
    }),
  ])

  return NextResponse.json(
    {
      reviews: reviews.docs.map(activityItem),
      complaints: complaints.docs.map(activityItem),
    },
    { headers: { 'Cache-Control': 'private, no-store', Vary: 'Cookie' } },
  )
}
