import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { getPayloadClient } from './getPayloadClient'
import { DEFAULT_LOCALE, type Locale } from '@/i18n/dictionary'

const getCachedSiteSettings = unstable_cache(async (locale: Locale) => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-settings', depth: 2, locale, fallbackLocale: false })
}, ['site-settings'], { revalidate: 60 })

export const getSiteSettings = cache((locale: Locale = DEFAULT_LOCALE) => getCachedSiteSettings(locale))
