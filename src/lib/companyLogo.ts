type CompanyLogoMedia = {
  url?: string | null
  sizes?: {
    thumbnail?: { url?: string | null } | null
    card?: { url?: string | null } | null
  } | null
}

export function companyLogoUrl(
  logo?: string | number | CompanyLogoMedia | null,
  logoFile?: string | null,
): string | undefined {
  if (logo && typeof logo === 'object') {
    return logo.sizes?.thumbnail?.url || logo.sizes?.card?.url || logo.url || undefined
  }
  return logoFile ? `/images/companies/${logoFile}` : undefined
}
