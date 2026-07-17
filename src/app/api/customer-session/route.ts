import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/getPayloadClient'
import { toCustomerSession } from '@/lib/customerSession'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: request.headers })
  const customer = toCustomerSession(user)

  return NextResponse.json(
    { user: customer },
    { headers: { 'Cache-Control': 'private, no-store', Vary: 'Cookie' } },
  )
}
