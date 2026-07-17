import type { CollectionConfig } from 'payload'

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
      if (req.user) return true
      return { status: { equals: 'published' } }
    },
    // Анонимная отправка через форму «Оставить жалобу» — попадёт со статусом pending
    create: () => true,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        // Если жалобу отправляет залогиненный посетитель (коллекция
        // `customers`) — привязываем её к аккаунту и подставляем
        // имя/email по умолчанию, если не заданы.
        const user = req.user as any
        if (operation === 'create' && user?.collection === 'customers') {
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
    { name: 'authorName', type: 'text', required: true },
    {
      name: 'authorEmail',
      type: 'email',
      admin: { description: 'Не показывается публично, только для модерации и ответа' },
    },
    { name: 'title', type: 'text', label: 'Тема жалобы', required: true },
    { name: 'body', type: 'textarea', label: 'Описание проблемы', required: true },
    {
      name: 'status',
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
