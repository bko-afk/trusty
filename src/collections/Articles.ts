import type { CollectionConfig } from 'payload'

export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: {
    singular: 'Статья',
    plural: 'Статьи и обзоры',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'publishedAt'],
  },
  access: {
    read: ({ req }) => {
      if (req.user) return true
      return { status: { equals: 'published' } }
    },
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'cover', type: 'upload', relationTo: 'media' },
    { name: 'excerpt', type: 'textarea' },
    { name: 'body', type: 'richText' },
    {
      name: 'relatedInsuranceTypes',
      label: 'Связанные виды страхования',
      type: 'relationship',
      relationTo: 'insurance-types',
      hasMany: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Черновик', value: 'draft' },
        { label: 'Опубликовано', value: 'published' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'publishedAt', type: 'date', admin: { position: 'sidebar' } },
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
