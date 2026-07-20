import { type CollectionConfig } from 'payload'
import { isCustomer, isStaff } from '@/lib/access'

// Публичная коллекция аккаунтов посетителей сайта (не путать с Users —
// это админы/модераторы). Нужна для входа под своим именем при написании
// отзывов. Восстановление пароля по почте пока не подключено — требует
// стороннего email-сервиса (Resend и т.п.), это можно добавить позже.
export const Customers: CollectionConfig = {
  slug: 'customers',
  labels: {
    singular: 'Пользователь сайта',
    plural: 'Пользователи сайта',
  },
  auth: {
    // Без email-сервиса реальные письма (сброс пароля, верификация) не
    // отправляются — эту логику можно включить позже, настроив transport.
    // Важно: у Payload имя auth-cookie задаётся глобально (cookiePrefix
    // в payload.config), а не по коллекциям — при использовании и users,
    // и customers в одном браузере одновременно один вход может
    // "перебить" cookie другого. Для сайта с отдельными ролями
    // (админ vs посетитель) это не критично, но стоит иметь в виду.
    verify: false,
    maxLoginAttempts: 10,
    lockTime: 10 * 60 * 1000,
    removeTokenFromResponses: true,
  },
  admin: {
    group: 'Пользователи',
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'createdAt'],
  },
  access: {
    create: ({ req }) => isStaff(req),
    read: ({ req }) => {
      if (isStaff(req)) return true
      if (isCustomer(req) && req.user) return { id: { equals: req.user.id } }
      return false
    },
    update: ({ req }) => {
      if (isStaff(req)) return true
      if (isCustomer(req) && req.user) return { id: { equals: req.user.id } }
      return false
    },
    delete: ({ req }) => {
      if (isStaff(req)) return true
      if (isCustomer(req) && req.user) return { id: { equals: req.user.id } }
      return false
    },
  },
  fields: [
    {
      name: 'name',
      label: 'Имя',
      type: 'text',
      required: true,
      minLength: 2,
      maxLength: 80,
    },
    {
      name: 'companySubscriptions',
      label: 'Подписки на компании',
      type: 'relationship',
      relationTo: 'companies',
      hasMany: true,
      admin: { description: 'Компании, обновления которых пользователь отслеживает' },
    },
  ],
}
