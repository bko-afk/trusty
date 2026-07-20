const localUrl = 'http://localhost:3000'
const configBuild = process.env.PAYLOAD_CONFIG_BUILD === '1'

function httpsUrl(host: string | undefined) {
  return host ? `https://${host}` : undefined
}

export function serverUrlString() {
  return (
    httpsUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ||
    httpsUrl(process.env.VERCEL_URL) ||
    process.env.NEXT_PUBLIC_SERVER_URL ||
    localUrl
  )
}

export function trustedOrigins() {
  const candidates = [
    serverUrlString(),
    process.env.NEXT_PUBLIC_SERVER_URL,
    httpsUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL),
    httpsUrl(process.env.VERCEL_URL),
    ...(process.env.ADDITIONAL_TRUSTED_ORIGINS || '').split(','),
  ]

  if (process.env.NODE_ENV !== 'production') candidates.push(localUrl)

  return Array.from(new Set(candidates.flatMap((value) => {
    if (!value?.trim()) return []
    try {
      return [new URL(value.trim()).origin]
    } catch {
      return []
    }
  })))
}

export function payloadSecret() {
  const secret = process.env.PAYLOAD_SECRET?.trim()
  if (!secret && configBuild) return 'build-time-placeholder-not-used-at-runtime'
  if (!secret) {
    throw new Error('PAYLOAD_SECRET is required')
  }
  if (process.env.NODE_ENV === 'production' && secret.length < 32) {
    throw new Error('PAYLOAD_SECRET must contain at least 32 characters in production')
  }
  return secret
}

export function databaseUri() {
  const uri = process.env.DATABASE_URI?.trim()
  if (!uri && configBuild) return 'postgresql://build:build@127.0.0.1:5432/build'
  if (!uri) throw new Error('DATABASE_URI is required')
  return uri
}
