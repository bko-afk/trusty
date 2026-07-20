'use client'

import Link from 'next/link'
import Image from 'next/image'
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
  const { customer } = useCustomer()

  const navItems = [
    { label: t.common.home, href: '/' },
    { label: t.nav.catalog, href: '/companies' },
    { label: t.nav.articles, href: '/articles' },
  ]

  return (
    <header className="relative z-40 border-b border-gray-200 bg-white text-brand-dark">
      <div className="container-page flex h-[76px] items-center gap-3 md:gap-6">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5" aria-label={t.brand}>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl shadow-[0_6px_16px_rgba(109,40,217,0.18)] transition-transform group-hover:-translate-y-0.5">
            <Image src="/icon.svg" alt="" width={40} height={40} className="h-full w-full" />
          </span>
          <span className="text-base font-black tracking-[0.035em] sm:text-xl">
            <span className="text-brand-dark">TRUST</span><span className="text-brand">Y</span>
          </span>
        </Link>

        <NavMenu items={navItems} />

        <div className="ml-auto hidden min-w-0 max-w-xl flex-1 items-center gap-2 lg:flex">
          <SearchBox popularCompanies={popularCompanies} />
          <Link href="/add-review" className="whitespace-nowrap border-b border-dotted border-brand px-2 py-2 text-sm font-bold text-brand shrink-0">
            {t.nav.addReview}
          </Link>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-0">
          <div className="hidden sm:block"><LanguageSwitcher /></div>

          <Link
            href={customer ? '/account' : '/login'}
            className="inline-flex min-w-[76px] shrink-0 items-center justify-center bg-brand px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#5720b5] sm:min-w-[92px] sm:px-5"
            aria-label={customer ? t.auth.myAccount : t.auth.login}
          >
            {customer ? initials(customer.name, customer.email) : t.auth.login}
          </Link>
        </div>
      </div>
    </header>
  )
}
