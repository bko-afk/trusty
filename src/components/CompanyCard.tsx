'use client'

import Image from 'next/image'
import Link from 'next/link'
import { RatingStars } from './RatingStars'
import { useLanguage } from '@/i18n/LanguageContext'

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
  insuranceTypeLabels,
}: CompanyCardProps) {
  const { t } = useLanguage()

  return (
    <Link
      href={`/companies/${slug}`}
      className="card flex flex-col gap-3 p-4 hover:shadow-md transition-shadow min-w-0"
    >
      <div className="flex items-start gap-3 min-w-0">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
          <Image
            src={logoUrl || '/placeholders/logo-placeholder.svg'}
            alt={name}
            fill
            className="object-contain p-1"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-semibold leading-tight break-words">{name}</div>
          {insuranceTypeLabels && insuranceTypeLabels.length > 0 && (
            <div className="text-xs text-gray-500">{insuranceTypeLabels.join(', ')}</div>
          )}
        </div>
        {verified && (
          <span className="shrink-0 whitespace-nowrap self-start rounded-full bg-brand-light px-2 py-0.5 text-[11px] font-medium text-brand-dark">
            {t.company.verifiedShort}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between text-sm gap-2">
        <div className="flex items-center gap-1.5">
          <RatingStars value={rating} size="sm" />
          <span className="text-gray-500 text-xs">{rating.toFixed(1)}</span>
        </div>
        <span className="text-gray-500 shrink-0">
          {t.company.reviewsCount}: {reviewCount}
        </span>
      </div>
    </Link>
  )
}
