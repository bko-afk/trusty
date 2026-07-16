import Link from 'next/link'

type Crumb = { label: string; href?: string }

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="text-sm text-gray-500 mb-4" aria-label="Хлебные крошки">
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
