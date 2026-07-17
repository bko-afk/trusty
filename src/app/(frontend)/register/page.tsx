import type { Metadata } from 'next'
import { RegisterForm } from './RegisterForm'
import { noIndexMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  ...noIndexMetadata,
  title: 'Регистрация',
  alternates: { canonical: '/register' },
}

export default function RegisterPage() {
  return <RegisterForm />
}
