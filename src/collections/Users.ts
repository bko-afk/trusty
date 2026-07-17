import type { CollectionConfig } from 'payload'
import { isAdmin, isStaff } from '../lib/access'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
    removeTokenFromResponses: true,
  },
  admin: {
    group: 'Пользователи',
    useAsTitle: 'email',
    defaultColumns: ['email', 'role'],
  },
  access: {
    create: ({ req }) => isAdmin(req),
    read: ({ req }) => isStaff(req),
    update: ({ req }) => {
      if (isAdmin(req)) return true
      if (isStaff(req) && req.user) return { id: { equals: req.user.id } }
      return false
    },
    delete: ({ req }) => isAdmin(req),
  },
  fields: [
    {
      name: 'name',
      label: 'Имя',
      type: 'text',
    },
    {
      name: 'role',
      label: 'Роль',
      type: 'select',
      required: true,
      defaultValue: 'moderator',
      access: {
        create: ({ req }) => isAdmin(req),
        update: ({ req }) => isAdmin(req),
      },
      options: [
        { label: 'Администратор', value: 'admin' },
        { label: 'Модератор', value: 'moderator' },
      ],
    },
  ],
}
