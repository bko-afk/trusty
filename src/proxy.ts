import { NextRequest, NextResponse } from 'next/server'
import { DEFAULT_LOCALE, isLocale } from '@/i18n/dictionary'
import { isPublicLocalizablePath, splitLocalePath } from '@/i18n/routing'

const LOCALE_HEADER = 'x-trusty-locale'
const PATHNAME_HEADER = 'x-trusty-pathname'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const [, firstSegment = ''] = pathname.split('/')
  const hasLocalePrefix = isLocale(firstSegment)
  const { locale, pathname: pathnameWithoutLocale } = splitLocalePath(pathname)

  if (hasLocalePrefix && !isPublicLocalizablePath(pathnameWithoutLocale)) {
    return NextResponse.redirect(new URL(pathnameWithoutLocale, request.url))
  }

  // English keeps the existing canonical URL, so /en/... must not create duplicates.
  if (hasLocalePrefix && locale === DEFAULT_LOCALE) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = pathnameWithoutLocale
    return NextResponse.redirect(redirectUrl, 308)
  }

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set(LOCALE_HEADER, hasLocalePrefix ? locale : DEFAULT_LOCALE)
  requestHeaders.set(PATHNAME_HEADER, pathnameWithoutLocale)

  if (hasLocalePrefix) {
    const rewriteUrl = request.nextUrl.clone()
    rewriteUrl.pathname = pathnameWithoutLocale
    return NextResponse.rewrite(rewriteUrl, { request: { headers: requestHeaders } })
  }

  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|media/|images/|placeholders/|.*\\.[a-zA-Z0-9]+$).*)'],
}

