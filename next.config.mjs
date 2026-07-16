import { withPayload } from '@payloadcms/next/withPayload'

// Домен деплоя на Vercel меняется при каждой сборке, поэтому нельзя
// один раз прописать его вручную в Environment Variables — рано или
// поздно он "протухнет". Vercel сам прокидывает системные переменные
// с актуальным доменом на этапе сборки:
// - VERCEL_PROJECT_PRODUCTION_URL — стабильный домен продакшена,
//   не меняется между деплоями (доступен и в preview, и в production).
// - VERCEL_URL — домен конкретного текущего деплоя (запасной вариант).
// Если ни то, ни другое не задано (например, локальная разработка),
// используем localhost. Ручное значение NEXT_PUBLIC_SERVER_URL в
// настройках проекта (если вдруг осталось) по-прежнему в приоритете.
const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL
const computedServerURL =
  process.env.NEXT_PUBLIC_SERVER_URL || (vercelUrl ? `https://${vercelUrl}` : 'http://localhost:3000')

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_SERVER_URL: computedServerURL,
  },
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: '**' },
    ],
  },
}

export default withPayload(nextConfig)
