import type { CollectionConfig, Where } from 'payload'
import { isCustomer, isStaff, isTrustedWrite } from '../lib/access'

export const Complaints: CollectionConfig = {
  slug: 'complaints',
  labels: {
    singular: 'Жалоба',
    plural: 'Жалобы',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'company', 'status', 'resolved', 'createdAt'],
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
        // Если жалобу отправляет залогиненный посетитель (коллекция
        // `customers`) — привязываем её к аккаунту и подставляем
        // имя/email по умолчанию, если не заданы.
        const user = req.user as any
        if (operation === 'create' && !isTrustedWrite(req)) {
          data.status = 'pending'
          data.resolved = false
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
      admin: { description: 'Заполняется автоматически, если жалобу оставил залогиненный пользователь' },
    },
    { name: 'authorName', label: 'Имя автора', type: 'text', required: true, minLength: 2, maxLength: 80 },
    {
      name: 'authorEmail',
      label: 'Email автора',
      type: 'email',
      admin: { description: 'Не показывается публично, только для модерации и ответа' },
    },
    { name: 'title', type: 'text', label: 'Тема жалобы', required: true, minLength: 5, maxLength: 160 },
    { name: 'body', type: 'textarea', label: 'Описание проблемы', required: true, minLength: 30, maxLength: 5000 },
    {
      name: 'status',
      label: 'Статус модерации',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'На модерации', value: 'pending' },
        { label: 'Опубликована', value: 'published' },
        { label: 'Отклонена', value: 'rejected' },
        { label: 'Спам', value: 'spam' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'resolved',
      type: 'checkbox',
      label: 'Проблема решена',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Отмечается вручную после ответа компании и решения вопроса' },
    },
  ],
}
