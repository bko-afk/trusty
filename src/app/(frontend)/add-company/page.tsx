import { getPayloadClient } from '@/lib/getPayloadClient'
import { AddCompanyForm } from './AddCompanyForm'
import { getRequestLocale, localizedPageMetadata } from '@/i18n/seo'

export const revalidate = 120

export const generateMetadata = () => localizedPageMetadata('addCompany', '/add-company', { noIndex: true })

export default async function AddCompanyPage() {
  const locale = await getRequestLocale()
  const payload = await getPayloadClient()
  const insuranceTypes = await payload.find({ collection: 'insurance-types', sort: 'order', locale })

  return (
    <AddCompanyForm
      insuranceTypes={insuranceTypes.docs.map((t: any) => ({ id: t.id, slug: t.slug, title: t.title }))}
    />
  )
}
