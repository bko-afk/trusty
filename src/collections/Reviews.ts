import type { CollectionConfig } from 'payload'
import { recalculateCompanyRating } from '../lib/recalculateCompanyRating'

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
      if (req.user) return true
      return { status: { equals: 'published' } }
    },
    // Анонимная отправка через форму «Добавить отзыв» — попадёт со статусом pending
    create: () => true,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        // Если отзыв отправляет залогиненный посетитель (коллекция
        // `customers`, а не админ `users`) — привязываем отзыв к его
        // аккаунту и подставляем имя/email по умолчанию, если не заданы.
        const user = req.user as any
        if (operation === 'create' && user?.collection === 'customers') {
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
    { name: 'authorName', type: 'text', required: true },
    {
      name: 'authorEmail',
      type: 'email',
      admin: { description: 'Не показывается публично, только для модерации' },
    },
    { name: 'title', type: 'text', required: true },
    { name: 'body', type: 'textarea', required: true },
    {
      name: 'rating',
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
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'helpfulDown',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', readOnly: true },
    },
  ],
}
