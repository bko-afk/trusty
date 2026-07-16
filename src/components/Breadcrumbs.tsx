'use client'

import Link from 'next/link'
import { useLanguage } from '@/i18n/LanguageContext'

type Crumb = { label: string; href?: string }

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const { t } = useLanguage()

  return (
    <nav className="text-sm text-gray-500 mb-4" aria-label={t.common.breadcrumbsAria}>
      {items.map((item, i) => (
        <span key={i}>
          {item.href ? (
            <Link href={item.href} className="hover:text-brand">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-700">{item.label}</span>
          )}
          {i < items.length - 1 && <span className="mx-1.5">/</span>}
        </span>
      ))}
    </nav>
  )
}
