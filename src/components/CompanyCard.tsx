'use client'

import Image from 'next/image'
import Link from 'next/link'
import { RatingStars } from './RatingStars'
import { useLanguage } from '@/i18n/LanguageContext'
import { countryFlag, countryName } from '@/lib/countries'

type CompanyCardProps = {
  slug: string
  name: string
  logoUrl?: string
  rating: number
  reviewCount: number
  verified?: boolean
  country?: string
  insuranceTypeLabels?: string[]
}

export function CompanyCard({
  slug,
  name,
  logoUrl,
  rating,
  reviewCount,
  verified,
  country,
  insuranceTypeLabels,
}: CompanyCardProps) {
  const { t, locale } = useLanguage()

  return (
    <Link
      href={`/companies/${slug}`}
      className="card flex flex-col gap-3 p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-3">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
          <Image
            src={logoUrl || '/placeholders/logo-placeholder.svg'}
            alt={name}
            fill
            className="object-contain p-1"
          />
        </div>
        <div>
          <div className="font-semibold leading-tight flex items-center gap-1.5">
            {name}
            {country && <span title={countryName(country, locale)}>{countryFlag(country)}</span>}
          </div>
          {insuranceTypeLabels && insuranceTypeLabels.length > 0 && (
            <div className="text-xs text-gray-500">{insuranceTypeLabels.join(', ')}</div>
          )}
        </div>
        {verified && (
          <span className="ml-auto rounded-full bg-brand-light px-2 py-0.5 text-[11px] font-medium text-brand-dark">
            {t.company.verified}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between text-sm">
        <RatingStars value={rating} size="sm" />
        <span className="text-gray-500">
          {t.company.reviewsCount}: {reviewCount}
        </span>
      </div>
    </Link>
  )
}
