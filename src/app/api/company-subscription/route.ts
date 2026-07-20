import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/getPayloadClient'
import {
  isSameOriginRequest,
  privateNoStoreHeaders,
  rateLimit,
  rejectLargeRequest,
} from '@/lib/apiSecurity'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'Invalid request origin' }, { status: 403, headers: privateNoStoreHeaders })
  }
  const oversized = rejectLargeRequest(request, 2_000)
  if (oversized) return oversized
  const limited = await rateLimit(request, 'company-subscription', 60, 15 * 60 * 1000)
  if (limited) return limited

  try {
    const payload = await getPayloadClient()
    const { user } = await payload.auth({ headers: request.headers })

    if (!user || user.collection !== 'customers') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: privateNoStoreHeaders })
    }

    const body = (await request.json()) as { companyId?: unknown }
    const companyId = Number(body.companyId)
    if (!Number.isInteger(companyId) || companyId <= 0) {
      return NextResponse.json({ error: 'Invalid company' }, { status: 400, headers: privateNoStoreHeaders })
    }

    const company = await payload.findByID({
      collection: 'companies',
      id: companyId,
      depth: 0,
    })
    if (!company || company.status !== 'published') {
      return NextResponse.json({ error: 'Company not found' }, { status: 404, headers: privateNoStoreHeaders })
    }

    const customer = await payload.findByID({
      collection: 'customers',
      id: user.id,
      depth: 0,
      overrideAccess: true,
    })
    const subscriptions = Array.isArray(customer.companySubscriptions)
      ? customer.companySubscriptions.map((value) => Number(typeof value === 'object' ? value.id : value))
      : []
    const isSubscribed = subscriptions.includes(companyId)
    const nextSubscriptions = isSubscribed
      ? subscriptions.filter((id) => id !== companyId)
      : [...subscriptions, companyId]

    await payload.update({
      collection: 'customers',
      id: user.id,
      data: { companySubscriptions: nextSubscriptions },
      overrideAccess: true,
    })

    return NextResponse.json(
      {
        subscribed: !isSubscribed,
        subscriptions: nextSubscriptions.map(String),
      },
      { headers: privateNoStoreHeaders },
    )
  } catch (error) {
    console.error('Company subscription request failed', error)
    return NextResponse.json(
      { error: 'Unable to update subscription' },
      { status: 500, headers: privateNoStoreHeaders },
    )
  }
}
