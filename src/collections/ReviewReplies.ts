import type { CollectionConfig } from 'payload'
import { isStaff } from '../lib/access'

export const ReviewReplies: CollectionConfig = {
  slug: 'review-replies',
  labels: {
    singular: 'Ответ на отзыв',
    plural: 'Ответы на отзывы',
  },
  admin: {
    useAsTitle: 'authorName',
    defaultColumns: ['review', 'authorName', 'status', 'createdAt'],
  },
  access: {
    read: ({ req }) => {
      if (isStaff(req)) return true
      return { status: { equals: 'published' } }
    },
    create: ({ req }) => isStaff(req),
    update: ({ req }) => isStaff(req),
    delete: ({ req }) => isStaff(req),
  },
  fields: [
    {
      name: 'review',
      type: 'relationship',
      relationTo: 'reviews',
      required: true,
    },
    {
      name: 'authorType',
      type: 'select',
      required: true,
      defaultValue: 'admin',
      options: [
        { label: 'Администрация сайта', value: 'admin' },
        { label: 'Представитель компании', value: 'company' },
      ],
    },
    { name: 'authorName', type: 'text', required: true },
    { name: 'body', type: 'textarea', required: true },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'published',
      options: [
        { label: 'Опубликован', value: 'published' },
        { label: 'Скрыт', value: 'hidden' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}
