'use client'

import Link from 'next/link'
import { SearchBox } from './SearchBox'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useLanguage } from '@/i18n/LanguageContext'

export function Header() {
  const { t } = useLanguage()

  const navItems = [
    { label: t.nav.catalog, href: '/companies' },
    { label: t.nav.ratings, href: '/ratings' },
    { label: t.nav.articles, href: '/articles' },
  ]

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container-page flex items-center gap-6 py-3">
        <Link href="/" className="text-xl font-bold text-brand-dark shrink-0">
          {t.brand}
        </Link>

        <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-gray-600">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-brand">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block ml-auto">
          <SearchBox />
        </div>

        <LanguageSwitcher />

        <Link href="/add-review" className="btn-primary shrink-0">
          {t.nav.addReview}
        </Link>
      </div>

      <div className="lg:hidden border-t border-gray-100 px-4 py-2">
        <SearchBox />
      </div>
    </header>
  )
}
