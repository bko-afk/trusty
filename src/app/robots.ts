import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/',
        '/account',
        '/login',
        '/register',
        '/search',
        '/add-review',
        '/add-complaint',
        '/add-company',
        '/ru/account',
        '/ru/login',
        '/ru/register',
        '/ru/search',
        '/ru/add-review',
        '/ru/add-complaint',
        '/ru/add-company',
        '/es/account',
        '/es/login',
        '/es/register',
        '/es/search',
        '/es/add-review',
        '/es/add-complaint',
        '/es/add-company',
      ],
    },
    sitemap: absoluteUrl('/sitemap.xml'),
    host: absoluteUrl('/'),
  }
}
