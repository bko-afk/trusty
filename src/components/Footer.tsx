import Link from 'next/link'

export function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-white">
      <div className="container-page grid gap-8 py-10 sm:grid-cols-2 md:grid-cols-4 text-sm">
        <div>
          <div className="font-semibold mb-3">Страхование.Отзывы</div>
          <p className="text-gray-500">
            Каталог страховых компаний, рейтинги и реальные отзывы клиентов.
          </p>
        </div>
        <div>
          <div className="font-semibold mb-3">Компаниям</div>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link href="/add-company" className="hover:text-brand">
                Добавить компанию
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3">Сообщество</div>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link href="/add-review" className="hover:text-brand">
                Написать отзыв
              </Link>
            </li>
            <li>
              <Link href="/articles" className="hover:text-brand">
                Статьи и обзоры
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3">Каталог</div>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link href="/companies" className="hover:text-brand">
                Все страховые компании
              </Link>
            </li>
            <li>
              <Link href="/ratings" className="hover:text-brand">
                Рейтинги
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-100 py-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Страхование.Отзывы. Тестовая версия.
      </div>
    </footer>
  )
}
