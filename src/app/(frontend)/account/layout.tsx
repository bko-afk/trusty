import { localizedPageMetadata } from '@/i18n/seo'

export const generateMetadata = () => localizedPageMetadata('account', '/account', { noIndex: true })

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return children
}
