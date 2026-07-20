import { type CollectionConfig } from 'payload'
import { isStaff } from '@/lib/access'

export const InsuranceTypes: CollectionConfig = {
  slug: 'insurance-types',
  labels: {
    singular: 'Вид страхования',
    plural: 'Виды страхования',
  },
  admin: {
    group: 'Каталог и рейтинги',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'order'],
  },
  access: {
    read: () => true,
    create: ({ req }) => isStaff(req),
    update: ({ req }) => isStaff(req),
    delete: ({ req }) => isStaff(req),
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'Используется в адресе страницы, например: osago' },
    },
    { name: 'shortDescription', type: 'textarea', localized: true },
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
        { name: 'title', type: 'text', localized: true },
        { name: 'description', type: 'textarea', localized: true },
      ],
    },
  ],
}
