import type { CollectionConfig, Where } from 'payload'
import { recalculateCompanyRating } from '@/lib/recalculateCompanyRating'
import { isCustomer, isStaff, isTrustedWrite } from '@/lib/access'
import { countries } from '@/lib/countries'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  labels: {
    singular: 'Отзыв',
    plural: 'Отзывы',
  },
  admin: {
    group: 'Модерация',
    useAsTitle: 'title',
    defaultColumns: ['title', 'company', 'rating', 'status', 'includeInRating', 'createdAt'],
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
    create: ({ req }) => isTrustedWrite(req),
    update: ({ req }) => isStaff(req),
    delete: ({ req }) => isStaff(req),
  },
  hooks: {
    beforeChange: [
      async ({ data, req, operation, originalDoc }) => {
        // Если отзыв отправляет залогиненный посетитель (коллекция
        // `customers`, а не админ `users`) — привязываем отзыв к его
        // аккаунту и подставляем имя/email по умолчанию, если не заданы.
        const user = req.user as any
        if (operation === 'create' && !isTrustedWrite(req)) {
          data.status = 'pending'
          data.helpfulUp = 0
          data.helpfulDown = 0
          data.verifiedExperience = false
          data.includeInRating = false
          delete data.customer
        }
        if (operation === 'create' && isCustomer(req)) {
          data.customer = user.id
          if (!data.authorName) data.authorName = user.name || user.email
          if (!data.authorEmail) data.authorEmail = user.email
        }
        const moderationStatus = data.status ?? originalDoc?.status ?? 'pending'
        data.includeInRating = moderationStatus === 'published'
        return data
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        const currentCompanyId = typeof doc.company === 'object' ? doc.company.id : doc.company
        const previousCompanyId = typeof previousDoc?.company === 'object' ? previousDoc.company.id : previousDoc?.company
        const affectsRating =
          !previousDoc ||
          String(previousCompanyId) !== String(currentCompanyId) ||
          previousDoc.status !== doc.status ||
          previousDoc.includeInRating !== doc.includeInRating ||
          previousDoc.rating !== doc.rating
        if (!affectsRating) return
        await recalculateCompanyRating(req.payload, doc.company, req)
        if (previousCompanyId && String(previousCompanyId) !== String(currentCompanyId)) {
          await recalculateCompanyRating(req.payload, previousCompanyId, req)
        }
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
      access: {
        read: ({ req }) => isStaff(req),
      },
      admin: { description: 'Заполняется автоматически, если отзыв оставил залогиненный пользователь' },
    },
    { name: 'authorName', label: 'Имя автора', type: 'text', required: true, minLength: 2, maxLength: 80 },
    {
      name: 'authorEmail',
      label: 'Email автора',
      type: 'email',
      access: {
        read: ({ req }) => isStaff(req),
      },
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
      name: 'experienceType',
      label: 'Тип опыта',
      type: 'select',
      required: true,
      defaultValue: 'purchase',
      options: [
        { label: 'Покупка и использование полиса', value: 'purchase' },
        { label: 'Страховой случай и выплата', value: 'claim' },
      ],
    },
    {
      name: 'policyType',
      label: 'Вид страхования',
      type: 'relationship',
      relationTo: 'insurance-types',
    },
    {
      name: 'tripCountry',
      label: 'Страна поездки/лечения',
      type: 'select',
      options: countries.map((country) => ({ label: `${country.ru} (${country.code})`, value: country.code })),
    },
    {
      name: 'claimOutcome',
      label: 'Результат страхового случая',
      type: 'select',
      defaultValue: 'not_applicable',
      options: [
        { label: 'Страхового случая не было', value: 'not_applicable' },
        { label: 'Выплачено полностью', value: 'paid' },
        { label: 'Выплачено частично', value: 'partially_paid' },
        { label: 'Отказано', value: 'denied' },
        { label: 'Рассматривается', value: 'pending' },
      ],
    },
    { name: 'claimAmount', label: 'Сумма требования/выплаты', type: 'text', maxLength: 120 },
    {
      name: 'responseTime',
      label: 'Скорость ответа компании',
      type: 'select',
      options: [
        { label: 'В тот же день', value: 'same_day' },
        { label: '1-3 дня', value: '1_3_days' },
        { label: '4-7 дней', value: '4_7_days' },
        { label: '8-30 дней', value: '8_30_days' },
        { label: 'Более 30 дней', value: 'more_30_days' },
        { label: 'Ответа не было', value: 'no_response' },
      ],
    },
    {
      name: 'verifiedExperience',
      label: 'Опыт подтверждён документами',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Отметьте после проверки полиса или документов по выплате' },
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
      admin: {
        position: 'sidebar',
        description: 'На сайте видны только отзывы со статусом «Опубликован».',
      },
    },
    {
      name: 'includeInRating',
      label: 'Учитывать оценку в рейтинге',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Устанавливается автоматически: опубликованный отзыв учитывается в рейтинге, любой другой статус исключает его из расчёта.',
      },
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
