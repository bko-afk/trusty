import { NextResponse } from 'next/server'

const requestBuckets = new Map<string, number[]>()

export const privateNoStoreHeaders = {
  'Cache-Control': 'private, no-store, max-age=0',
  Vary: 'Cookie',
}

export const publicNoStoreHeaders = {
  'Cache-Control': 'no-store, max-age=0',
}

function forwardedOrigin(request: Request) {
  const forwardedHost = request.headers.get('x-forwarded-host')
  const host = forwardedHost || request.headers.get('host')
  if (!host) return new URL(request.url).origin

  const forwardedProto = request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim()
  const protocol = forwardedProto || new URL(request.url).protocol.replace(':', '')
  return `${protocol}://${host.split(',')[0].trim()}`
}

export function isSameOriginRequest(request: Request) {
  const origin = request.headers.get('origin')
  if (!origin) return false

  const allowed = new Set([forwardedOrigin(request), new URL(request.url).origin])
  const configured = process.env.NEXT_PUBLIC_SERVER_URL
  if (configured) {
    try {
      allowed.add(new URL(configured).origin)
    } catch {
      // Invalid deployment configuration is handled by Payload startup validation.
    }
  }
  return allowed.has(origin)
}

export function rejectLargeRequest(request: Request, maxBytes: number) {
  const contentLength = Number(request.headers.get('content-length'))
  if (Number.isFinite(contentLength) && contentLength > maxBytes) {
    return NextResponse.json(
      { error: 'Request is too large' },
      { status: 413, headers: publicNoStoreHeaders },
    )
  }
  return null
}

export function rateLimit(request: Request, scope: string, limit: number, windowMs: number) {
  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  const client = forwardedFor || request.headers.get('x-real-ip') || 'unknown'
  const key = `${scope}:${client}`
  const now = Date.now()
  const active = (requestBuckets.get(key) || []).filter((timestamp) => now - timestamp < windowMs)

  if (active.length >= limit) {
    requestBuckets.set(key, active)
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          ...publicNoStoreHeaders,
          'Retry-After': String(Math.ceil(windowMs / 1000)),
        },
      },
    )
  }

  active.push(now)
  requestBuckets.set(key, active)
  return null
}
