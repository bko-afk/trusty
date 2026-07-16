import type { CollectionConfig } from 'payload'

export const InsuranceTypes: CollectionConfig = {
  slug: 'insurance-types',
  labels: {
    singular: 'Вид страхования',
    plural: 'Виды страхования',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'order'],
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'Используется в адресе страницы, например: osago' },
    },
    { name: 'shortDescription', type: 'textarea' },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Порядок отображения в каталоге и меню' },
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
      ],
    },
  ],
}
