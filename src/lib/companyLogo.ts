type CompanyLogoMedia = {
  url?: string | null
  sizes?: {
    thumbnail?: { url?: string | null } | null
    card?: { url?: string | null } | null
  } | null
}

export function companyLogoUrl(
  logo?: unknown,
  logoFile?: unknown,
): string | undefined {
  if (logo && typeof logo === 'object') {
    const media = logo as CompanyLogoMedia
    return media.sizes?.thumbnail?.url || media.sizes?.card?.url || media.url || undefined
  }
  return typeof logoFile === 'string' && logoFile ? `/images/companies/${logoFile}` : undefined
}
