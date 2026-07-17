'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export type NavMenuItem = { label: string; href: string }

export function NavMenu({ items }: { items: NavMenuItem[] }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname?.startsWith(href))
  const active = items.find((item) => isActive(item.href)) || items[0]

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-2 py-1.5 text-sm font-bold text-current transition-opacity hover:opacity-70"
      >
        {active.label}
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 z-40 mt-1 w-56 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`block px-4 py-2 text-sm ${
                isActive(item.href) ? 'bg-brand-light/50 font-semibold text-brand-dark' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
