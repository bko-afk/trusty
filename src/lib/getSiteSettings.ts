import { cache } from 'react'
import { getPayloadClient } from './getPayloadClient'

export const getSiteSettings = cache(async () => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-settings', depth: 2 })
})
