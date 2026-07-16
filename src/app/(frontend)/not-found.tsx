'use client'

import Link from 'next/link'
import { useLanguage } from '@/i18n/LanguageContext'

export default function NotFound() {
  const { t } = useLanguage()

  return (
    <div className="container-page py-24 flex flex-col items-center text-center gap-4">
      <div className="text-6xl font-bold text-brand">404</div>
      <h1 className="text-2xl font-bold">{t.notFound.title}</h1>
      <p className="text-gray-500 max-w-md">{t.notFound.text}</p>
      <Link href="/" className="btn-primary mt-2">
        {t.notFound.backHome}
      </Link>
    </div>
  )
}
