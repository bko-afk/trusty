import { RegisterForm } from './RegisterForm'
import { localizedPageMetadata } from '@/i18n/seo'

export const dynamic = 'force-dynamic'

export const generateMetadata = () => localizedPageMetadata('register', '/register', { noIndex: true })

export default function RegisterPage() {
  return <RegisterForm />
}
