import type { Metadata } from 'next'
import { LoginForm } from './LoginForm'
import { noIndexMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  ...noIndexMetadata,
  title: 'Вход',
  alternates: { canonical: '/login' },
}

export default function LoginPage() {
  return <LoginForm />
}
