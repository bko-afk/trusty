'use client'

import Link from './LocalizedLink'
import { useLanguage } from '@/i18n/LanguageContext'

type Crumb = { label: string; href?: string }

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const { t } = useLanguage()
  const visibleItems = items.length > 3 ? [items[0], ...items.slice(-2)] : items

  return (
    <nav className="mb-5 min-w-0" aria-label={t.common.breadcrumbsAria}>
      <ol className="flex min-w-0 items-center overflow-hidden text-sm text-gray-500">
        {visibleItems.map((item, index) => {
          const isFirst = index === 0
          const isLast = index === visibleItems.length - 1
          const isIntermediate = !isFirst && !isLast

          return (
            <li
              key={`${item.href ?? 'current'}-${item.label}`}
              className={`min-w-0 items-center ${isIntermediate ? 'hidden sm:flex' : 'flex'} ${isLast ? 'flex-1' : 'shrink-0'}`}
            >
              {!isFirst && (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  className="mx-2 h-3.5 w-3.5 shrink-0 text-gray-300"
                  fill="none"
                >
                  <path d="m6 3.5 4.5 4.5L6 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {item.href ? (
                <Link
                  href={item.href}
                  title={item.label}
                  className="block max-w-[30vw] truncate transition-colors hover:text-brand focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:max-w-[19rem]"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current="page"
                  title={item.label}
                  className="block min-w-0 truncate font-semibold text-brand-dark"
                >
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
