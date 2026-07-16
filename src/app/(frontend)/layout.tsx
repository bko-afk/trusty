import type { Metadata } from 'next'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: 'Страхование.Отзывы — отзывы и рейтинги страховых компаний',
  description:
    'Каталог страховых компаний, рейтинги, реальные отзывы клиентов и статьи о страховании.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
