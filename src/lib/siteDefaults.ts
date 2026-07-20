export const DEFAULT_SITE_TITLE = 'Trusty - Travel Insurance Reviews and Ratings'

export const DEFAULT_SITE_DESCRIPTION =
  'Compare travel and medical insurance companies, customer ratings, verified reviews, complaints, and practical insurance guides.'

export const LEGACY_SITE_TITLE = 'Trusty — отзывы и рейтинги туристических страховых компаний'

export const LEGACY_SITE_DESCRIPTION =
  'Каталог туристических страховых компаний, рейтинги, реальные отзывы клиентов и статьи о страховании путешественников.'

export function primarySeoValue(value: unknown, legacyValue: string, fallback: string) {
  if (typeof value !== 'string') return fallback
  const normalized = value.trim()
  return !normalized || normalized === legacyValue ? fallback : normalized
}
