'use client'

import NextLink from 'next/link'
import type { ComponentProps } from 'react'
import { useLanguage } from '@/i18n/LanguageContext'
import { isPublicLocalizablePath, localizePath } from '@/i18n/routing'

type LocalizedLinkProps = ComponentProps<typeof NextLink>

export function LocalizedLink({ href, ...props }: LocalizedLinkProps) {
  const { locale } = useLanguage()
  const localizedHref =
    typeof href === 'string'
      ? isPublicLocalizablePath(href.split(/[?#]/, 1)[0] || '/')
        ? localizePath(href, locale)
        : href
      : href.pathname && isPublicLocalizablePath(href.pathname)
        ? { ...href, pathname: localizePath(href.pathname, locale) }
        : href

  return <NextLink href={localizedHref} {...props} />
}

export default LocalizedLink

