import Link from 'next/link'
import { SearchBox } from './SearchBox'

type NavItem = { label: string; href: string }

const navItems: NavItem[] = [
  { label: 'Каталог компаний', href: '/companies' },
  { label: 'Рейтинги', href: '/ratings' },
  { label: 'Статьи и обзоры', href: '/articles' },
]

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container-page flex items-center gap-6 py-3">
        <Link href="/" className="text-xl font-bold text-brand-dark shrink-0">
          Страхование.Отзывы
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

        <Link href="/add-review" className="btn-primary ml-auto lg:ml-4 shrink-0">
          Добавить отзыв
        </Link>
      </div>

      <div className="lg:hidden border-t border-gray-100 px-4 py-2">
        <SearchBox />
      </div>
    </header>
  )
}
