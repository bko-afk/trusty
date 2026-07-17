import { getPayloadClient } from '@/lib/getPayloadClient'
import { AddCompanyForm } from './AddCompanyForm'

export const revalidate = 120

export default async function AddCompanyPage() {
  const payload = await getPayloadClient()
  const insuranceTypes = await payload.find({ collection: 'insurance-types', sort: 'order' })

  return (
    <AddCompanyForm
      insuranceTypes={insuranceTypes.docs.map((t: any) => ({ id: t.id, slug: t.slug, title: t.title }))}
    />
  )
}
