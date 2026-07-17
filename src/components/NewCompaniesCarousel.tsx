'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { RatingStars } from '@/components/RatingStars'
import { companyLogoUrl } from '@/lib/companyLogo'

type Company = {
  id: number | string
  slug: string
  name: string
  overallRating?: number | null
  reviewCount?: number | null
  logo?: Parameters<typeof companyLogoUrl>[0]
  logoFile?: string | null
}

type Props = {
  companies: Company[]
  labels: {
    previous: string
    next: string
    position: string
    rating: string
    reviews: string
    openCompany: string
  }
}

type CarouselState = {
  activeIndex: number
  visibleCount: number
  canGoBack: boolean
  canGoForward: boolean
}

const initialState: CarouselState = {
  activeIndex: 0,
  visibleCount: 1,
  canGoBack: false,
  canGoForward: true,
}

export function NewCompaniesCarousel({ companies, labels }: Props) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [carousel, setCarousel] = useState(initialState)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let animationFrame = 0

    const updateState = () => {
      const firstCard = track.querySelector<HTMLElement>('[data-carousel-card]')
      if (!firstCard) return

      const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 16
      const step = firstCard.offsetWidth + gap
      const activeIndex = Math.min(
        companies.length - 1,
        Math.max(0, Math.round(track.scrollLeft / step)),
      )
      const visibleCount = Math.max(1, Math.floor((track.clientWidth + gap) / step))
      const remainingScroll = track.scrollWidth - track.clientWidth - track.scrollLeft

      setCarousel({
        activeIndex,
        visibleCount,
        canGoBack: track.scrollLeft > 2,
        canGoForward: remainingScroll > 2,
      })
    }

    const scheduleUpdate = () => {
      window.cancelAnimationFrame(animationFrame)
      animationFrame = window.requestAnimationFrame(updateState)
    }

    updateState()
    track.addEventListener('scroll', scheduleUpdate, { passive: true })
    const resizeObserver = new ResizeObserver(scheduleUpdate)
    resizeObserver.observe(track)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      track.removeEventListener('scroll', scheduleUpdate)
      resizeObserver.disconnect()
    }
  }, [companies.length])

  const move = (direction: -1 | 1) => {
    const track = trackRef.current
    const firstCard = track?.querySelector<HTMLElement>('[data-carousel-card]')
    if (!track || !firstCard) return

    const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 16
    const step = firstCard.offsetWidth + gap
    const target = Math.min(
      track.scrollWidth - track.clientWidth,
      Math.max(0, track.scrollLeft + direction * step),
    )

    // Direct assignment is more reliable than scrollBy in Safari and embedded browsers.
    track.scrollLeft = target
  }

  const lastVisible = Math.min(companies.length, carousel.activeIndex + carousel.visibleCount)
  const progress = `${Math.max(12, (lastVisible / companies.length) * 100)}%`
  const positionText = labels.position
    .replace('{current}', String(carousel.activeIndex + 1))
    .replace('{total}', String(companies.length))

  return (
    <div className="relative overflow-hidden border border-[#dfe7eb] bg-[linear-gradient(135deg,#f7fafb_0%,#ffffff_52%,#f5f1fb_100%)] px-4 py-5 sm:px-6 sm:py-7">
      <div
        className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-[#579c9e]/10 blur-3xl"
        aria-hidden="true"
      />

      <div
        ref={trackRef}
        data-testid="new-companies-carousel"
        className="company-carousel-track relative"
        aria-label={positionText}
      >
        {companies.map((company) => (
          <Link
            key={company.id}
            href={`/companies/${company.slug}`}
            data-carousel-card
            className="group relative flex min-h-44 scroll-ml-1 snap-start flex-col border border-[#e1e7eb] bg-white p-5 shadow-[0_12px_30px_rgba(7,27,69,0.04)] transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-[#579c9e] hover:shadow-[0_18px_38px_rgba(7,27,69,0.10)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="relative h-14 w-28 shrink-0 overflow-hidden">
                <Image
                  src={companyLogoUrl(company.logo, company.logoFile) || '/placeholders/logo-placeholder.svg'}
                  alt={company.name}
                  fill
                  sizes="112px"
                  className="object-contain object-left"
                />
              </div>
              <span className="flex h-9 min-w-14 items-center justify-center rounded-full bg-[#f3f6f9] px-3 text-sm font-extrabold text-brand-dark">
                {Number(company.overallRating || 0).toFixed(1)}
              </span>
            </div>

            <h3 className="mt-5 line-clamp-2 text-lg font-extrabold leading-snug tracking-[-0.02em] text-brand-dark">
              {company.name}
            </h3>

            <div className="mt-auto flex items-end justify-between gap-3 pt-5">
              <div>
                <RatingStars value={company.overallRating || 0} size="sm" />
                <p className="mt-1.5 text-xs text-gray-400">
                  {labels.rating} · {company.reviewCount || 0} {labels.reviews}
                </p>
              </div>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#dfe7eb] text-[#579c9e] transition-colors group-hover:border-[#579c9e] group-hover:bg-[#579c9e] group-hover:text-white" aria-label={labels.openCompany}>
                <ArrowIcon />
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="relative mt-6 flex items-center gap-4">
        <div className="h-0.5 flex-1 overflow-hidden bg-[#dfe7eb]" aria-hidden="true">
          <div className="h-full bg-[#579c9e] transition-[width] duration-300" style={{ width: progress }} />
        </div>
        <span className="min-w-14 text-center text-xs font-bold tabular-nums text-gray-500" aria-live="polite">
          {String(carousel.activeIndex + 1).padStart(2, '0')} / {String(companies.length).padStart(2, '0')}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => move(-1)}
            disabled={!carousel.canGoBack}
            className="carousel-arrow"
            aria-label={labels.previous}
          >
            <ChevronIcon direction="left" />
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            disabled={!carousel.canGoForward}
            className="carousel-arrow"
            aria-label={labels.next}
          >
            <ChevronIcon direction="right" />
          </button>
        </div>
      </div>
    </div>
  )
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
      <path d="M5 10h10M11 6l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
      <path
        d={direction === 'left' ? 'm12 5-5 5 5 5' : 'm8 5 5 5-5 5'}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
