import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { resendAdapter } from '@payloadcms/email-resend'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { InsuranceTypes } from './collections/InsuranceTypes'
import { Companies } from './collections/Companies'
import { Reviews } from './collections/Reviews'
import { ReviewReplies } from './collections/ReviewReplies'
import { Complaints } from './collections/Complaints'
import { Articles } from './collections/Articles'
import { Customers } from './collections/Customers'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// На Vercel (и вообще на любом serverless-хостинге) файловая система
// доступна только на чтение — загруженные логотипы/картинки нельзя
// сохранять на диск, они пропадут. Поэтому если заданы переменные
// S3_* (например, бесплатный бакет Cloudflare R2), подключаем
// S3-совместимое хранилище. Если их нет — Payload использует
// локальный диск (public/media), это подходит только для запуска
// на своей машине или на VPS.
const hasS3Config = Boolean(
  process.env.S3_BUCKET && process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY,
)
const trustedOrigin = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
const hasEmailConfig = Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM_ADDRESS)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: dirname,
    },
    meta: {
      titleSuffix: '— Админка Trusty',
    },
    components: {
      beforeDashboard: ['/components/admin/AdminDashboard#AdminDashboard'],
    },
  },
  editor: lexicalEditor({}),
  email: hasEmailConfig
    ? resendAdapter({
        apiKey: process.env.RESEND_API_KEY as string,
        defaultFromAddress: process.env.EMAIL_FROM_ADDRESS as string,
        defaultFromName: process.env.EMAIL_FROM_NAME || 'Trusty',
      })
    : undefined,
  collections: [
    Users,
    Media,
    InsuranceTypes,
    Companies,
    Reviews,
    ReviewReplies,
    Complaints,
    Articles,
    Customers,
  ],
  globals: [SiteSettings],
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
    // Отключаем автоматический "push" схемы в дев-режиме: при сложных
    // изменениях (новые relationship-таблицы, auth-коллекции и т.п.)
    // он иногда генерирует некорректный SQL и падает с ошибками вроде
    // "column is in a primary key". Вместо этого всегда используем
    // явные миграции (migrate:create / migrate) — надёжнее и предсказуемее.
    push: false,
  }),
  sharp,
  cors: [trustedOrigin],
  csrf: [trustedOrigin],
  graphQL: { disable: true },
  plugins: hasS3Config
    ? [
        s3Storage({
          collections: { media: true },
          bucket: process.env.S3_BUCKET as string,
          config: {
            credentials: {
              accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
              secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
            },
            region: process.env.S3_REGION || 'auto',
            endpoint: process.env.S3_ENDPOINT,
            forcePathStyle: true,
          },
        }),
      ]
    : [],
})
