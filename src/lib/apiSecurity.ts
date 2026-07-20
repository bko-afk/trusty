import { NextResponse } from 'next/server'
import { createHmac } from 'node:crypto'

const requestBuckets = new Map<string, number[]>()
let lastBucketSweep = 0
let redisWarningLogged = false

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

function rateLimitResponse(windowMs: number) {
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

function clientKey(request: Request, scope: string) {
  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  const client = forwardedFor || request.headers.get('x-real-ip') || 'unknown'
  const secret = process.env.RATE_LIMIT_SALT || process.env.PAYLOAD_SECRET || 'local-development'
  const digest = createHmac('sha256', secret).update(client).digest('hex').slice(0, 32)
  return `trusty:rate-limit:${scope}:${digest}`
}

function memoryRateLimit(request: Request, scope: string, limit: number, windowMs: number) {
  const key = clientKey(request, scope)
  const now = Date.now()

  if (now - lastBucketSweep > 5 * 60 * 1000) {
    for (const [bucketKey, timestamps] of requestBuckets) {
      if (!timestamps.some((timestamp) => now - timestamp < windowMs)) requestBuckets.delete(bucketKey)
    }
    lastBucketSweep = now
  }

  const active = (requestBuckets.get(key) || []).filter((timestamp) => now - timestamp < windowMs)

  if (active.length >= limit) {
    requestBuckets.set(key, active)
    return rateLimitResponse(windowMs)
  }

  active.push(now)
  requestBuckets.set(key, active)
  return null
}

function logRedisFallback(error: unknown) {
  if (redisWarningLogged) return
  console.error('Distributed rate limiting is unavailable; using the local fallback.', error)
  redisWarningLogged = true
}

export async function rateLimit(request: Request, scope: string, limit: number, windowMs: number) {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL?.replace(/\/$/, '')
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!redisUrl || !redisToken) return memoryRateLimit(request, scope, limit, windowMs)

  try {
    const response = await fetch(`${redisUrl}/multi-exec`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${redisToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        ['INCR', clientKey(request, scope)],
        ['PEXPIRE', clientKey(request, scope), windowMs, 'NX'],
      ]),
      cache: 'no-store',
      signal: AbortSignal.timeout(1500),
    })
    if (!response.ok) {
      logRedisFallback(new Error(`Upstash returned ${response.status}`))
      return memoryRateLimit(request, scope, limit, windowMs)
    }

    const result = await response.json() as Array<{ result?: number; error?: string }>
    const count = Number(result[0]?.result)
    if (!Number.isFinite(count)) {
      logRedisFallback(new Error(result[0]?.error || 'Invalid Upstash response'))
      return memoryRateLimit(request, scope, limit, windowMs)
    }
    return count > limit ? rateLimitResponse(windowMs) : null
  } catch (error) {
    logRedisFallback(error)
    return memoryRateLimit(request, scope, limit, windowMs)
  }
}
