import type { CollectionConfig } from 'payload'

export const Companies: CollectionConfig = {
  slug: 'companies',
  labels: {
    singular: 'Компания',
    plural: 'Компании',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'status', 'verified', 'overallRating', 'updatedAt'],
  },
  access: {
    // Публично видны только опубликованные компании
    read: ({ req }) => {
      if (req.user) return true
      return { status: { equals: 'published' } }
    },
    // Разрешаем анонимную заявку через форму «Добавить компанию» — попадёт со статусом draft
    create: () => true,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'Используется в адресе страницы, например: soglasie' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Черновик (не видно на сайте)', value: 'draft' },
        { label: 'Опубликовано', value: 'published' },
        { label: 'Скрыто', value: 'hidden' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'verified',
      type: 'checkbox',
      label: 'Подтверждённая компания',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'insuranceTypes',
      label: 'Виды страхования',
      type: 'relationship',
      relationTo: 'insurance-types',
      hasMany: true,
      required: true,
    },
    { name: 'website', type: 'text' },
    { name: 'foundedYear', type: 'number' },
    { name: 'city', type: 'text' },
    { name: 'shortDescription', type: 'textarea' },
    { name: 'description', type: 'richText' },
    {
      name: 'pros',
      label: 'Преимущества',
      type: 'array',
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    {
      name: 'cons',
      label: 'Недостатки',
      type: 'array',
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    {
      name: 'contacts',
      type: 'group',
      fields: [
        { name: 'phone', type: 'text' },
        { name: 'email', type: 'text' },
        { name: 'address', type: 'text' },
      ],
    },
    {
      name: 'overallRating',
      type: 'number',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Считается автоматически по отзывам',
      },
      defaultValue: 0,
    },
    {
      name: 'reviewCount',
      type: 'number',
      admin: { readOnly: true, position: 'sidebar' },
      defaultValue: 0,
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'ogImage', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
