'use client'

import Link from 'next/link'
import { useLanguage } from '@/i18n/LanguageContext'

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="mt-16 border-t border-gray-200 bg-white">
      <div className="container-page grid gap-8 py-10 sm:grid-cols-2 md:grid-cols-4 text-sm">
        <div>
          <div className="font-semibold mb-3">{t.brand}</div>
          <p className="text-gray-500">{t.footer.tagline}</p>
        </div>
        <div>
          <div className="font-semibold mb-3">{t.footer.forCompanies}</div>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link href="/add-company" className="hover:text-brand">
                {t.nav.addCompany}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3">{t.footer.community}</div>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link href="/add-review" className="hover:text-brand">
                {t.footer.writeReview}
              </Link>
            </li>
            <li>
              <Link href="/articles" className="hover:text-brand">
                {t.nav.articles}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3">{t.footer.catalog}</div>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link href="/companies" className="hover:text-brand">
                {t.nav.catalog}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-100 py-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} {t.brand}. {t.footer.testVersion}
      </div>
    </footer>
  )
}
