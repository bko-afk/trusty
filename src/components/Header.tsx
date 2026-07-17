'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { SearchBox } from './SearchBox'
import { LanguageSwitcher } from './LanguageSwitcher'
import { NavMenu } from './NavMenu'
import { useLanguage } from '@/i18n/LanguageContext'
import { useCustomer } from '@/lib/useCustomer'

function initials(name?: string, email?: string) {
  const source = (name || email || '?').trim()
  return source.slice(0, 1).toUpperCase()
}

type PopularCompany = { id: string; slug: string; name: string; logoUrl?: string }

export function Header({ popularCompanies = [] }: { popularCompanies?: PopularCompany[] }) {
  const { t } = useLanguage()
  const { customer, loading } = useCustomer()
  const pathname = usePathname()
  const isHome = pathname === '/'

  const navItems = [
    { label: t.common.home, href: '/' },
    { label: t.nav.catalog, href: '/companies' },
  ]

  return (
    <header className={`relative z-40 border-b ${isHome ? 'border-white/15 bg-brand text-white md:border-gray-200 md:bg-white md:text-brand-dark' : 'border-gray-200 bg-white text-brand-dark'}`}>
      <div className="container-page flex h-[76px] items-center gap-3 md:gap-6">
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label={t.brand}>
          <Image src="/placeholders/logo-placeholder.svg" alt="" width={44} height={44} className="h-10 w-10 rounded-lg bg-white" />
          <span className="hidden text-xl font-extrabold tracking-[0.04em] sm:inline">{t.brand.toUpperCase()}</span>
        </Link>

        <NavMenu items={navItems} />

        <div className="ml-auto hidden min-w-0 max-w-xl flex-1 items-center gap-2 lg:flex">
          <SearchBox popularCompanies={popularCompanies} />
          <Link href="/add-review" className="whitespace-nowrap border-b border-dotted border-brand px-2 py-2 text-sm font-bold text-brand shrink-0">
            {t.nav.addReview}
          </Link>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-0">
          <div className={isHome ? 'hidden md:block' : 'hidden sm:block'}><LanguageSwitcher /></div>

          {!loading && (
            <Link
              href={customer ? '/account' : '/login'}
              className="shrink-0 bg-emerald-500 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-600"
              aria-label={customer ? t.auth.myAccount : t.auth.login}
            >
              {customer ? (
                initials(customer.name, customer.email)
              ) : (
                t.auth.login
              )}
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
