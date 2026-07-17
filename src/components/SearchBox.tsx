'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/i18n/LanguageContext'

type Result = { id: string; slug: string; name: string; logoUrl?: string; overallRating?: number }
type PopularCompany = { id: string; slug: string; name: string; logoUrl?: string }

export function SearchBox({
  initialQuery = '',
  size = 'default',
  popularCompanies = [],
}: {
  initialQuery?: string
  size?: 'default' | 'large'
  popularCompanies?: PopularCompany[]
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
        const res = await fetch('/api/company-search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: query.trim() }),
          signal: controller.signal,
        })
        if (res.ok) {
          const data = await res.json()
          setResults(
            (data.companies || []).slice(0, 6).map((c: any) => ({
              id: c.id,
              slug: c.slug,
              name: c.name,
              logoUrl: c.logoUrl,
              overallRating: c.rating,
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
          ? 'absolute right-20 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600'
          : 'absolute right-2.5 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600'
      }
    >
      ×
    </button>
  )

  const showPopular = query.trim().length === 0 && popularCompanies.length > 0

  const dropdown = open && (
    <div className="absolute left-0 right-0 z-30 mt-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
      {showPopular ? (
        <>
          <div className="px-4 pt-2.5 pb-1 text-xs font-medium uppercase tracking-wide text-gray-400">
            {t.home.popularCompaniesLabel}
          </div>
          {popularCompanies.map((c) => (
            <Link
              key={c.id}
              href={`/companies/${c.slug}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-brand-light/40 border-b border-gray-50 last:border-0"
            >
              <div className="relative h-8 w-14 shrink-0 overflow-hidden rounded-md border border-gray-100 bg-gray-50">
                <Image
                  src={c.logoUrl || '/placeholders/logo-placeholder.svg'}
                  alt={c.name}
                  fill
                  className="object-contain p-1"
                />
              </div>
              <span className="truncate">{c.name}</span>
              <span className="ml-auto text-amber-500">★</span>
            </Link>
          ))}
        </>
      ) : (
        <>
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
                <div className="relative h-8 w-14 shrink-0 overflow-hidden rounded-md border border-gray-100 bg-gray-50">
                  <Image
                    src={r.logoUrl || '/placeholders/logo-placeholder.svg'}
                    alt={r.name}
                    fill
                    className="object-contain p-1"
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
        </>
      )}
    </div>
  )

  if (isLarge) {
    return (
      <div ref={wrapperRef} className="relative w-full">
        <div className="grid gap-2 bg-brand p-3 sm:grid-cols-[240px_1fr] sm:gap-0 sm:p-5">
          <div className="flex min-h-16 items-center bg-white px-6 text-left font-bold text-brand-dark sm:border-r sm:border-gray-200">
            {t.portal.insuranceCompanies}
          </div>
          <div className="relative min-h-16 bg-white">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') goToFullSearch()
              }}
              onFocus={() => {
                if (results.length > 0 || showPopular) setOpen(true)
              }}
              placeholder={t.search.placeholder}
              className="h-16 w-full bg-transparent pl-6 pr-24 text-base text-gray-900 focus:outline-none sm:text-lg"
            />
            {query.length > 0 && clearBtn}
            <button
              type="button"
              onClick={goToFullSearch}
              aria-label={t.search.button}
              className="absolute right-0 top-0 flex h-16 w-20 items-center justify-center bg-white text-sm font-extrabold text-brand-dark transition-colors hover:bg-gray-50 hover:text-brand"
            >
              {t.search.button}
            </button>
          </div>
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
        className="w-full border-0 border-b border-gray-300 bg-transparent px-2 py-2 pr-9 text-sm focus:border-brand focus:outline-none"
      />

      {query.length > 0 && clearBtn}

      {dropdown}
    </div>
  )
}
