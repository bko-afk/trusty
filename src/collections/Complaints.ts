import type { CollectionConfig, Where } from 'payload'
import { isCustomer, isStaff, isTrustedWrite } from '../lib/access'
import { recalculateCompanyComplaints } from '../lib/recalculateCompanyComplaints'

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
          data.workflowStatus = 'submitted'
          delete data.companyResponse
          delete data.customer
        }
        if (operation === 'create' && isCustomer(req)) {
          data.customer = user.id
          if (!data.authorName) data.authorName = user.name || user.email
          if (!data.authorEmail) data.authorEmail = user.email
        }
        if (data.workflowStatus === 'resolved') data.resolved = true
        if (data.workflowStatus === 'unresolved' || data.workflowStatus === 'submitted') data.resolved = false
        if (data.companyResponse?.body && data.workflowStatus === 'submitted') {
          data.workflowStatus = 'company_replied'
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, req }) => {
        await recalculateCompanyComplaints(req.payload, doc.company, req)
      },
    ],
    afterDelete: [
      async ({ doc, req }) => {
        await recalculateCompanyComplaints(req.payload, doc.company, req)
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
    {
      name: 'workflowStatus',
      label: 'Этап решения',
      type: 'select',
      required: true,
      defaultValue: 'submitted',
      options: [
        { label: 'Получена', value: 'submitted' },
        { label: 'Компания ответила', value: 'company_replied' },
        { label: 'Решена', value: 'resolved' },
        { label: 'Не решена', value: 'unresolved' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'companyResponse',
      label: 'Официальный ответ компании',
      type: 'group',
      fields: [
        { name: 'authorName', label: 'Имя представителя', type: 'text', maxLength: 120 },
        { name: 'body', label: 'Ответ', type: 'textarea', maxLength: 5000 },
        { name: 'respondedAt', label: 'Дата ответа', type: 'date' },
      ],
    },
  ],
}
