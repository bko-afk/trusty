import type { Metadata } from 'next'

type MediaValue = {
  url?: string | null
  sizes?: Record<string, { url?: string | null } | null> | null
}

const fallbackUrl = 'http://localhost:3000'

export function siteUrl() {
  const value = process.env.NEXT_PUBLIC_SERVER_URL || fallbackUrl
  try {
    return new URL(value)
  } catch {
    return new URL(fallbackUrl)
  }
}

export function absoluteUrl(path = '/') {
  return new URL(path, siteUrl()).toString()
}

export function mediaUrl(media: unknown): string | undefined {
  if (!media || typeof media !== 'object') return undefined
  const value = media as MediaValue
  return value.url || Object.values(value.sizes || {}).find((size) => size?.url)?.url || undefined
}

export function plainDescription(value: unknown, fallback: string, maxLength = 170) {
  const normalized = (typeof value === 'string' ? value : fallback).replace(/\s+/g, ' ').trim()
  if (normalized.length <= maxLength) return normalized
  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`
}

export const noIndexMetadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
}
