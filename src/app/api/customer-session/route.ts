import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/getPayloadClient'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: request.headers })

  if (!user || user.collection !== 'customers') {
    return NextResponse.json(
      { user: null },
      { headers: { 'Cache-Control': 'private, no-store', Vary: 'Cookie' } },
    )
  }

  return NextResponse.json(
    {
      user: {
        id: String(user.id),
        email: user.email,
        name: user.name,
        subscriptions: Array.isArray(user.companySubscriptions)
          ? user.companySubscriptions.map((company) =>
              String(typeof company === 'object' ? company.id : company),
            )
          : [],
      },
    },
    { headers: { 'Cache-Control': 'private, no-store', Vary: 'Cookie' } },
  )
}
