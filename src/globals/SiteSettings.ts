import type { GlobalConfig } from 'payload'
import { isStaff } from '../lib/access'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Настройки сайта',
  admin: {
    group: 'Управление сайтом',
  },
  access: {
    read: () => true,
    update: ({ req }) => isStaff(req),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Главная страница',
          fields: [
            {
              name: 'homepage',
              label: 'Блоки главной',
              type: 'group',
              fields: [
                {
                  name: 'showServices',
                  label: 'Показывать блок сервисов',
                  type: 'checkbox',
                  defaultValue: true,
                },
                {
                  name: 'showComplaintCTA',
                  label: 'Показывать призыв оставить жалобу',
                  type: 'checkbox',
                  defaultValue: true,
                },
                {
                  name: 'showCompanyRanking',
                  label: 'Показывать рейтинг компаний',
                  type: 'checkbox',
                  defaultValue: true,
                },
                {
                  name: 'showLatestReviews',
                  label: 'Показывать последние отзывы',
                  type: 'checkbox',
                  defaultValue: true,
                },
                {
                  name: 'showMethodology',
                  label: 'Показывать методологию рейтинга',
                  type: 'checkbox',
                  defaultValue: true,
                },
                {
                  name: 'showNewCompanies',
                  label: 'Показывать новые компании',
                  type: 'checkbox',
                  defaultValue: true,
                },
                {
                  name: 'popularCompanies',
                  label: 'Популярные компании у поиска',
                  type: 'relationship',
                  relationTo: 'companies',
                  hasMany: true,
                  maxRows: 3,
                  admin: {
                    description: 'До 3 компаний. Если не выбраны, используются компании с отметкой «Популярная».',
                  },
                },
                {
                  name: 'rankingCompanies',
                  label: 'Компании в рейтинге на главной',
                  type: 'relationship',
                  relationTo: 'companies',
                  hasMany: true,
                  maxRows: 12,
                  admin: {
                    description: 'Порядок выбора сохраняется. Пустое поле использует редакционные позиции и оценку.',
                  },
                },
                {
                  name: 'newCompanies',
                  label: 'Компании в карусели «Недавно добавлены»',
                  type: 'relationship',
                  relationTo: 'companies',
                  hasMany: true,
                  maxRows: 9,
                  admin: {
                    description: 'Пустое поле показывает последние добавленные компании автоматически.',
                  },
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'rankingLimit',
                      label: 'Компаний в рейтинге',
                      type: 'number',
                      min: 3,
                      max: 12,
                      defaultValue: 12,
                    },
                    {
                      name: 'latestReviewsLimit',
                      label: 'Последних отзывов',
                      type: 'number',
                      min: 3,
                      max: 12,
                      defaultValue: 6,
                    },
                    {
                      name: 'newCompaniesLimit',
                      label: 'Компаний в карусели',
                      type: 'number',
                      min: 3,
                      max: 12,
                      defaultValue: 9,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Модерация',
          fields: [
            {
              name: 'moderationNotice',
              type: 'ui',
              admin: {
                components: {
                  Field: '/components/admin/ModerationNotice#ModerationNotice',
                },
              },
            },
          ],
        },
        {
          label: 'SEO и соцсети',
          fields: [
            {
              name: 'seo',
              label: 'Основные SEO-настройки',
              type: 'group',
              fields: [
                {
                  name: 'siteName',
                  label: 'Название сайта',
                  type: 'text',
                  defaultValue: 'Trusty',
                  maxLength: 60,
                },
                {
                  name: 'defaultTitle',
                  label: 'Заголовок главной страницы',
                  type: 'text',
                  defaultValue: 'Trusty — отзывы и рейтинги туристических страховых компаний',
                  maxLength: 70,
                  admin: { description: 'Рекомендуемая длина — до 60–70 символов.' },
                },
                {
                  name: 'defaultDescription',
                  label: 'Описание сайта',
                  type: 'textarea',
                  defaultValue:
                    'Каталог туристических страховых компаний, рейтинги, реальные отзывы клиентов и статьи о страховании путешественников.',
                  maxLength: 180,
                  admin: { description: 'Используется на главной и как запасное описание страниц.' },
                },
                {
                  name: 'socialImage',
                  label: 'Изображение для соцсетей',
                  type: 'upload',
                  relationTo: 'media',
                  admin: { description: 'Рекомендуемый размер — 1200×630 px.' },
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'googleVerification',
                      label: 'Google Search Console',
                      type: 'text',
                      admin: { description: 'Только значение verification-кода, без HTML-тега.' },
                    },
                    {
                      name: 'yandexVerification',
                      label: 'Яндекс Вебмастер',
                      type: 'text',
                      admin: { description: 'Только значение verification-кода, без HTML-тега.' },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
