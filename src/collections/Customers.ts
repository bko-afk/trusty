import type { CollectionConfig } from 'payload'

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
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'createdAt'],
  },
  access: {
    // Регистрация открыта всем
    create: () => true,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
  ],
}
