import type { CollectionConfig } from 'payload'
import { isStaff } from '@/lib/access'

export const ReviewVotes: CollectionConfig = {
  slug: 'review-votes',
  labels: {
    singular: 'Голос за отзыв',
    plural: 'Голоса за отзывы',
  },
  admin: {
    group: 'Система',
    defaultColumns: ['review', 'direction', 'createdAt'],
  },
  access: {
    read: ({ req }) => isStaff(req),
    create: () => false,
    update: () => false,
    delete: ({ req }) => isStaff(req),
  },
  fields: [
    {
      name: 'review',
      label: 'Отзыв',
      type: 'relationship',
      relationTo: 'reviews',
      required: true,
      index: true,
    },
    {
      name: 'voterKey',
      label: 'Анонимный ключ посетителя',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { hidden: true },
    },
    {
      name: 'direction',
      label: 'Голос',
      type: 'select',
      required: true,
      options: [
        { label: 'Полезно', value: 'up' },
        { label: 'Не полезно', value: 'down' },
      ],
    },
  ],
}
