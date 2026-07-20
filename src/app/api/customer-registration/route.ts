import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/getPayloadClient'
import {
  isSameOriginRequest,
  publicNoStoreHeaders,
  rateLimit,
  rejectLargeRequest,
} from '@/lib/apiSecurity'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function text(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'Invalid request origin' }, { status: 403, headers: publicNoStoreHeaders })
  }
  const oversized = rejectLargeRequest(request, 4_000)
  if (oversized) return oversized
  const limited = rateLimit(request, 'customer-registration', 5, 60 * 60 * 1000)
  if (limited) return limited

  try {
    const body = await request.json() as Record<string, unknown>
    if (text(body.contactWebsite, 200)) {
      return NextResponse.json({ success: true }, { status: 202, headers: publicNoStoreHeaders })
    }

    const name = text(body.name, 80)
    const email = text(body.email, 254).toLowerCase()
    const password = typeof body.password === 'string' ? body.password : ''
    if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || password.length < 8 || password.length > 128) {
      return NextResponse.json({ error: 'Invalid registration data' }, { status: 400, headers: publicNoStoreHeaders })
    }

    const payload = await getPayloadClient()
    await payload.create({
      collection: 'customers',
      overrideAccess: true,
      data: { name, email, password },
    })

    return NextResponse.json({ success: true }, { status: 201, headers: publicNoStoreHeaders })
  } catch (error) {
    console.error('Customer registration failed', error)
    return NextResponse.json(
      { error: 'Unable to create account' },
      { status: 400, headers: publicNoStoreHeaders },
    )
  }
}
