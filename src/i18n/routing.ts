import { DEFAULT_LOCALE, isLocale, type Locale } from './dictionary'

const EXTERNAL_URL = /^[a-z][a-z\d+.-]*:/i

export function splitLocalePath(pathname: string): { locale: Locale; pathname: string } {
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`
  const [, segment = ''] = normalized.split('/')

  if (!isLocale(segment)) return { locale: DEFAULT_LOCALE, pathname: normalized }

  const pathnameWithoutLocale = normalized.slice(segment.length + 1) || '/'
  return {
    locale: segment,
    pathname: pathnameWithoutLocale.startsWith('/') ? pathnameWithoutLocale : `/${pathnameWithoutLocale}`,
  }
}

export function localizePath(path: string, locale: Locale): string {
  if (!path || path.startsWith('#') || path.startsWith('//') || EXTERNAL_URL.test(path)) return path

  const url = new URL(path, 'https://trusty.local')
  const { pathname } = splitLocalePath(url.pathname)
  const localizedPathname =
    locale === DEFAULT_LOCALE ? pathname : pathname === '/' ? `/${locale}` : `/${locale}${pathname}`

  return `${localizedPathname}${url.search}${url.hash}`
}

export function isPublicLocalizablePath(pathname: string): boolean {
  return ![
    '/admin',
    '/api',
    '/_next',
    '/sitemap.xml',
    '/robots.txt',
    '/icon.svg',
    '/apple-icon.png',
    '/favicon.ico',
  ].some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
}

