import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/getPayloadClient'
import { isSameOriginRequest, privateNoStoreHeaders, rateLimit } from '@/lib/apiSecurity'

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
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'Invalid request origin' }, { status: 403, headers: privateNoStoreHeaders })
  }
  const limited = await rateLimit(request, 'account-activity', 60, 15 * 60 * 1000)
  if (limited) return limited

  try {
    const payload = await getPayloadClient()
    const { user } = await payload.auth({ headers: request.headers })

    if (!user || user.collection !== 'customers') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: privateNoStoreHeaders },
      )
    }

    const ownActivity = { customer: { equals: user.id } }
    const [reviews, complaints, customer] = await Promise.all([
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
    payload.findByID({ collection: 'customers', id: user.id, depth: 1, overrideAccess: true }),
    ])
    const subscriptionIds = Array.isArray(customer.companySubscriptions)
    ? customer.companySubscriptions.map((company) =>
        typeof company === 'object' ? company.id : company,
      )
    : []
    const subscribedUpdates = subscriptionIds.length > 0
    ? await Promise.all([
        payload.find({ collection: 'reviews', where: { and: [{ company: { in: subscriptionIds } }, { status: { equals: 'published' } }] }, sort: '-createdAt', limit: 10, depth: 1 }),
        payload.find({ collection: 'complaints', where: { and: [{ company: { in: subscriptionIds } }, { status: { equals: 'published' } }] }, sort: '-createdAt', limit: 10, depth: 1 }),
      ])
    : null
    const updates = subscribedUpdates
    ? [
        ...subscribedUpdates[0].docs.map((document) => ({ ...activityItem(document), type: 'review' as const })),
        ...subscribedUpdates[1].docs.map((document) => ({ ...activityItem(document), type: 'complaint' as const })),
      ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 10)
    : []

    return NextResponse.json(
      {
        reviews: reviews.docs.map(activityItem),
        complaints: complaints.docs.map(activityItem),
        subscriptions: Array.isArray(customer.companySubscriptions)
          ? customer.companySubscriptions.flatMap((company) =>
              company && typeof company === 'object'
                ? [{ id: String(company.id), name: company.name, slug: company.slug }]
                : [],
            )
          : [],
        updates,
      },
      { headers: privateNoStoreHeaders },
    )
  } catch (error) {
    console.error('Account activity request failed', error)
    return NextResponse.json(
      { error: 'Unable to load account activity' },
      { status: 500, headers: privateNoStoreHeaders },
    )
  }
}
