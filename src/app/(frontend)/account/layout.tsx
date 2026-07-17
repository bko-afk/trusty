import type { Metadata } from 'next'
import { noIndexMetadata } from '@/lib/seo'

export const metadata: Metadata = {
  ...noIndexMetadata,
  title: 'Личный кабинет',
  alternates: { canonical: '/account' },
}

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return children
}
