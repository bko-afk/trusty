import Image from 'next/image'
import Link from 'next/link'
import { RatingStars } from './RatingStars'

type CompanyCardProps = {
  slug: string
  name: string
  logoUrl?: string
  rating: number
  reviewCount: number
  insuranceTypeLabel?: string
  verified?: boolean
}

export function CompanyCard({
  slug,
  name,
  logoUrl,
  rating,
  reviewCount,
  insuranceTypeLabel,
  verified,
}: CompanyCardProps) {
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
          <div className="font-semibold leading-tight">{name}</div>
          {insuranceTypeLabel && (
            <div className="text-xs text-gray-500">{insuranceTypeLabel}</div>
          )}
        </div>
        {verified && (
          <span className="ml-auto rounded-full bg-brand-light px-2 py-0.5 text-[11px] font-medium text-brand-dark">
            Подтверждено
          </span>
        )}
      </div>
      <div className="flex items-center justify-between text-sm">
        <RatingStars value={rating} size="sm" />
        <span className="text-gray-500">Отзывы: {reviewCount}</span>
      </div>
    </Link>
  )
}
