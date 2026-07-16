'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useLanguage } from '@/i18n/LanguageContext'

export function SearchBox({ initialQuery = '' }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery)
  const router = useRouter()
  const { t } = useLanguage()

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-xl gap-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t.search.placeholder}
        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand"
      />
      <button type="submit" className="btn-primary shrink-0">
        {t.search.button}
      </button>
    </form>
  )
}
