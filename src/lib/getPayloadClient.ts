import { getPayload } from 'payload'
import config from '../payload.config'

let cached: ReturnType<typeof getPayload> | null = null

/**
 * Общий хелпер для получения Payload Local API внутри
 * серверных компонентов и route handlers Next.js.
 */
export function getPayloadClient() {
  if (!cached) {
    cached = getPayload({ config })
  }
  return cached
}
