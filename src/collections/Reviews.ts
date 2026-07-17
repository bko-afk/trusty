import type { CollectionConfig, Where } from 'payload'
import { recalculateCompanyRating } from '../lib/recalculateCompanyRating'
import { isCustomer, isStaff, isTrustedWrite } from '../lib/access'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  labels: {
    singular: 'Отзыв',
    plural: 'Отзывы',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'company', 'rating', 'status', 'createdAt'],
  },
  access: {
    read: ({ req }) => {
      if (isStaff(req)) return true
      if (isCustomer(req) && req.user) {
        const ownOrPublished: Where = {
          or: [{ status: { equals: 'published' } }, { customer: { equals: req.user.id } }],
        }
        return ownOrPublished
      }
      return { status: { equals: 'published' } }
    },
    create: () => true,
    update: ({ req }) => isStaff(req),
    delete: ({ req }) => isStaff(req),
  },
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        // Если отзыв отправляет залогиненный посетитель (коллекция
        // `customers`, а не админ `users`) — привязываем отзыв к его
        // аккаунту и подставляем имя/email по умолчанию, если не заданы.
        const user = req.user as any
        if (operation === 'create' && !isTrustedWrite(req)) {
          data.status = 'pending'
          data.helpfulUp = 0
          data.helpfulDown = 0
          delete data.customer
        }
        if (operation === 'create' && isCustomer(req)) {
          data.customer = user.id
          if (!data.authorName) data.authorName = user.name || user.email
          if (!data.authorEmail) data.authorEmail = user.email
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, req }) => {
        await recalculateCompanyRating(req.payload, doc.company, req)
      },
    ],
    afterDelete: [
      async ({ doc, req }) => {
        await recalculateCompanyRating(req.payload, doc.company, req)
      },
    ],
  },
  fields: [
    {
      name: 'company',
      label: 'Компания',
      type: 'relationship',
      relationTo: 'companies',
      required: true,
    },
    {
      name: 'customer',
      label: 'Аккаунт пользователя',
      type: 'relationship',
      relationTo: 'customers',
      admin: { description: 'Заполняется автоматически, если отзыв оставил залогиненный пользователь' },
    },
    { name: 'authorName', label: 'Имя автора', type: 'text', required: true, minLength: 2, maxLength: 80 },
    {
      name: 'authorEmail',
      label: 'Email автора',
      type: 'email',
      admin: { description: 'Не показывается публично, только для модерации' },
    },
    { name: 'title', label: 'Заголовок', type: 'text', required: true, minLength: 5, maxLength: 160 },
    { name: 'body', label: 'Текст отзыва', type: 'textarea', required: true, minLength: 30, maxLength: 5000 },
    {
      name: 'rating',
      label: 'Общая оценка',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
    },
    {
      name: 'criteria',
      label: 'Оценки по критериям',
      type: 'group',
      fields: [
        { name: 'coverage', label: 'Полнота покрытия', type: 'number', min: 1, max: 5 },
        { name: 'price', label: 'Цена полиса', type: 'number', min: 1, max: 5 },
        { name: 'claimsService', label: 'Выплаты по страховым случаям', type: 'number', min: 1, max: 5 },
        { name: 'support', label: 'Поддержка и сервис', type: 'number', min: 1, max: 5 },
      ],
    },
    {
      name: 'pros',
      label: 'Плюсы',
      type: 'array',
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    {
      name: 'cons',
      label: 'Минусы',
      type: 'array',
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    { name: 'recommend', label: 'Рекомендует компанию', type: 'checkbox', defaultValue: true },
    {
      name: 'status',
      label: 'Статус модерации',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'На модерации', value: 'pending' },
        { label: 'Опубликован', value: 'published' },
        { label: 'Скрыт', value: 'hidden' },
        { label: 'Отклонён', value: 'rejected' },
        { label: 'Спам', value: 'spam' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'helpfulUp',
      label: 'Полезно',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'helpfulDown',
      label: 'Не полезно',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', readOnly: true },
    },
  ],
}
