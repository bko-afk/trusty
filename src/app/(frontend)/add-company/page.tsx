import { getPayloadClient } from '@/lib/getPayloadClient'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { AddCompanyForm } from './AddCompanyForm'

export const dynamic = 'force-dynamic'

export default async function AddCompanyPage() {
  const payload = await getPayloadClient()
  const insuranceTypes = await payload.find({ collection: 'insurance-types', sort: 'order' })

  return (
    <div className="container-page py-8 max-w-2xl">
      <Breadcrumbs items={[{ label: 'Главная', href: '/' }, { label: 'Добавить компанию' }]} />
      <h1 className="text-2xl font-bold mb-2">Добавить страховую компанию</h1>
      <p className="text-gray-500 mb-6">
        Заявка попадёт на модерацию. После проверки администратор опубликует карточку компании.
      </p>
      <AddCompanyForm
        insuranceTypes={insuranceTypes.docs.map((t: any) => ({ id: t.id, title: t.title }))}
      />
    </div>
  )
}
