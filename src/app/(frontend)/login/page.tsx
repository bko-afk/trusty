import { LoginForm } from './LoginForm'
import { localizedPageMetadata } from '@/i18n/seo'

export const dynamic = 'force-dynamic'

export const generateMetadata = () => localizedPageMetadata('login', '/login', { noIndex: true })

export default function LoginPage() {
  return <LoginForm />
}
