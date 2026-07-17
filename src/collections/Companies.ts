import type { CollectionConfig } from 'payload'
import { countries } from '../lib/countries'
import { isStaff, isTrustedWrite } from '../lib/access'

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9а-яё\s-]/gi, '')
    .trim()
    .replace(/\s+/g, '-')
}

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
      if (isStaff(req)) return true
      return { status: { equals: 'published' } }
    },
    create: () => true,
    update: ({ req }) => isStaff(req),
    delete: ({ req }) => isStaff(req),
  },
  hooks: {
    beforeChange: [
      async ({ data, req, originalDoc, operation }) => {
        if (operation === 'create' && !isTrustedWrite(req)) {
          const baseSlug = slugify(String(data.name || 'company')) || 'company'
          const existing = await req.payload.find({
            collection: 'companies',
            where: { slug: { equals: baseSlug } },
            limit: 1,
            depth: 0,
            req,
            overrideAccess: true,
          })
          data.slug = existing.totalDocs > 0 ? `${baseSlug}-${Date.now().toString(36)}` : baseSlug
          data.status = 'draft'
          data.verified = false
          data.popular = false
          data.overallRating = 0
          data.reviewCount = 0
          delete data.logo
          delete data.logoFile
          delete data.pros
          delete data.cons
          delete data.contacts
          delete data.seo
          delete data.foundedYear
          delete data.description
        }

        // Ограничение: максимум 3 компании с отметкой "популярная" —
        // они выводятся отдельным блоком на главной странице.
        if (data.popular) {
          const existing = await req.payload.find({
            collection: 'companies',
            where: { popular: { equals: true } },
            limit: 10,
            depth: 0,
            req,
          })
          const otherPopularCount = existing.docs.filter((doc) => doc.id !== originalDoc?.id).length
          if (otherPopularCount >= 3) {
            throw new Error(
              'Максимум 3 компании с отметкой «Популярная». Снимите отметку у одной из существующих, прежде чем добавить новую.',
            )
          }
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'name', label: 'Название', type: 'text', required: true, minLength: 2, maxLength: 120 },
    {
      name: 'slug',
      label: 'Адрес страницы (slug)',
      type: 'text',
      required: true,
      unique: true,
      maxLength: 140,
      admin: { description: 'Используется в адресе страницы, например: soglasie' },
    },
    {
      name: 'status',
      label: 'Статус',
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
      name: 'popular',
      type: 'checkbox',
      label: 'Популярная компания',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Показывается в блоке «Популярные компании» на главной. Максимум 3 компании одновременно.',
      },
    },
    {
      name: 'logo',
      label: 'Логотип компании',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Загрузите оригинальный PNG, WebP или SVG. Рекомендуется прозрачный фон и ширина от 400 px.',
      },
    },
    {
      name: 'logoFile',
      label: 'Старый файл логотипа',
      type: 'text',
      admin: {
        description:
          'Резервное поле для логотипов из public/images/companies/. Для новых компаний используйте загрузку выше.',
      },
    },
    {
      name: 'insuranceTypes',
      label: 'Виды страхования',
      type: 'relationship',
      relationTo: 'insurance-types',
      hasMany: true,
    },
    { name: 'website', label: 'Официальный сайт', type: 'text', maxLength: 300 },
    { name: 'foundedYear', label: 'Год основания', type: 'number', min: 1800, max: 2100 },
    {
      name: 'country',
      label: 'Страна',
      type: 'select',
      options: countries.map((c) => ({ label: `${c.ru} (${c.code})`, value: c.code })),
    },
    { name: 'city', label: 'Город', type: 'text', maxLength: 120 },
    { name: 'shortDescription', label: 'Краткое описание', type: 'textarea', maxLength: 800 },
    { name: 'description', label: 'Полное описание', type: 'richText' },
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
      label: 'Контакты',
      type: 'group',
      fields: [
        { name: 'phone', type: 'text' },
        { name: 'email', type: 'text' },
        { name: 'address', type: 'text' },
      ],
    },
    {
      name: 'overallRating',
      label: 'Общий рейтинг',
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
      label: 'Количество отзывов',
      type: 'number',
      admin: { readOnly: true, position: 'sidebar' },
      defaultValue: 0,
    },
    {
      name: 'seo',
      label: 'SEO',
      type: 'group',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'ogImage', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
