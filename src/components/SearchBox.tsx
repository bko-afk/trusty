'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/i18n/LanguageContext'
import { companyLogoUrl } from '@/lib/companyLogo'

type Result = { id: string; slug: string; name: string; logoUrl?: string; overallRating?: number }

export function SearchBox({
  initialQuery = '',
  size = 'default',
}: {
  initialQuery?: string
  size?: 'default' | 'large'
}) {
  const isLarge = size === 'large'
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<Result[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([])
      setOpen(false)
      return
    }
    // AbortController отменяет предыдущий незавершённый запрос, если
    // пользователь успел напечатать следующий символ — без этого при
    // быстром вводе накапливались параллельные запросы, и результаты
    // могли прилетать не по порядку, из-за чего поиск казался медленным.
    const controller = new AbortController()
    setLoading(true)
    const timer = setTimeout(async () => {
      try {
        const params = new URLSearchParams()
        params.set('where[and][0][status][equals]', 'published')
        params.set('where[and][1][name][like]', query.trim())
        params.set('limit', '6')
        params.set('depth', '0')
        const res = await fetch(`/api/companies?${params.toString()}`, { signal: controller.signal })
        if (res.ok) {
          const data = await res.json()
          setResults(
            (data.docs || []).map((c: any) => ({
              id: c.id,
              slug: c.slug,
              name: c.name,
              logoUrl: companyLogoUrl(c.logoFile),
              overallRating: c.overallRating,
            })),
          )
          setOpen(true)
        }
      } catch (err) {
        if ((err as any)?.name !== 'AbortError') {
          // сетевая ошибка — просто оставляем предыдущие результаты
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }, 250)
    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [query])

  function goToFullSearch() {
    setOpen(false)
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  const clearBtn = (
    <button
      type="button"
      onClick={() => {
        setQuery('')
        setResults([])
        setOpen(false)
      }}
      aria-label={t.search.clear}
      className={
        isLarge
          ? 'absolute right-16 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600'
          : 'absolute right-2.5 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600'
      }
    >
      ×
    </button>
  )

  const dropdown = open && (
    <div className="absolute left-0 right-0 z-30 mt-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
      {loading && <div className="px-4 py-3 text-sm text-gray-400">{t.common.loading}</div>}
      {!loading && results.length === 0 && (
        <div className="px-4 py-3 text-sm text-gray-500">
          {t.search.noResults} «{query}»
        </div>
      )}
      {!loading &&
        results.map((r) => (
          <Link
            key={r.id}
            href={`/companies/${r.slug}`}
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-brand-light/40 border-b border-gray-50 last:border-0"
          >
            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-md border border-gray-100 bg-gray-50">
              <Image
                src={r.logoUrl || '/placeholders/logo-placeholder.svg'}
                alt={r.name}
                fill
                className="object-contain p-0.5"
              />
            </div>
            <span className="truncate">{r.name}</span>
          </Link>
        ))}
      {!loading && results.length > 0 && (
        <button
          type="button"
          onClick={goToFullSearch}
          className="w-full px-4 py-2 text-left text-xs text-brand hover:underline border-t border-gray-100"
        >
          {t.search.pageTitle} →
        </button>
      )}
    </div>
  )

  if (isLarge) {
    return (
      <div ref={wrapperRef} className="relative w-full max-w-2xl">
        <div className="relative flex h-16 items-stretch">
          <div className="flex flex-1 items-center rounded-l-full bg-brand pl-2 pr-7">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') goToFullSearch()
              }}
              onFocus={() => {
                if (results.length > 0) setOpen(true)
              }}
              placeholder={t.search.placeholder}
              className="h-12 w-full rounded-full bg-white pl-5 pr-4 text-base focus:outline-none"
            />
          </div>
          {/* Треугольный "хвостик" справа от фиолетовой плашки */}
          <div className="h-0 w-0 shrink-0 border-y-[32px] border-l-[26px] border-y-transparent border-l-brand" />
          {clearBtn}
          <button
            type="button"
            onClick={goToFullSearch}
            aria-label={t.search.button}
            className="absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-gray-900 text-white hover:bg-black"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="2" />
              <path d="M18 18l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        {dropdown}
      </div>
    )
  }

  return (
    <div ref={wrapperRef} className="relative w-full max-w-xl">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') goToFullSearch()
        }}
        onFocus={() => {
          if (results.length > 0) setOpen(true)
        }}
        placeholder={t.search.placeholder}
        className="w-full rounded-lg border border-gray-300 px-4 py-2 pr-9 focus:outline-none focus:ring-2 focus:ring-brand"
      />

      {query.length > 0 && clearBtn}

      {dropdown}
    </div>
  )
}
