import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/getPayloadClient'
import { toCustomerSession } from '@/lib/customerSession'
import { isSameOriginRequest, privateNoStoreHeaders, rateLimit } from '@/lib/apiSecurity'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'Invalid request origin' }, { status: 403, headers: privateNoStoreHeaders })
  }
  const limited = rateLimit(request, 'customer-session', 120, 15 * 60 * 1000)
  if (limited) return limited

  try {
    const payload = await getPayloadClient()
    const { user } = await payload.auth({ headers: request.headers })
    const customer = toCustomerSession(user)

    return NextResponse.json({ user: customer }, { headers: privateNoStoreHeaders })
  } catch (error) {
    console.error('Customer session request failed', error)
    return NextResponse.json({ user: null }, { status: 500, headers: privateNoStoreHeaders })
  }
}
