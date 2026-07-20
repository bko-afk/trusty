'use client'

import Image from 'next/image'
import Link from './LocalizedLink'
import { RatingStars } from './RatingStars'
import { RatingCircle } from './RatingCircle'
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
  rank?: number
}

export function CompanyCard({
  slug,
  name,
  logoUrl,
  rating,
  reviewCount,
  verified,
  insuranceTypeLabels,
  rank,
}: CompanyCardProps) {
  const { t } = useLanguage()

  return (
    <Link
      href={`/companies/${slug}`}
      className="card relative flex flex-col gap-3 p-4 hover:-translate-y-0.5 hover:shadow-md transition-all min-w-0"
    >
      {rank !== undefined && (
        <span className="absolute -top-2 -left-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-[11px] font-bold text-white shadow">
          {rank}
        </span>
      )}
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
          <div className="text-xs text-gray-500 mt-0.5">
            {t.company.reviewsCount}: {reviewCount}
          </div>
          {insuranceTypeLabels && insuranceTypeLabels.length > 0 && (
            <div className="flex flex-wrap gap-x-2 gap-y-1 mt-1.5">
              {insuranceTypeLabels.map((label) => (
                <span
                  key={label}
                  className="text-[11px] text-brand underline decoration-dotted underline-offset-2"
                >
                  {label}
                </span>
              ))}
            </div>
          )}
        </div>
        <RatingCircle value={rating} size="sm" />
      </div>
      <div className="flex items-center justify-between text-sm gap-2">
        <RatingStars value={rating} size="sm" />
        {verified && (
          <span className="shrink-0 whitespace-nowrap rounded-full bg-brand-light px-2 py-0.5 text-[11px] font-medium text-brand-dark">
            {t.company.verifiedShort}
          </span>
        )}
      </div>
    </Link>
  )
}
