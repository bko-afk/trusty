'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useLanguage } from '@/i18n/LanguageContext'
import { locales, localeFlags, localeNames, localeLabels } from '@/i18n/dictionary'
import { localizePath } from '@/i18n/routing'

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage()
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-sm font-medium hover:border-brand"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="text-base leading-none">{localeFlags[locale]}</span>
        <span>{localeLabels[locale]}</span>
        <span className="text-gray-400 text-xs">▾</span>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-20 mt-2 w-40 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg"
        >
          {locales.map((l) => (
            <li key={l}>
              <button
                type="button"
                role="option"
                aria-selected={l === locale}
                onClick={() => {
                  setLocale(l)
                  setOpen(false)
                  const suffix = `${window.location.search}${window.location.hash}`
                  router.replace(`${localizePath(pathname, l)}${suffix}`)
                }}
                className={`flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-brand-light/50 ${
                  l === locale ? 'font-semibold text-brand-dark' : 'text-gray-700'
                }`}
              >
                <span className="text-base leading-none">{localeFlags[l]}</span>
                <span>{localeNames[l]}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
