'use client'

import Link from 'next/link'
import { useLanguage } from '@/i18n/LanguageContext'

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="mt-16 bg-[#071b45] text-white">
      <div className="container-page grid gap-10 py-14 text-sm sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="max-w-sm">
          <div className="text-xl font-extrabold tracking-[0.04em]">{t.brand.toUpperCase()}</div>
          <p className="mt-4 leading-6 text-white/65">{t.footer.tagline}</p>
        </div>
        <div>
          <div className="mb-4 font-bold">Страхование</div>
          <ul className="space-y-3 text-white/65">
            <li>
              <Link href="/companies" className="hover:text-white">
                Рейтинг компаний
              </Link>
            </li>
            <li>
              <Link href="/companies?type=travel" className="hover:text-white">
                Туристическая страховка
              </Link>
            </li>
            <li>
              <Link href="/companies?type=medical" className="hover:text-white">
                Медицинская страховка
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="mb-4 font-bold">{t.footer.community}</div>
          <ul className="space-y-3 text-white/65">
            <li>
              <Link href="/add-review" className="hover:text-white">
                {t.footer.writeReview}
              </Link>
            </li>
            <li>
              <Link href="/companies" className="hover:text-white">
                Найти страховщика
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="mb-4 font-bold">Компаниям</div>
          <ul className="space-y-3 text-white/65">
            <li>
              <Link href="/add-company" className="hover:text-white">
                Добавить компанию
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-white">
                Войти в профиль
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/45">
        © {new Date().getFullYear()} {t.brand}. Независимый каталог отзывов о страховании.
      </div>
    </footer>
  )
}
