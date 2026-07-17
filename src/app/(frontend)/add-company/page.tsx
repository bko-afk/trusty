import type { Metadata } from 'next'
import { getPayloadClient } from '@/lib/getPayloadClient'
import { AddCompanyForm } from './AddCompanyForm'
import { noIndexMetadata } from '@/lib/seo'

export const revalidate = 120

export const metadata: Metadata = {
  ...noIndexMetadata,
  title: 'Добавить страховую компанию',
  description: 'Предложите страховую компанию для проверки и добавления в каталог Trusty.',
  alternates: { canonical: '/add-company' },
}

export default async function AddCompanyPage() {
  const payload = await getPayloadClient()
  const insuranceTypes = await payload.find({ collection: 'insurance-types', sort: 'order' })

  return (
    <AddCompanyForm
      insuranceTypes={insuranceTypes.docs.map((t: any) => ({ id: t.id, slug: t.slug, title: t.title }))}
    />
  )
}
