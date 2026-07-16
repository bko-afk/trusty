'use client'

import Link from 'next/link'
import { SearchBox } from './SearchBox'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useLanguage } from '@/i18n/LanguageContext'
import { useCustomer } from '@/lib/useCustomer'

function initials(name?: string, email?: string) {
  const source = (name || email || '?').trim()
  return source.slice(0, 1).toUpperCase()
}

export function Header() {
  const { t } = useLanguage()
  const { customer, loading } = useCustomer()

  const navItems = [
    { label: t.nav.catalog, href: '/companies' },
    { label: t.nav.ratings, href: '/ratings' },
    { label: t.nav.articles, href: '/articles' },
  ]

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container-page flex flex-wrap items-center gap-3 md:gap-6 py-3">
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

        <div className="hidden lg:block ml-auto min-w-0 flex-1 max-w-xl">
          <SearchBox />
        </div>

        <div className="ml-auto lg:ml-0 flex items-center gap-3 shrink-0">
          <LanguageSwitcher />

          {!loading && (
            <Link
              href={customer ? '/account' : '/login'}
              className="shrink-0"
              aria-label={customer ? t.auth.myAccount : t.auth.login}
            >
              {customer ? (
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-white text-sm font-semibold">
                  {initials(customer.name, customer.email)}
                </span>
              ) : (
                <span className="text-sm font-medium text-gray-600 hover:text-brand">{t.auth.login}</span>
              )}
            </Link>
          )}
        </div>
      </div>

      <div className="lg:hidden border-t border-gray-100 px-4 py-2">
        <SearchBox />
      </div>
    </header>
  )
}
