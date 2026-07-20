import { withPayload } from '@payloadcms/next/withPayload'

// Домен деплоя на Vercel меняется при каждой сборке, поэтому нельзя
// один раз прописать его вручную в Environment Variables — рано или
// поздно он "протухнет". Vercel сам прокидывает системные переменные
// с актуальным доменом на этапе сборки:
// - VERCEL_PROJECT_PRODUCTION_URL — стабильный домен продакшена,
//   не меняется между деплоями (доступен и в preview, и в production).
// - VERCEL_URL — домен конкретного текущего деплоя (запасной вариант).
// Если ни то, ни другое не задано (например, локальная разработка),
// используем ручное NEXT_PUBLIC_SERVER_URL или localhost. На Vercel
// системный production URL важнее старого ручного значения: так canonical
// не начнёт указывать на случайный preview-деплой.
const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL
const computedServerURL =
  (vercelUrl ? `https://${vercelUrl}` : process.env.NEXT_PUBLIC_SERVER_URL) || 'http://localhost:3000'

function remotePattern(value) {
  if (!value) return null
  try {
    const url = new URL(value)
    return {
      protocol: url.protocol.slice(0, -1),
      hostname: url.hostname,
      port: url.port,
      pathname: '/**',
    }
  } catch {
    return null
  }
}

const configuredImagePatterns = [computedServerURL, process.env.S3_ENDPOINT]
  .map(remotePattern)
  .filter(Boolean)

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https: wss:",
  "media-src 'self' blob: https:",
  "worker-src 'self' blob:",
].join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'Cross-Origin-Resource-Policy', value: 'same-site' },
  { key: 'X-DNS-Prefetch-Control', value: 'off' },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  env: {
    NEXT_PUBLIC_SERVER_URL: computedServerURL,
  },
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      ...configuredImagePatterns,
    ],
  },
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  },
  // Каталог и рейтинги — по сути одна и та же таблица компаний,
  // отсортированная по рейтингу, так что отдельная страница /ratings
  // больше не нужна: постоянный редирект на объединённую /companies.
  async redirects() {
    return [
      {
        source: '/ratings',
        destination: '/companies',
        permanent: true,
      },
      {
        source: '/ru/ratings',
        destination: '/ru/companies',
        permanent: true,
      },
      {
        source: '/es/ratings',
        destination: '/es/companies',
        permanent: true,
      },
    ]
  },
}

export default withPayload(nextConfig)
